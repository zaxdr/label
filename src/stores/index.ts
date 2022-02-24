

import {  configureStore } from '@reduxjs/toolkit';
import logger from "redux-logger"

interface Reducer {
  [x: string]: any;
};

const reducer:Reducer = {};

//动态加载 Store模块
const req = require.context('.', true, /Store$/);
req.keys().forEach((key:string) => {
  const list:string[] | null = key.match(/([a-zA-Z0-9].*)$/);
  if(list && list.length >0){
    const name:string  =  list[1];
    reducer[name] = req(key).default;
  }
});

const store = configureStore({
 reducer,
 middleware:getDefaultMiddleware=>{
   const temp = getDefaultMiddleware({serializableCheck:false});
   return process.env.NODE_ENV !== 'production' ? temp.concat([logger]) : temp; //开发环境启用日志
 },
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;

export default store;

