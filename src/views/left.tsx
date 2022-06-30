import LabelItem from "@/components/comm/LabelItem"
import { FontSizeList, ICodeKeys, IContentKeys, IPaperKeys, QRTyleList, QRType, UnitList, UnitType } from "@/model/options"
import { Button, Card, Input, InputNumber, message, Select, Switch } from "antd"
import { useDispatch, useSelector } from "react-redux"
import IStore from "@/model/StoresModel";
import { useCallback, useRef } from "react";
import { setCodeData, setContentData, setIsContent, setPaperData, setQrType, switchConfig } from "@/stores/pageStore";
import  { VisibleShowNode } from "@/components/comm/VisibleNode";
import { useState } from "react";
import { clearConfig, loadConfig, saveConfig, setActiveName } from "@/stores/configStore";

const LeftComponent = () => {
    const { pageStore, configStore } = useSelector((store: IStore) => store);
    const { paperData, codeData, contentData, qrType, isContent } = pageStore;
    const { configList, activeName } = configStore;
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>();
    const [configName, setConfigName] = useState<string>()

    //修改码的类型
    const changeQrType = useCallback((e: QRType) => {
        if(e==="UPC"){
            changeContent("text","049000011340")
        }
        dispatch(setQrType(e));
    }, [qrType, dispatch])

    //修改纸张属性
    const changePaperData = useCallback((k: IPaperKeys, v: UnitType | number) => {
        if(v && v.toString().length > 0){
            dispatch(setPaperData({ k, v }))
        }else{
            message.error("值不可以为空")
        }
    }, [dispatch])

    //修改码的属性
    const changeCodeData = useCallback((k: ICodeKeys, v: number) => {
        if(v && v.toString().length > 0){
            dispatch(setCodeData({ k, v }))
        }else{
            message.error("值不可以为空")
        }
    }, [dispatch])

    //显示影藏
    const handleHide = useCallback((bool: boolean) => {
        dispatch(setIsContent(bool))
    }, [dispatch])

    //修改内容值
    const changeContent = useCallback((k: IContentKeys, v: string | number) => {
        if(v && v.toString().length > 0){
            dispatch(setContentData({ k, v }))
        }else{
            message.error("值不可以为空")
        }
      
    }, [dispatch])

    //选择配置
    const selectConfig = useCallback((v: string) => {
        dispatch(setActiveName(v))
        let obj = configList.find(it => it.name === v);
        if (obj) {
            dispatch(switchConfig(obj.config))
        }

    }, [dispatch,configList])

    //保存
    const save = useCallback(() => {
        let obj = { ...pageStore };
        if(configName){
            dispatch(saveConfig({ name: configName, config: obj }))
        }else{
            message.error("请输入配置名称")
        }
      
    }, [dispatch, configName,pageStore])

    //加载
    const load = useCallback((e: any) => {
        let file = e.target.files;
        file && dispatch(loadConfig(file[0]))
    }, [dispatch])

    //清除本地配置
    const clearLocal = useCallback(()=>{
        dispatch(clearConfig())
    },[dispatch])

    return <>
        <Card size="small" title="纸张大小" >
            <LabelItem title="宽">
                <InputNumber className="w100" min={0} minLength={1} value={paperData.width} onChange={e => changePaperData("width", e)} />
            </LabelItem>
            <LabelItem title="高">
                <InputNumber className="w100" min={0} minLength={1} value={paperData.height} onChange={e => changePaperData("height", e)} />
            </LabelItem>
            <LabelItem title="单位">
                <Select className="w100" value={paperData.unit} onChange={e => changePaperData("unit", e)}>
                    {UnitList.map(it => {
                        return <Select.Option key={it} value={it} >{it}</Select.Option>
                    })}
                </Select>
            </LabelItem>

        </Card>
        <Card size="small" title="条码/二维码" style={{ marginTop: 8 }}>
            <LabelItem title="类型">
                <Select className="w100" value={qrType} onChange={e => changeQrType(e)}>
                    {QRTyleList.map(it => {
                        return <Select.Option key={it} value={it} >{it}</Select.Option>
                    })}
                </Select>
            </LabelItem>
            <LabelItem title="宽">
                <InputNumber className="w100" min={0} minLength={1}  value={codeData.w} onChange={e => changeCodeData("w", e)} />
            </LabelItem>
            <LabelItem title="高">
                <InputNumber className="w100" min={0} minLength={1}  value={codeData.h} onChange={e => changeCodeData("h", e)} />
            </LabelItem>
            <LabelItem title="X">
                <InputNumber className="w100" min={0} minLength={1}  value={codeData.x} onChange={e => changeCodeData("x", e)} />
            </LabelItem>
            <LabelItem title="Y">
                <InputNumber className="w100" min={0} minLength={1}  value={codeData.y} onChange={e => changeCodeData("y", e)} />
            </LabelItem>
        </Card>
  
        <Card size="small" title="内容" style={{ marginTop: 8 }} extra={<Switch checked={isContent} checkedChildren="显示" unCheckedChildren="影藏" onChange={handleHide} />}>
                <LabelItem title="初始化值">
                    <Input className="w100" value={contentData.text} onChange={e => changeContent("text", e.target.value)} />
                </LabelItem>
                <LabelItem title="字体大小">
                    <Select className="w100" value={contentData.fontSize} onChange={e => changeContent("fontSize", e)} >
                        {FontSizeList.map(it => {
                            return <Select.Option key={it} value={it}>{it}</Select.Option>
                        })}
                    </Select>
                </LabelItem>
                <LabelItem title="X">
                    <InputNumber className="w100" min={0} minLength={1}  value={contentData.x} onChange={e => changeContent("x", e)} />
                </LabelItem>
                <LabelItem title="Y">
                    <InputNumber className="w100" min={0} minLength={1}  value={contentData.y} onChange={e => changeContent("y", e)} />
                </LabelItem>

        </Card>
        <Card size="small" style={{ marginTop: 8 }} >

            <LabelItem title="配置列表">
                <Select className="w100" value={activeName} onChange={selectConfig} >
                    {configList.map(it => {
                        return <Select.Option key={it.name} value={it.name}>{it.name}</Select.Option>
                    })}
                </Select>
            </LabelItem>

            <div className="btns">
                <LabelItem title="配置名称">
                    <Input className="w100" value={configName} onChange={e => setConfigName(e.target.value)} />
                </LabelItem>
                <Button type="primary" onClick={save} >保存配置</Button>
                <Button type="primary" onClick={() => inputRef.current.click()}   >
                    <input type="file" hidden ref={inputRef} accept=".json" onChange={load} />
                    加载配置
                </Button>
                <Button onClick={clearLocal}>清除本地配置</Button>
            </div>


        </Card>

    </>
}

export default LeftComponent