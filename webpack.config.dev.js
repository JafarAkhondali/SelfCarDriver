const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

    devtool: 'eval',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: 'App_[name].js'
    },

    devServer: {
        host: '0.0.0.0',
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
			"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Tus-Resumable"
		}
    }

});
