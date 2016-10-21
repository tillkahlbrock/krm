var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './app/main.esnext.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build'
    },
    module: {
        loaders: [
            {
                test: /\.esnext\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};
