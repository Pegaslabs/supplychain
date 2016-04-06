var path = require('path');
var webpack = require('webpack');

var entry = './src/app/main.js',
  output = {
    path: __dirname,
    filename: 'main.js'
  };

module.exports.development = {
    debug : true,
    devtool : 'eval',
    entry: entry,
    output: output,
    resolve: {
        fallback: path.join(__dirname, "./src/app/helpers")
    },
    plugins: [
        new webpack.ProvidePlugin({
           jQuery: "jquery"
       })
    ],
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    }
};

module.exports.development = {
    debug : false,
    devtool : 'eval',
    entry: entry,
    output: output,
    resolve: {
        fallback: path.join(__dirname, "./src/app/helpers")
    },
    plugins: [
        new webpack.ProvidePlugin({
           jQuery: "jquery"
       })
    ],
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    }
};
