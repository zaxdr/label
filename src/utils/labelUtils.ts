
import qrcode from "qrcode"
import jsbarcode from "jsbarcode"
import { QRType } from "@/model/options";
import { getDocument } from "pdfjs-dist";
import { message } from "antd";
import { ConfigItemType } from "@/model/StoresModel";
import { pageStoreInit } from "@/stores/pageStore";


export const pdfToimg = (url: URL, callback?: any) => {
    let loadingTask: any = getDocument(url);
    loadingTask.promise.then((pdf: any) => {
      //页数
      let numPages = pdf.numPages;
      let scale = 2;
      let Mycanvas = document.createElement("canvas");
      let imgList: any = [];
      let top = 0;
      let height = 0;
      let width = 0;
      let okRender = new Promise(async (res: any, rej) => {
        for (let i = 1; i <= numPages; i++) {
          let page = await pdf.getPage(i);
          let viewport = page.getViewport({
            scale: scale,
          });
          let canvas = document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let context = canvas.getContext("2d");
          let renderContext = {
            canvasContext: context, // 此为canvas的context
            viewport: viewport,
          };
          let success = await page.render(renderContext).promise;
          if (i === 1) {
            height = viewport.height;
            width = viewport.width;
            Mycanvas.height = viewport.height * numPages;
            Mycanvas.width = viewport.width;
          }
          let dataURL = canvas.toDataURL("image/jpeg", 1);
          imgList.push(dataURL);
          if (i === numPages) {
            res();
          }
        }
      });
      okRender.then(() => {
        let context = Mycanvas.getContext("2d");
        imgList.forEach((item: any, index: number) => {
          var image = document.createElement("img");
          image.src = item;
          image.onload = async () => {
            context.drawImage(image, 0, top, width, height);
            top += height;
            if (index === imgList.length - 1) {
              callback(Mycanvas.toDataURL("image/jpeg", 1));
            }
          };
        });
      });
    })
};


//打印PDF
let iframe: HTMLIFrameElement | null = null;
export const printPdf = function (url: URL) {
  if (!iframe) {
    iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.style.display = 'none';
  }
  iframe.onload = function () {
    setTimeout(() => {
      iframe?.focus();
      iframe?.contentWindow?.print();
    }, 500)
  };
  iframe.src = url.toString();
}


//创建一维码
export const createOneCode = (text: string, type: Omit<QRType, "QRCode">): Promise<string> => {
  return new Promise((rv, rj) => {
    let elm: HTMLCanvasElement = document.createElement("canvas");
    try {
      jsbarcode(elm, text, {
        width: 3,
        height: 80,
        format: type as string,
        displayValue: false,
      })
      let base = elm.toDataURL("image/png");
      rv(base)
    } catch (error) {
        if(type === "UPC" ){
          message.success(`${text} 不是有效的UPS码格式（示例：049000011340） `) 
        }
    }
  })
}

//创建 二维码
export const createQrCode = (text: string): Promise<string> => {
  return new Promise((rv, rj) => {
    qrcode.toDataURL(text, (e: Error, c: string) => {
      if (e) {
        rj(null)
        return
      }
      rv(c)
    })
  })
}


interface InterfaceCode {
  src: string,
  text: string

}

//创建
export const createPrint = (list: InterfaceCode[]) => {

}

//返回结束值
export const returnEndValue = (start: string, total: number) => {
  if (total <= 1) return start;
  const REG = /(\d+)$/g; //以数字结尾
  let value: null | Array<string> = REG.exec(start);
  let endValue = start
  if (value) {
    let v = value[0], len = v.length, startValue = start.substring(0, start.length - len);
    let vNumber = Number(v);
    let sum = total + vNumber;
    for (let i = vNumber; i < sum; i++) {
      endValue = startValue + i;
    }
  }
  return endValue;

}
//返回总数
export const returnTotal = (start: string, end: string) => {
  let sum: number = 0;
  const REG = /(\d+)$/g;
  const Reg2 = /(\d+)$/g;
  let v1: null | Array<string> = REG.exec(start);
  let v2: null | Array<string> = Reg2.exec(end);
  if (v1 && v2) {
    let st = Number(v1[0]), en = Number(v2[0]);
    let vv = en - st;
    return vv < 0 ? 0 : vv;
  }
  return sum;
}

