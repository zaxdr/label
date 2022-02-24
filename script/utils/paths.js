const path = require('path')
module.exports = {
    appSrc: path.resolve(__dirname, '../../src'),
    buildDist: path.resolve(__dirname, '../../dist'),
    node_modules: path.resolve(__dirname, 'node_modules'),
    templateSrc: path.resolve(__dirname, '../../public'),
    templateHtml: path.resolve(__dirname, '../../public/index.html'),
    appIndex: path.resolve(__dirname, '../../src/index.tsx'),
    src:path.resolve(__dirname, '../../src')
}