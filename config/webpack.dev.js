const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: './src/main.js',
    output: {
        filename: 'static/js/[name].js',
        path: path.resolve(__dirname, '../dist'),
        clean: true, // 开发模式没有输出，不需要清空输出结果
    },
    module: {
        rules: [
            {
                oneOf: [
                    //匹配一个loader，剩下的不匹配，节约时间
                    {
                        test: /\.css$/i,
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.less$/i,
                        use: ['style-loader', 'css-loader', 'less-loader'],
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: ['style-loader', 'css-loader', 'sass-loader'],
                    },
                    {
                        test: /.styl$/i,
                        use: ['style-loader', 'css-loader', 'stylus-loader'],
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        type: 'asset', // asset 为自动选择，小于8k，inline，否则为resource
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024,
                            },
                        },
                        generator: {
                            filename: 'static/imgs/[hash:8][ext][query]',
                        },
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/i,
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/media/[hash:8][ext][query]',
                        },
                    },
                    {
                        test: /\.js$/i,
                        // exclude: /node_modules/, // 排除node_modules代码不编译
                        include: path.resolve(__dirname, '../src'), // 也可以用包含
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, //开启babel编译缓存
                            cacheCompression: false, //缓存文件不要压缩
                        },
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
        }),
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
    },
};
