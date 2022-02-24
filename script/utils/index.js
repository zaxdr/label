const path = require('path')
const envJson = require("../../env.json") 

//所有注入的 process.env 变量
const systemGLobalEnv = {};

let envMap = envJson[process.env.NODE_ENV] || {};
for (let key in envMap) {
    systemGLobalEnv[`process.env.${key}`] = JSON.stringify(envMap[key])
}


module.exports = {
    REACT_APP_BASE_API: envMap['REACT_APP_BASE_API'] || "/dev-api",
    proxy_target: envMap['proxy_target'] || 'http://127.0.0.1:8080',
    PUBLIC_URL:envMap["PUBLIC_URL"] ||'',
    env: systemGLobalEnv,//process.env 变量
}