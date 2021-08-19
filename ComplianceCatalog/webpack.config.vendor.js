"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, args) => {
    const isDevBuild = !(args && args.mode === "production");
    return [
        {
            mode: isDevBuild ? "development" : "production",
            resolve: { extensions: [".js", ".ts", ".tsx"] },
            module: {
                rules: [
                    { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: "url-loader?limit=100000" },
                    {
                        test: /\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    publicPath: (resourcePath, context) => {
                                        return path.relative(path.dirname(resourcePath), context) + '/';
                                    }
                                }
                            },
                            "css-loader"
                        ]
                    },
                    {
                        test: /\.(png|jpg|gif)$/i,
                        use: [
                            {
                                loader: "url-loader",
                                options: {
                                    limit: 10000
                                }
                            }
                        ]
                    }
                ]
            },
            entry: {
                vendor: [
                    "react",
                    "react-dom",
                    "react-redux",
                    "react-select"
                ]
            },
            output: {
                path: path.join(__dirname, "wwwroot", "dist"),
                publicPath: "dist/",
                filename: "[name].js",
                library: "[name]"
            },
            plugins: [
                new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),
                new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
                new webpack.DllPlugin(
                    {
                        path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
                        name: "[name]"
                    }), 
            ],
            optimization: {
                minimize: !isDevBuild,
                minimizer: [new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    },
                    parallel: true
                })]
            }
        }
    ];
}