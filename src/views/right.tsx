import LabelItem from "@/components/comm/LabelItem";
import VisibleNode from "@/components/comm/VisibleNode";
import { DataType, DataTypeList } from "@/model/options";
import IStore from "@/model/StoresModel";
import { setDataType } from "@/stores/pageStore";
import { useCreatePDF } from "@/utils/hooks";
import { createList, printPdf, returnEndValue, returnTotal } from "@/utils/labelUtils";
import { Button, Card, Input, InputNumber, message, Select, Switch, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"

const TextArea = Input.TextArea;


const RightComponent = () => {
    const { dataType, } = useSelector((store: IStore) => store.pageStore);
    const { create } = useCreatePDF()

    const [start, setStart] = useState<string>("A100000001");
    const [end, setEnd] = useState<string>("A100000001");
    const [total, setTotal] = useState<number>(1);
    const [isStep, setIsStep] = useState<boolean>(false);
    const [fixedValue, setFixedValue] = useState<string>("A100000001\nA100000002");
    const [num, setNum] = useState<number>(1);

    const dispatch = useDispatch();
    const [printList, setPrintList] = useState<string[]>([]);
    //修改类型
    const changeDataType = useCallback((value: DataType) => {
        dispatch(setDataType(value))
    }, [dispatch])

    //输入是否递增
    const inputStep = useCallback((bool: boolean) => {
        setIsStep(bool);

    }, [])


    //输入开始值(输入完开始值 根据总数 重置结束值)
    const inputStart = useCallback((e: string) => {
        setStart(e);
        setEnd(returnEndValue(e, total));
    }, [total])

    //输入结束值
    const inputEnd = useCallback((v: string) => {
        if (!start) {
            message.error("请输入开始值");
            return;
        }
        setEnd(v);
        setTotal(returnTotal(start, v))
    }, [start])

    //输入总数
    const inputTotal = useCallback((e: number) => {
        setTotal(e);
        if (!start) {
            message.error("请输入开始值");
            return;
        }

        let endValue = returnEndValue(start, e)
        setEnd(endValue);
    }, [start])

    //输入个数
    const inputNum = useCallback((e: number) => {
        if (!start) {
            message.error("请输入开始值");
            return;
        }
        setNum(e)
    }, [start, total])


    useEffect(() => {
        let list: string[] = [];
        if (dataType === "Auto") {
            if (isStep) {
                //递增
                list = createList(start, end, num, total);
            } else {
                //默认
                list = createList(start, start, num, total);
            }
        } else {
            list = fixedValue.trim().split("\n");//去除前后空格 然后按换行分割
        }
        setPrintList(list);

    }, [start, end, num, isStep, total, dataType, fixedValue])


    //打印
    const print = useCallback(() => {
        if (printList.length === 0) {
            message.error("请输入需要生成的数据")
            return;
        }
        create(printList, (pdf) => {
            let st: any = pdf.output("bloburl")
            printPdf(st)
        })
    }, [printList])

    //下载
    const dowload = useCallback(() => {
        if (printList.length === 0) {
            message.error("请输入需要生成的数据")
            return;
        }
        create(printList, (pdf) => {
            pdf.save("label.pdf")
        })
    }, [printList])


    return <Card title="批量生成" size="small">
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
                <Switch checked={isStep} checkedChildren="是" unCheckedChildren="否" onChange={inputStep} />
            </LabelItem>
            <LabelItem title="开始值">
                <Input value={start} onChange={e => inputStart(e.target.value)} />
            </LabelItem>
            <VisibleNode visible={isStep}>
                <LabelItem title="结束值">
                    <Input value={end} onChange={e => inputEnd(e.target.value)} />
                </LabelItem>
            </VisibleNode>
            <LabelItem title="总数">
                <InputNumber value={total} min={0} onChange={inputTotal} />
            </LabelItem>
            <LabelItem title="单个倍数">
                <InputNumber value={num} min={1} onChange={inputNum} />
                <Tag color="lime">{total * num}</Tag>
            </LabelItem>
            <LabelItem title="预览">
                <TextArea rows={10} disabled value={printList.join('\n')} />
            </LabelItem>
        </VisibleNode>
        <div className="btns">
            <Button type="primary" onClick={print}>打印</Button>
            <Button type="primary" onClick={dowload}>下载</Button>
        </div>
    </Card>
}

export default RightComponent;

