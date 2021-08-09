/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'




const KEY_FOR_CBC = CryptoJS.enc.Utf8.parse("tansun_v1_by_xyc"); // 密钥 长度必须为16位
const IV_FOR_CBC = CryptoJS.enc.Utf8.parse("aHbYG0bFedDSxas3"); //  初始向量 长度随意

export default { //加密
    encrypt(word, keyStr) {
        keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
        var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    //解密
    decrypt(word, keyStr) {
        keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
        var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
        var decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
    Event,
    fnMoneyToThousands(number) {
        number = number + ''
        number = number.replace(/\,/g, '')
        if (isNaN(number) || number == '') return ''
        number = Math.round(number * 100) / 100
        if (number < 0) {
            return (
                '-' +
                this.outputdollars(Math.floor(Math.abs(number) - 0) + '') +
                this.outputcents(Math.abs(number) - 0)
            )
        } else {
            return (
                this.outputdollars(Math.floor(number - 0) + '') +
                this.outputcents(number - 0)
            )
        }
    },
    outputdollars(number) {
        if (number.length <= 3) {
            return number == '' ? '0' : number
        } else {
            const mod = number.length % 3
            let output = mod == 0 ? '' : number.substring(0, mod)
            for (let i = 0; i < Math.floor(number.length / 3); i++) {
                if (mod == 0 && i == 0) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3)
                } else {
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3)
                }
            }
            return output
        }
    },
    outputcents(amount) {
        amount = Math.round((amount - Math.floor(amount)) * 100)
        return amount < 10 ? '.0' + amount : '.' + amount
    },
    // 数据为null是转化为空
    fnNullTransfer(data) {
        let constReturn = null
        if (data == '') {
            constReturn = ''
        } else if (data == null) {
            data = ''
            constReturn = data
        } else {
            const ty = typeof data
            let tpKind
            if (ty == 'object') {
                if (typeof data.length == 'number') {
                    tpKind = 'Array'
                } else {
                    tpKind = 'Object'
                }
            } else {
                tpKind = 'other'
            }
            if (tpKind == 'Array') {
                data.forEach(item => {
                    for (const k in item) {
                        if (item[k] == null) {
                            item[k] = ''
                        } else {
                            item[k] = this.fnNullTransfer(item[k])
                        }
                    }
                })
            } else if (tpKind == 'Object') {
                for (const k in data) {
                    if (data[k] == null) {
                        data[k] = ''
                    } else {
                        data[k] = this.fnNullTransfer(data[k])
                    }
                }
            } else {
                constReturn = data
            }
            constReturn = data
        }
        return constReturn
    },

    /*
     * AES加密 ：字符串 key iv  返回Base64
     */
    encryptCBC(str, keyStr, ivStr) {
        if (str) {

            let key = KEY_FOR_CBC
            let iv = IV_FOR_CBC

            if (keyStr && ivStr) {
                key = CryptoJS.enc.Utf8.parse(keyStr);
                iv = CryptoJS.enc.Utf8.parse(ivStr);
            }

            let srcs = CryptoJS.enc.Utf8.parse(str);
            var encrypt = CryptoJS.AES.encrypt(srcs, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, //这里可以选择AES加密的模式
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypt.ciphertext.toString(CryptoJS.enc.Base64)
        } else {
            return str
        }
    },
    /*
     * AES 解密 ：字符串 key iv  返回Base64
     */
    decryptCBC(str, keyStr, ivStr) {
        if (str) {
            let key = KEY_FOR_CBC
            let iv = IV_FOR_CBC

            if (keyStr && ivStr) {
                key = CryptoJS.enc.Utf8.parse(keyStr);
                iv = CryptoJS.enc.Utf8.parse(ivStr);
            }
            let Base64 = CryptoJS.enc.Base64.parse(str);
            let src = CryptoJS.lib.CipherParams.create({
                ciphertext: Base64,
            })
            console.log(src)
            const decrypt = CryptoJS.AES.decrypt(src, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, //这里可以选择AES解密的模式
                padding: CryptoJS.pad.Pkcs7
            });

            var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString();
        } else {
            return str
        }
    }
}




//
// /*
//  * 默认的 KEY_FOR_CBC IV_FOR_CBC     如果在加密解密的时候没有传入KEY_FOR_CBC和IV_FOR_CBC,就会使用这里定义的
//  *
//  * 前后端交互时需要前后端密钥和初始向量保持一致
//  *
//  *
//  */
//
// const IV_FOR_CBC = CryptoJS.enc.Utf8.parse("aHbYG0bFedDSxas3");  //  初始向量    长度随意
// const KEY_FOR_CBC = CryptoJS.enc.Utf8.parse("tansun_v1_by_xyc");  //  密钥        长度必须为16位
// /*
//  * AES加密 ：字符串 key iv  返回base64
//  */
// export function encrypt(str, keyStr, ivStr) {
//   let key = KEY_FOR_CBC
//   let iv = IV_FOR_CBC
//
//   if (keyStr && ivStr) {
//     key = CryptoJS.enc.Utf8.parse(keyStr);
//     iv = CryptoJS.enc.Utf8.parse(ivStr);
//   }
//
//   let srcs = CryptoJS.enc.Utf8.parse(str);
//   var encrypt = CryptoJS.AES.encrypt(srcs, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,            //这里可以选择AES加密的模式
//     padding: CryptoJS.pad.Pkcs7
//   });
//   return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
// }
//
// /*
//  * AES 解密 ：字符串 key iv  返回base64
//  */
// export function decryptCBC(str, keyStr, ivStr) {
//   let key = KEY_FOR_CBC
//   let iv = IV_FOR_CBC
//
//   if (keyStr && ivStr) {
//     key = CryptoJS.enc.Utf8.parse(keyStr);
//     iv = CryptoJS.enc.Utf8.parse(ivStr);
//   }
//
//   let base64 = CryptoJS.enc.Base64.parse(str);
//   let src = CryptoJS.enc.Base64.stringify(base64);
//
//   const decrypt = CryptoJS.AES.decrypt(src, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,            //这里可以选择AES解密的模式
//     padding: CryptoJS.pad.Pkcs7
//   });
//
//   var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
//   return decryptedStr.toString();
// }