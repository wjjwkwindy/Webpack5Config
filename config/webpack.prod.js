const os = require('os');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin'); // PWA

const threads = os.cpus().length; // CPU核数

// 获取处理样式的loader
const getStyleLoaders = (preProcessor) => {
    return [
        MiniExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        // fullhash（webpack4 是 hash）：每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
        // chunkhash：根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。
        // contenthash：根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。
        filename: 'static/js/[name].[contenthash:8].js', // 入口文件打包输出资源命名方式
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js', // 动态导入输出资源命名方式
        assetModuleFilename: 'static/media/[name].[hash][ext]', // 图片、字体等资源命名方式（注意用hash）
        clean: true,
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.html$/i,
                        use: ['html-loader'],
                    },
                    {
                        test: /\.css$/i,
                        use: getStyleLoaders(),
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoaders('less-loader'),
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoaders('sass-loader'),
                    },
                    {
                        test: /.styl$/i,
                        use: getStyleLoaders('stylus-loader'),
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        type: 'asset', // asset 为自动选择，小于8k，inline，否则为resource
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024,
                            },
                        },
                        // generator: {
                        //     filename: 'static/imgs/[hash:8][ext][query]',
                        // },
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/i,
                        type: 'asset/resource',
                        // generator: {
                        //     filename: 'static/media/[hash:8][ext][query]',
                        // },
                    },
                    {
                        test: /\.js$/i,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'thread-loader', // 开启多线程
                                options: {
                                    workers: threads, // 数量
                                },
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩
                                    plugins: [
                                        '@babel/plugin-transform-runtime',
                                    ], // 减少代码体积（禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 @babel/plugin-transform-runtime 并且使所有辅助代码从这里引用。）
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules',
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                '../node_modules/.cache/.eslintcache'
            ),
            threads, // 开启多线程
        }),
        // 提取css成单独文件
        new MiniExtractPlugin({
            // 定义输出文件名和目录
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        // new CssMinimizerPlugin(),

        // Preload / Prefetch
        /* 
           共同点：都只会加载资源，并不执行。都有缓存。
           区别：Preload：告诉浏览器立即加载资源(优先级高)。Prefetch：告诉浏览器在空闲时才开始加载资源(优先级低)。
           Preload 相对于 Prefetch 兼容性好一点。
           总结：当前页面优先级高的资源用 Preload 加载。下一个页面需要使用的资源用 Prefetch 加载。
        */
        new PreloadWebpackPlugin({
            rel: 'preload', // preload兼容性更好
            as: 'script',
            // rel: 'prefetch', // prefetch兼容性更差
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            // css 压缩也可以写到这里
            new CssMinimizerPlugin(),
            // 生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads, // 开启多线程
            }),
            // 压缩图片（有损压缩）(PS：GIF无法压缩)
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.squooshMinify,
                    options: {
                        encodeOptions: {
                            mozjpeg: {
                                // That setting might be close to lossless, but it’s not guaranteed
                                // https://github.com/GoogleChromeLabs/squoosh/issues/85
                                quality: 90,
                            },
                            webp: {
                                lossless: 0.9,
                            },
                            avif: {
                                // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                                cqLevel: 0,
                            },
                        },
                    },
                },
            }),
            // end 压缩图片
        ],
        // 代码分割配置
        splitChunks: {
            chunks: 'all', // 对所有模块都进行分割
            // 其他内容用默认配置即可
        },
        // 提取runtime文件(原因如下)
        /*
           当我们修改 math.js 文件再重新打包的时候，因为 contenthash 原因，math.js 文件 hash 值发生了变化（这是正常的）。
           但是 main.js 文件的 hash 值也发生了变化，这会导致 main.js 的缓存失效。明明我们只修改 math.js, 为什么 main.js 也会变身变化呢？
           更新前：math.xxx.js, main.js 引用的 math.xxx.js
           更新后：math.yyy.js, main.js 引用的 math.yyy.js, 文件名发生了变化，间接导致 main.js 也发生了变化

           所以将 hash 值单独保管在一个 runtime 文件中。
           最终输出三个文件：main、math、runtime。当 math 文件发送变化，变化的是 math 和 runtime 文件，main 不变。
           runtime 文件只保存文件的 hash 值和它们与文件关系，整个文件体积就比较小，所以变化重新请求的代价也小。
         */
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
};
