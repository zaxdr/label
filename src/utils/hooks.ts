import jsPDF from "jspdf"
import { useCallback, useEffect, useRef } from "react"
import qrcode from "qrcode"
import { useSelector } from "react-redux"
import IStore from "@/model/StoresModel"
import { createOneCode, createQrCode } from "./labelUtils"

interface QrImg {
    code: string
    src: string
}

const crateImgItem = async (value: string): Promise<string | null> => {
    return new Promise((rv, rj) => {
        qrcode.toDataURL(value, (e: Error, c: string) => {
            if (e) {
                rj(null)
                return
            }
            rv(c)
        })
    })
}

//批量创建标签
const crateImgList = async (list: string[]): Promise<QrImg[]> => {
    let tempList: QrImg[] = []
    for (let i = 0; i < list.length; i++) {
        let value = list[i];
        let st = await crateImgItem(value);
        if (st) {
            tempList.push({ code: value, src: st })
        }
    }
    return tempList
}



export const useCreatePDF = () => {
    const { codeData, paperData, isContent, contentData, qrType } = useSelector((store: IStore) => store.pageStore);
    const createImgBase64Str = useCallback(async (value) => {
        let base64Str = "";
        if (qrType === "QRCode") {
            base64Str = await createQrCode(value);
        } else {
            base64Str = await createOneCode(value, qrType);
        }
        return base64Str
    }, [qrType])

    //生成图片列表
    const creareImgList = useCallback(async (tempList: string[]) => {
        let tempData: QrImg[] = []
        for (let i = 0; i < tempList.length; i++) {
            let value = tempList[i];
            let st = await createImgBase64Str(value);
            if (st) {
                tempData.push({ code: value, src: st })
            }
        }
        return tempData
    }, [createImgBase64Str])

    const create = useCallback(async (list: string[],callback:(pdf:jsPDF)=>void) => {
        let tempList = await creareImgList(list);  
        let len: number = tempList.length;
        const pdf: jsPDF = new jsPDF("l", paperData.unit, [paperData.height, paperData.width]);
        for (let i = 0; i < len; i++) {
            let item = tempList[i];
            pdf.addImage({
                imageData: item.src,
                x: codeData.x,
                y: codeData.y,
                width: codeData.w,
                height: codeData.h
            })
            if (isContent) {
                pdf.setFontSize(contentData.fontSize);
                pdf.text(item.code, contentData.x, contentData.y)
            }
            if (i !== len - 1) {
                pdf.addPage()
            }
        }
        callback(pdf)
    }, [creareImgList, paperData, contentData])

    return {
        create
    }
}