import { Button, Card, Image } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";
import IStore from "@/model/StoresModel";
import { createOneCode, createQrCode, pdfToimg, printPdf } from "@/utils/labelUtils"

let time: NodeJS.Timeout;



const ContentComponent = () => {
    const [url, setUrl] = useState<string>();
    const { codeData, paperData, isContent, contentData, qrType } = useSelector((store: IStore) => store.pageStore);
    const pdfRef = useRef<URL>();
    useEffect(() => {
        clearTimeout(time);
        if(contentData.text && contentData.text.length>0){
            pdfRef.current = null;
            time = setTimeout(async () => {
                let base64Str = "";
                if (qrType === "QRCode") {
                    base64Str = await createQrCode(contentData.text);
                } else {
                    base64Str = await createOneCode(contentData.text, qrType);
                }
                //创建一个 7cm宽 5cm高 每页的PDF
                const pdf: jsPDF = new jsPDF("l", paperData.unit, [paperData.height, paperData.width]);
                pdf.addImage({
                    imageData: base64Str,
                    x: codeData.x || 0,
                    y: codeData.y || 0,
                    width: codeData.w || 0,
                    height: codeData.h || 0
                })
                if (isContent) {
                    pdf.setFontSize(contentData.fontSize);
                    pdf.text(contentData.text, contentData.x, contentData.y)
                }
                let urlObject = pdf.output("bloburi")
                pdfRef.current = urlObject;
                pdfToimg(urlObject, (v: string) => {
                    setUrl(v);
                })
            }, 300)
        }
        return () => {
            clearTimeout(time);
        }
    }, [codeData, paperData, isContent, contentData, qrType])


    //打印预览
    const printReview = useCallback(() => {
        printPdf(pdfRef.current)
    }, [pdfRef])


    return <Card title="预览" size="small" className="dora-card">
        <div className="pdf-review">
            <Image src={url} className="iframe" preview={false} />
        </div>
        <div className="btns">
            <Button type="primary" onClick={printReview}>打印预览</Button>

        </div>
    </Card>
}

export default ContentComponent;
