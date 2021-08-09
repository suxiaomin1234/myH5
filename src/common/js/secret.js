const CryptoJS = require('crypto-js');  //引用AES源码js

const keyStr = "icklsdufidsakdfa";  //十六位十六进制数作为密钥
const ivStr = ''; // 偏移量

function Encrypt(data) {
	var key = CryptoJS.enc.Utf8.parse(keyStr);
	var iv = CryptoJS.enc.Utf8.parse(ivStr);
	var encrypted = CryptoJS.AES.encrypt(data, key, {
		iv: iv,
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	//返回的是base64格式的密文
	return encrypted.toString();
}

// encrypted 为是base64格式的密文
function Decrypt(encrypted) {
	// 拿到字符串类型的密文需要先将其用Hex方法parse一下
	// var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
	// 将密文转为Base64的字符串
	// 只有Base64类型的字符串密文才能对其进行解密
	// var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
	var key = CryptoJS.enc.Utf8.parse(keyStr);
	var iv = CryptoJS.enc.Utf8.parse(ivStr);
	var decrypt = CryptoJS.AES.decrypt(encrypted, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
	return CryptoJS.enc.Utf8.stringify(decrypt)

}

// 测试加、解密
function testAES() {
	var data = { name:"1234567890123456",nn:[1,2,3]}; // 明文
    let op = JSON.stringify(data);
	// 测试加密
	var encrypted = Encrypt(op); // 密文
	console.log("加密后: ", encrypted);

	var decryptedStr = Decrypt(encrypted);
	console.log("解密后: ",JSON.parse(decryptedStr));
}
// testAES()
export default {
	Decrypt,
	Encrypt
}
