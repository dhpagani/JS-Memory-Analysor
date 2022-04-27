const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const hwp = require('html-webpack-plugin');

module.exports = {
    entry: {
        externs: path.join(__dirname, '/front_end/externs.js'),
        main: {
            import: path.join(__dirname, '/src/index.js'),
            dependOn: 'externs'
        }
    },
    devtool: 'source-map',
    mode: 'development',
    output: {
        clean: true,
        filename: '[name][fullhash].js',
        path: path.join(__dirname, '/dist')
    },
    resolve: {
        alias: {
          Images: path.resolve(__dirname, 'front_end/Images')
        },
      },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/'@webcomponents'/],

            use: [
                {
                    loader: 'thread-loader',
                    options: {
                        poolTimeout: 5000
                    }
                },
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false
                    }
                }]
        },
        {
            test: /\.(png|jpg|svg)/,
            type: 'asset/resource'
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }
        ]
    },
    devServer: {
        compress: true,
        port: 9999,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new hwp({ template: path.join(__dirname, '/front_end/inspector.html') })
    ],

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    enforce: true,
                },
                front_end: {
                    test: /[\\/]front_end[\\/]/,
                    priority: -10,
                    enforce: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    }
};
