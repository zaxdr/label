
export type QRType = "QRCode" | "CODE128" | "CODE39" | "EAN13" | "UPC"
export type UnitType = "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc"
export type DataType = "Fiexd" | "Auto"
export const QRTyleList: QRType[] = ["QRCode", "CODE128", "CODE39", "EAN13", "UPC"]
export const UnitList: UnitType[] = ["pt", "px", "in", "mm", "cm", "ex", "em", "pc"]
export const FontSizeList: number[] = [12, 13, 15, 16, 17, 18, 19, 20, 21, 22]
export const DataTypeList: { key: DataType, title: string }[] = [{ key: "Auto", title: "动态值" }, { key: "Fiexd", title: "固定值" }]
export const defaultTextValue: string = "A100000001";

//码
export interface ICode {
    w: number,
    h: number,
    x: number,
    y: number,
}

//字
export interface IContent {
    fontSize: number,
    fontType: string,
    text: string,
    x: number,
    y: number,
}
//纸
export interface IPaper {
    width: number,
    height: number,
    unit: UnitType
}


export interface IData {
    start: string, //开始值
    end: string, //结束值
    total:number,
    isStep:boolean,//是否递增
    fixedValue: string,//固定值
    num:number,//个数
    preview:string

}

export type IPaperKeys = keyof IPaper;
export type ICodeKeys = keyof ICode
export type IContentKeys = keyof IContent;
export type IDataKeys = keyof IData





