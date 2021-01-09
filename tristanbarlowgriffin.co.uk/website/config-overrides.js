const { override, babelInclude, addBabelPlugin, addWeb } = require('customize-cra')
const path = require('path')
const { exit } = require('process')

const workerLoader = {
  test: /\.worker\.ts/,
  include: path.resolve('src'),
  use: ["workerize-loader", "babel-loader"]
}

module.exports = override(
  addBabelPlugin(["@babel/plugin-transform-typescript", { "allowNamespaces": true }]),
  babelInclude([
    path.resolve('src'),        // make sure you link your own source
    path.resolve('../packages/types'),  // your shared module to transpile
  ]), (config)=>{
    const wasmExtensionRegExp = /\.wasm$/;

    config.resolve.extensions.push('.wasm');

    config.module.rules.forEach(rule => {
        (rule.oneOf || []).forEach(oneOf => {
            if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
                // Make file-loader ignore WASM files
                oneOf.exclude.push(wasmExtensionRegExp);
            }
        });
    });

    // Add a dedicated loader for WASM
    config.module.rules.push({
        test: wasmExtensionRegExp,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: require.resolve('wasm-loader'), options: {} }]
    });

    return config;
  }
)