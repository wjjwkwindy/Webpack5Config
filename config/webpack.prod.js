const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

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
    entry: './src/main.js',
    output: {
        filename: 'static/js/[name].js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    },
    module: {
        rules: [
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
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, '../src'),
        }),
        new MiniExtractPlugin({
            filename: 'static/css/main.css',
        }),
        new CssMinimizerPlugin(),
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
    },
};
