const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./common/config/env.js', 'w', function (err, fd) {
    if (err) { throw err; };
    const buf = 'export default \'development\';';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
        if (err) { throw err; };
    });
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './index.ejs',
            inject: false
        })
    ],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.livevideo.com:9898',
                secure: false,
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            }
        }
    }
});
