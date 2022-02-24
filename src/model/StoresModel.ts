import { ICode, IData, IContent, IPaper, QRType, DataType } from "./options";

export interface IPageStore {
  codeData: ICode,
  contentData: IContent,
  paperData: IPaper,
  data: IData,
  isContent: boolean,
  qrType: QRType
  dataType: DataType,
}

export type ConfigItemType = { name: string, config: IPageStore };

export interface IConfig {
  activeName: string, //当前选中
  configList: ConfigItemType[]
  loading:boolean
}

export interface ISliceOptions<T = any> {
  type: string,
  payload: T
}
export default interface IStore {
  pageStore: IPageStore
  configStore: IConfig
}
