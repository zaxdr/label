import { ICode, IPaper, QRType, UnitType, IContent, ICodeKeys, IPaperKeys, IContentKeys, DataType, defaultTextValue, IDataKeys, IData } from "@/model/options";
import { IPageStore, ISliceOptions } from "@/model/StoresModel";
import { createSlice } from "@reduxjs/toolkit";



export const QRTyleList: QRType[] = ["QRCode", "CODE128", "CODE39", "EAN13", "UPC"]

export const UnitList: UnitType[] = ["pt", "px", "in", "mm", "cm", "ex", "em", "pc"]

export const FontSizeList: number[] = [12, 13, 15, 16, 17, 18, 19, 20, 21, 22]



export const pageStoreInit: IPageStore = {
    qrType: "QRCode",
    codeData: {
        w: 4,
        h: 4,
        x: 1.5,
        y: 0,
    },
    paperData: {
        width: 7,
        height: 5,
        unit: "cm"
    },
    contentData: {
        fontSize: 15,
        fontType: "",
        text: defaultTextValue,
        x: 2,
        y: 4.2,
    },
    isContent: true,
    data: {
        start: "", //开始值
        end: "", //结束值
        total: 1,
        isStep: false,//是否递增
        fixedValue: "",//固定值
        num: 1,//个数
        preview: ""
    },
    dataType: "Fiexd",
}



const PageStore = createSlice({
    name: "pageStore",
    initialState: pageStoreInit,
    reducers: {
        //设置码的类型
        setQrType(state, options: ISliceOptions<QRType>) {
            state.qrType = options.payload;
        },

        //设置码
        setCodeData(state, options: ISliceOptions<{ k: ICodeKeys, v: number }>) {
            const { k, v } = options.payload;
            let temp: ICode = { ...state.codeData };
            temp[k] = v;
            state.codeData = temp;
        },

        //设置纸张
        setPaperData(state, options: ISliceOptions<{ k: IPaperKeys, v: UnitType | number }>) {
            const { k, v } = options.payload;
            let temp: IPaper = { ...state.paperData };
            if (typeof v === "string" && k === "unit") {
                temp.unit = v;
            }
            if (typeof v === "number") {
                if (k === "height") temp.height = v;
                if (k === "width") temp.width = v;
            }
            state.paperData = temp;
        },

        //设置内容是否显示
        setIsContent(state, options: ISliceOptions<boolean>) {
            state.isContent = options.payload;
        },

        //设置内容信息
        setContentData(state, options: ISliceOptions<{ k: IContentKeys, v: string | number }>) {
            const { k, v } = options.payload;
            let temp: IContent = state.contentData;
            if (typeof v === "number" && k !== "fontType" && k !== "text") {
                temp[k] = v;
            }
            if (typeof v === "string") {
                if (k === "fontType") temp.fontType = v;
                if (k === "text") temp.text = v;
            }
            state.contentData = temp;
        },

        //设置数据类型
        setDataType(state, options: ISliceOptions<DataType>) {
            state.dataType = options.payload;
        },

        //设置数据
        setData(state, options: ISliceOptions<{ k: IDataKeys, v: never }>) {
            const { k, v } = options.payload;
            let temp: IData = state.data;
            temp[k] = v;
            state.data = temp;
        },

        //切换配置
        switchConfig(state, option: ISliceOptions<IPageStore>) {
            let config: IPageStore = option.payload;
            for (let key in config) {
                state[key] = config[key];
            }
        }
    }
})

export const { setCodeData, setPaperData, setIsContent, setContentData, setQrType, setDataType, setData, switchConfig } = PageStore.actions;


export default PageStore.reducer

