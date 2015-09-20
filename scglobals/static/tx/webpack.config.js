var path = require('path');

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
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.handlebars$/, loader: "handlebars-loader" }

            // { test: /\.handlebars$/, loader: "handlebars-loader?helperDirs[]=" + "./src/app/helpers" }
        ]
    }
};

module.exports.production = {
    debug: false,
    entry: entry,
    output: output,
    resolve: {
        fallback: path.join(__dirname, "helpers")
    },
    module : {
        loaders : [
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    }
};