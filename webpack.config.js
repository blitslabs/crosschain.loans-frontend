const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
// react webpack express babel
// https://levelup.gitconnected.com/how-to-setup-environment-using-react-webpack-express-babel-d5f1b572b678
// nodemon and webpack dev server
// https://itnext.io/auto-reload-a-full-stack-javascript-project-using-nodemon-and-webpack-dev-server-together-a636b271c4e

module.exports = {
    entry: {
        app: path.join(__dirname, 'app_src', 'index.js'),
        //admin: path.join(__dirname, 'admin_src','index.js')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            
            
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        publicPath: '/js',
        filename: '[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv(),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        host: 'genesisblock.ddns.net', // genesisblock.ddns.net
        port: 8080,
        contentBase: path.join(__dirname, '/public'),
        watchContentBase: true,
        proxy: [
            {
                context: ['^/api/*', '^/app/*'],
                target: 'http://genesisblock.ddns.net:3000/',
                secure: false
            }
        ],
        overlay: {
            warnings: false,
            errors: true
        }
    },
}