//返回预览
export const returnPreView = (start: string, end: string) => {

}

//生成数据
export const createList = (start: string, end: string, num: number, total: number) => {
  let list: string[] = [];
  if (start === end) {
    //不用递增 
    new Array(total).fill(0).map(it => {
      list.push(... new Array(num).fill(start))
    })
  } else {
    const REG = /(\d+)$/g;
    const Reg2 = /(\d+)$/g;
    let v1: null | Array<string> = REG.exec(start);
    let v2: null | Array<string> = Reg2.exec(end);
    if (v1 && v2) {
      let v = v1[0], len = v.length, startValue = start.substring(0, start.length - len);
      let e = v2[0], len2 = v.length, endValue = end.substring(0, end.length - len2);
      if (startValue !== endValue) {
        message.error("开始值与结束值前缀不一致");
        return [];
      };
      let sv = Number(v), sum = sv + total;
      for (let i = sv; i < sum; i++) {
        list.push(...new Array(num).fill(startValue + i))
      }
    }
  }
  return list;
}

/**
 * 
 * @param start 开始值
 * @param num 倍数
 * @param total 生成的总数
 * @param isStep 是否递增
 */
export const createListV2 = (start:string,num:number,total:number,isStep:boolean = false)=>{

  let list: string[] = [];
  if(!isStep){ // 不用递增
    new Array(total).fill(0).map(it => {
      list.push(... new Array(num).fill(start))
    })
  }else{
    //需要递增
    const REG = /(\d+)$/g; //获取字符串的数字部分
    let v1: null | Array<string> = REG.exec(start);
    if(v1){
      let v = v1[0], len = v.length;
      let  startValue = start.substring(0, start.length - len);
      let sv = Number(v), sum = sv + total;
      for (let i = sv; i < sum; i++) {
        list.push(...new Array(num).fill(startValue + i))
      }
    }else{
      message.error("开始值不是以数值结尾");
      return [];
    }
  }
  return list;
}



//通过FileReader转化为base64字符串下载
function downloadByBlob(fileName: string, data: string) {
  let blob = new Blob([data], {
    type: "json/plain;base64"
  });
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (e) {
    let a = document.createElement('a');
    a.download = fileName + '.json';
    a.href = e.target.result as string;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}


export const defaultConfig = { name: "默认", config: pageStoreInit };

//保存本地配置
export const configOption = () => {
  const key = "label_config";
  const local = window.localStorage;
  return {
    //初始化信息
    init() {
      let str = local.getItem(key);
      try {
        return JSON.parse(str) || [ defaultConfig ]
      } catch (error) {
        return [defaultConfig ]
      }
    },
    async load(file?: File): Promise<ConfigItemType> {
      return new Promise((re, rj) => {
        var reader = new FileReader();
        reader.onload = function () {
          try {
            let list: ConfigItemType = JSON.parse(this.result as string)
            re(list);
          } catch (error) {
            re(null)
          }
        }
        reader.onerror = function (error) {
          rj(error)
        }
        reader.readAsText(file);
      })

    },
    save(obj: ConfigItemType[]) {
      try {
        let str = JSON.stringify(obj);
        local.setItem(key, str);
        //保存JSON文件
      } catch (error) {
      }
    },
    clear(){
      local.removeItem(key);
    },
    download(obj: ConfigItemType) {
      try {
        let str = JSON.stringify(obj);
        downloadByBlob(obj.name, str);//保存在本地
      } catch (error) {
      }

    }
  }
}



