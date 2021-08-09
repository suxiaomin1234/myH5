/**
 * 公共方法
 * */

/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
	if (!name) return;
	let data = window.localStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}


export const Cookie = {
	/**
	 * getCookie
	 * @param name
	 * @returns {*}
	 */
	get(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name) return arr[1];
		}
		return "";
	},

	/**
	 * 添加cookie
	 * @param name
	 * @param value
	 * @param expiresHours
	 * @param domain
	 */
	set(name, value, expiresDays, domain, path) {
		var cookieString = name + "=" + (value ? value : '');
		var date = new Date();

		if (domain != undefined)
			domain = ";domain=" + domain;
		else
			domain = '';

		date.setTime(date.getTime() + (expiresDays || 1) * 24 * 3600 * 1000);
		cookieString = cookieString + domain + "; path=" + (path || "/") + "; expires=" + date.toGMTString();

		document.cookie = cookieString;
	},

	/**
	 * 删除cookie
	 * @param name
	 */
	remove(name) {
		this.set(name, '', -1);
	}
};


export function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1])

	// separate out the mime components
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length)

	// create a view into the buffer
	var ia = new Uint8Array(ab)

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], {
		type: mimeString
	})
	return blob
}
/**
 * 全局替换绝对路径脚本 -- （系统）
 */
export const replaceIP = function (str) {
	console.log('链接',str)
	if (str) {
		if (typeof (str) == 'string') {
			str = str.replaceAll('http://172.19.80.80:8932', '')
		} else {
			str = JSON.stringify(str).replaceAll('http://172.19.80.80:8932', '')
		}
		console.log('链接2',str)
		return str
	}
	return ''
}

/**
 * 全局替换绝对路径 -- 展示页面 （客户）
 */
export const replaceExiIP = function (str = '') {
	if (str) {
		if (typeof (str) == 'string') {
			str = str.replaceAll('http://172.19.80.80:8932', '')
		} else {
			str = JSON.stringify(str).replaceAll('http://172.19.80.80:8932', '')
		}
		return str
	}
	return ''
}

// 判断是不是微信浏览器
export function isWxBrowser() {
	var ua = navigator.userAgent.toLowerCase();
	let isWx = ua.match(/MicroMessenger/i) == "micromessenger";
	if (!isWx) {
		return false;
	} else {
		let isWxWork = ua.match(/WxWork/i) == "wxwork";
		if (isWxWork) {
			return false;
		} else {
			return true;
		}
	}
}


const appId = 'appId' // appId
const openId = 'openId' // openId
const token = 'token' // 登录token
// const refreshToken = 'refreshToken' // 刷新token
const isRegister = 'isRegister' // 用户注册标识
const wxUserInfo = 'wxUserInfo' // 微信账号信息
const userInfo = 'userInfo' // 用户账号信息
// const userInfoAdmin = 'userInfoAdmin' // 用户账号信息(对应后台)
const backUrl = 'backUrl' // 返回地址
// 设置保存appId
export function setAppId(data) {
	return localStorage.setItem(appId, data)
}
// 获取appId
export function getAppId() {
	return localStorage.getItem(appId) || ''
}
// 设置保存openId
export function setOpenId(data) {
	return localStorage.setItem(openId, data)
}
// 获取openId
export function getOpenId() {
	return localStorage.getItem(openId) || ''
}
// 设置token
export function setToken(data) {
	return localStorage.setItem(token, data)
}
// 获取token
export function getToken() {
	return localStorage.getItem(token)
}
// 设置保存微信账号信息
export function setWxUserInfo(data) {
	return sessionStorage.setItem(wxUserInfo, JSON.stringify(data))
}
// 获取微信账号信息
export function getWxUserInfo() {
	return JSON.parse(sessionStorage.getItem(wxUserInfo)) || {}
}

// 设置保存用户注册标识
export function setIsRegister(data) {
	return sessionStorage.setItem(isRegister, data)
}
// 获取保存用户注册标识
export function getIsRegister() {
	return sessionStorage.getItem(isRegister)
}
// 设置保存用户账号信息
export function setUserInfo(data) {
	return sessionStorage.setItem(userInfo, JSON.stringify(data))
}
// 获取用户账号信息
export function getUserInfo() {
	return JSON.parse(sessionStorage.getItem(userInfo)) || {}
}