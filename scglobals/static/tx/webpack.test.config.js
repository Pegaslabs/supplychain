var path = require('path');

var entry = './test/main-test.js',
  output = {
    path: __dirname + '/test/',
    filename: 'main-test-out.js'
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
            { test: /\.hbs$/, loader: "handlebars-loader" }
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
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    }
};