# Dorabot react web app

|  环境   | 版本  | 说明
|  ----  | ----  | ---- |
| node  | >=v12.13.0 | node版本 |
| yarn  | >=1.22.17 | 使用yarn  |


## 项目初始化

下载yarn(已有yarn 请忽略)
> npm install yarn -g 

下载依赖
> yarn   

开发环境配置
> env.json

```json
{
    "development": {
        "REACT_APP_BASE_API": "/dev-api",
        "proxy_target": "http://localhost:8080/", 
        "PUBLIC_URL": ""
    },
    "production": {
        "REACT_APP_BASE_API": "/prod-api",
        "PUBLIC_URL": ""
    }
}
```

## 可用脚本


### 启动项目 

```
yarn start
```

### 打包项目

```
yarn build
```



