
module.exports = {
    mode: "production",
    entry: "./index.js",
    devtool: "source-map",
    target: "node",
    node: {
        process: false
    },
    output: {
        path: __dirname + "/bundle",
        filename: "slimq.js",
        libraryTarget: "umd",
        globalObject: "this",
    },
    resolve: {
        extensions: [".js"]
    },
    externals: {
        "mqtt": "mqtt"
    }
};