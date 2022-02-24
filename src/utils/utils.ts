
// @ts-ignore
import CryptoJS from 'crypto-js'


import Cookies from 'js-cookie';


//加密key
const AES_KEY: string = "9kF95zawVgBf7i9VRSZj1dx3DN3fYxSI";

class Utils {
  loadScript(url: string) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
  }

  extend(...args: any[]) {
    let options,
      name,
      src,
      srcType,
      copy,
      copyIsArray,
      clone,
      target = args[0] || {},
      i = 1,
      length = args.length,
      deep = false;
    if (typeof target === 'boolean') {
      deep = target;
      target = args[i] || {};
      i++;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = args[i]) !== null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          srcType = Array.isArray(src) ? 'array' : typeof src;
          if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && srcType === 'array' ? src : [];
            } else {
              clone = src && srcType === 'object' ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  }


  // 保存Cookie
  saveCookie(key: string, value: string, expires?: number | Date) {
    Cookies.set(key, value, {
      expires
    });
  }

  // 读取保存的Cookie
  loadCookie(key: string) {
    let val = Cookies.get(key);
    return val;
  }

  // 删除Cookies
  removeCookie(key: string) {
    Cookies.remove(key);
  }

  // 加密保存Cookie
  securitySaveCookie(key: string, value: string, expires?: number | Date) {
    let enc = this.encrypt(value);
    Cookies.set(key, enc, {
      expires
    });
  }

  // 读取加密保存的Cookie
  securityLoadCookie(key: string) {
    let val = Cookies.get(key);
    if (!val) return '';
    let dec = this.decrypt(val);
    return dec;
  }

  decode(s: string) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }

  //加密
  encrypt(str: string): string {
    return CryptoJS.AES.encrypt(str, AES_KEY).toString();
  }

  //解密
  decrypt(str: string): string {
    const bytes = CryptoJS.AES.decrypt(str, AES_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // 生成guid
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // eslint-disable-next-line no-mixed-operators
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 格式化数字
  formatNumber(num: number) {
    if (num === 0) return '0';
    if (!num) return '';
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1, ");
  }

  //颜色 减轻
  lighten(color:string, lighten:number){
    const c = color.replace("#", "");
    let rgb = [
      parseInt(c.substr(0, 2), 16),
      parseInt(c.substr(2, 2), 16),
      parseInt(c.substr(4, 2), 16)
    ];
    let reinstatement = "#";
    rgb.forEach((color)=>{reinstatement+=Math.round(((255-color)*(1-Math.pow(Math.E, -lighten))+color)).toString(16)});
    return reinstatement;
  }
  //base64转文件
  base64ToFile(base64Data: string, fileName: string): File | null {
    let [typeString = "", contentString = ""] = base64Data.split(',');
    let temp = typeString.match(/:(.*?);/);
    if (!temp || temp.length <= 1) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [_, suffix] = temp[1].split("/");//获取后缀名称
    let bstr = atob(contentString);
    let n = bstr.length
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName + "." + suffix, { type: temp[1] });
  }
}

export default new Utils();
