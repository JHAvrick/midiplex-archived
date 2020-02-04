var path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js',
    target: "electron-renderer",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    node: {
        __filename: true,
        __dirname: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    //MiniCssExtractPlugin.loader, //FOR PRODUCTION
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    resolve: {
        alias: {
            /**
             * Source Paths
             */
            src: path.resolve(__dirname, 'src'),
            config: path.resolve(__dirname, 'src', 'config'),
            definitions:  path.resolve(__dirname, 'src', 'definitions'),
            nodes: path.resolve(__dirname, 'src', 'nodes'),
            scene: path.resolve(__dirname, 'src', 'scene'),
            structures: path.resolve(__dirname, 'src', 'structures'),
            util: path.resolve(__dirname, 'src', 'util'),
           
            /**
             * View Paths
             */
            styles: path.resolve(__dirname, 'view', 'styles'),
            components: path.resolve(__dirname, 'view', 'components'),
            hooks: path.resolve(__dirname, 'view', 'hooks')
        }
    }
    /*
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        writeToDisk: true,
        compress: true,
        port: 8000
    }
    */
};