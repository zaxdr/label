import LabelItem from "@/components/comm/LabelItem";
import VisibleNode from "@/components/comm/VisibleNode";
import GitComponent from "@/components/github";
import { DataType, DataTypeList } from "@/model/options";
import IStore from "@/model/StoresModel";
import { setDataType } from "@/stores/pageStore";
import { useCreatePDF,customCreatePDF } from "@/utils/hooks";
import { createList, printPdf, createListV2 } from "@/utils/labelUtils";
import { Button, Card, Input, InputNumber, message, Select, Switch, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"

const TextArea = Input.TextArea;


const RightComponent = () => {
    const { codeData, paperData, isContent, contentData, qrType ,dataType} = useSelector((store: IStore) => store.pageStore);
    const { create } = useCreatePDF({codeData, paperData, isContent, contentData, qrType})
    const [start, setStart] = useState<string>("A100000001");
    const [total, setTotal] = useState<number>(1);
    const [isStep, setIsStep] = useState<boolean>(false);
    const [fixedValue, setFixedValue] = useState<string>("A100000001\nA100000002");//初始化固定值
    const [fileName,setFileName] = useState<string>(`label-${new Date().getTime()}`) // 文件名称
    const [num, setNum] = useState<number>(1);
    const dispatch = useDispatch();
    const [printList, setPrintList] = useState<string[]>([]);
    //修改类型
    const changeDataType = useCallback((value: DataType) => {
        dispatch(setDataType(value))
    }, [dispatch])

    const getPrintList = useCallback(()=>{
        let list: string[] = [];
        if (dataType === "Auto") {
            list =   createListV2(start,num,total,isStep)
        } else {
            list = fixedValue.trim().split("\n");//去除前后空格 然后按换行分割
        }
        return list;
    },[printList,fixedValue,dataType,start,num,total,isStep])


    //打印
    const print = () => {
        let list = getPrintList();
        if (list.length === 0) {
            message.error("请输入需要生成的数据")
            return;
        }
        customCreatePDF(list,(pdf)=>{
            let st: any = pdf.output("bloburl")
            printPdf(st)
        },{
            codeData, paperData, isContent, contentData, qrType ,dataType
        })
    }

    //下载
    const dowload = () => {
        let list = getPrintList();
        if (list.length === 0) {
            message.error("请输入需要生成的数据")
            return;
        }
        customCreatePDF(list,(pdf)=>{
            pdf.save(`${fileName}.pdf`)
        },{
            codeData, paperData, isContent, contentData, qrType ,dataType
        })
    }

    //生成数据
    const createReview = useCallback(()=>{
        if (!start) {
            message.error("请输入开始值");
            return;
        }
        setPrintList(getPrintList());
    },[start,getPrintList])


    return <Card title="批量生成" size="small" extra={<GitComponent/>}>
        <LabelItem title="数据类型">
            <Select className="w100" value={dataType} onChange={changeDataType}>
                {DataTypeList.map(it => {
                    return <Select.Option key={it.key} value={it.key}>{it.title}</Select.Option>
                })}
            </Select>
        </LabelItem>

        <VisibleNode visible={dataType === "Fiexd"}>
            <LabelItem title="固定值">
                <TextArea rows={10} value={fixedValue} onChange={e => setFixedValue(e.target.value)} />
                <Tag color="lime">多个使用回车换行</Tag>
            </LabelItem>

        </VisibleNode>
        <VisibleNode visible={dataType === "Auto"}>
            <LabelItem title="是否递增">
                <Switch checked={isStep} checkedChildren="是" unCheckedChildren="否" onChange={setIsStep} />
            </LabelItem>
            <LabelItem title="开始值">
                <Input value={start} onChange={e => setStart(e.target.value)} />
            </LabelItem>
            <LabelItem title="总数">
                <InputNumber value={total} min={0} onChange={(e)=>setTotal(e)} />
            </LabelItem>
            <LabelItem title="单个倍数">
                <InputNumber value={num} min={1} onChange={(e)=>setNum(e)} />
                <Tag color="lime">{total * num}</Tag>
            </LabelItem>
            <LabelItem title="预览">
                <Button onClick={createReview}>生成数据</Button>
                <TextArea rows={10} disabled value={printList.join('\n')} />
            </LabelItem>
        </VisibleNode>
        <div className="btns">
            <LabelItem title="文件名称">
                <Input value={fileName} onChange={e=>setFileName(e.target.value)} />
            </LabelItem>
            <Button type="primary" onClick={print}>打印</Button>
            <Button type="primary" onClick={dowload}>下载</Button>
        </div>
    </Card>
}

export default RightComponent;

