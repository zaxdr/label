import { ConfigItemType, IConfig, ISliceOptions } from "@/model/StoresModel";
import { configOption, defaultConfig } from "@/utils/labelUtils";
import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import store, { AppDispatch } from ".";
import { switchConfig } from "./pageStore";

const config = configOption();

const initValue: IConfig = {
    activeName: "默认",
    configList: config.init(),
    loading:false
}


const ConfigStore = createSlice({
    name: "configStore",
    initialState: initValue,
    reducers: {
        pushConfig(state, option: ISliceOptions<ConfigItemType>) {
            let config: ConfigItemType = option.payload;
            let list = state.configList;
            let index = list.findIndex(it => it.name === config.name);
            if (index >= 0) {
                //替换
                state.configList[index] = config;
            } else {
                //添加
                state.configList.push(config)
            }

        },
        setConfigList(state, option: ISliceOptions<ConfigItemType[]>) {
            state.configList = option.payload;
        },
        setActiveName(state, option: ISliceOptions<string>) {
            state.activeName = option.payload;
        },
        setLoading(state,option:ISliceOptions<boolean>){
            state.loading = option.payload;
        }
    }
})


export const { pushConfig, setActiveName, setConfigList,setLoading } = ConfigStore.actions;





//保存json文件单个
//本地 多个


//保存配置
export const saveConfig = (obj: ConfigItemType) => (dispatch: AppDispatch) => {
    //保存配置
    const configObject = store.getState().configStore as IConfig;
    let configList = [...configObject.configList];
    let index = configList.findIndex(it => it.name === obj.name);
    if (index >= 0) {
        //替换
        configList[index] = obj;
    } else {
        //添加
        configList.push(obj)
    }
    config.save(configList);//保存在本地是多个
    config.download(obj); //保存单个
    dispatch(setConfigList(configList))
    dispatch(setActiveName(obj.name));
    message.success("保存成功")

}
//加载配置(加载单个json文件)
export const loadConfig = (file: File) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    let obj: ConfigItemType = await config.load(file);
    if (obj) {
        dispatch(pushConfig(obj))
        dispatch(setActiveName(obj.name));
        message.success("加载成功");
    } else {
        message.error("加载失败");
    }
    dispatch(setLoading(false))
}

export const clearConfig = () => (dispatch: AppDispatch) => {
    config.clear();
    dispatch(setConfigList([defaultConfig]))
    dispatch(setActiveName(defaultConfig.name));
    dispatch(switchConfig(defaultConfig.config))
}



export default ConfigStore.reducer;