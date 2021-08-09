// var wx = require('./weixin-js-sdk@1.6.0.js');
import {
	interParams
} from '@/service/interParams'
/**
 * 微信授权配置
 * @param {Object} weixData 微信配置信息
 */
const wx = jWeixin
function wxSetting(weixData) {
	// alert(JSON.stringify(weixData))
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: weixData.appId, // 必填，公众号的唯一标识
		timestamp: weixData.timestamp, // 必填，生成签名的时间戳
		nonceStr: weixData.nonceStr, // 必填，生成签名的随机串
		signature: weixData.signature, // 必填，签名，见附录1
		jsApiList: [
			'scanQRCode',
			'updateAppMessageShareData',
			'updateTimelineShareData',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareQZone',
			'onMenuShareWeibo'
		] // 必填，需要使用的JS接口列表，这里只说扫描，例如分享等都可以，只要写在数组里面就可以调用
	})

	// 权限验证出错
	wx.error((res) => {
		alert('出错了：' + JSON.stringify(res.errMsg))
		sessionStorage.removeItem('wxData')
	})
}
// 获取微信配置信息
export function getWeixData() {
	
	initJssdkShare();
	//初始化sdk配置  
	function initJssdkShare(callback, url) {
		const DATA = JSON.parse(sessionStorage.getItem('wxData'))
		if (DATA) {
			wxSetting(DATA)
		} else {
			const url = encodeURIComponent(window.location.href.split('#')[0]);
			// const url = window.location.origin;
			post(apiUrl.login.createJsapiSignature + '?url=' + url, {}, (res) => {
				if (res.code == 200) {
					sessionStorage.setItem('wxData', JSON.stringify(res.data))
					wxSetting(res.data)
					// console.log('微信设置获取成功')
				} else {
					alert('没有权限')
				}
			})

		}
	}
}
/**
 * 扫一扫
 * @param {Function} callback 回调函数
 * @param {Function} needResult 扫描结果处理方式
 */
export function wxScan(callback, needResult) {
	// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后
	wx.ready(() => {
		// 判断当前客户端版本是否支持指定JS接口
		wx.checkJsApi({
			jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			success(res) {
				// 以键值对的形式返回，可用的api值true，不可用为false
				wx.scanQRCode({
					needResult: needResult === 0 ? needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
					success(res) {
						const RESULT = res.resultStr
						callback(RESULT)
					}
				})
			}
		})
	})
}
// 自定义分享内容
function wxNewShareData({
	title = '',
	desc = '',
	link = '',
	imgUrl = '',
	success
}) {
	// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
	wx.updateAppMessageShareData({
		title, // 分享标题
		desc, // 分享描述
		link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl, // 分享图标
		success: function () {
			// 设置成功
			// 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
			wx.updateTimelineShareData({
				title, // 分享标题
				link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl, // 分享图标
				success: function () {
					// 设置成功
					if (success) {
						success()
					}
				}
			})
		},
		fail: function (err) {
			// alert('分享失败')
		}
	})
}
// 自定义分享内容（即将废弃）
function wxShareData({
	title = '',
	desc = '',
	link = '',
	imgUrl = '',
	success
}) {
	// 分享到朋友
	wx.onMenuShareAppMessage({
		title, // 分享标题
		desc, // 分享描述
		link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl, // 分享图标
		type: '', // 分享类型,music、video或link，不填默认为link
		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		success: function () {
			// 用户点击了分享后执行的回调函数
			setTimeout(function () {
				if (success) {
					success()
				} else {
					// alert('分享成功')
				}
			}, 500)
		}
	})
	// 分享到朋友圈
	wx.onMenuShareTimeline({
		title, // 分享标题
		desc, // 分享描述
		link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl, // 分享图标
		success: function () {
			// 用户点击了分享后执行的回调函数
			setTimeout(function () {
				if (success) {
					success()
				} else {
					// alert('分享成功')
				}
			}, 500)
		}
	})
	// 分享到qq
	wx.onMenuShareQQ({
		title, // 分享标题
		desc, // 分享描述
		link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl, // 分享图标
		success: function () {
			// 用户点击了分享后执行的回调函数
			setTimeout(function () {
				if (success) {
					success()
				} else {
					// alert('分享成功')
				}
			}, 500)
		}
	})
	// 分享到QQ空间
	wx.onMenuShareQZone({
		title, // 分享标题
		desc, // 分享描述
		link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl, // 分享图标
		success: function () {
			// 用户点击了分享后执行的回调函数
			setTimeout(function () {
				if (success) {
					success()
				} else {
					// alert('分享成功')
				}
			}, 500)
		}
	})
}
// 自定义分享
export function wxShare(data) {
	// console.log(data)
	wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
		wx.checkJsApi({
			jsApiList: [
			'onMenuShareAppMessage', 
			'onMenuShareTimeline', 
			'onMenuShareQQ', 
			'onMenuShareQZone'
		    ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			success: function (res) {
				// 以键值对的形式返回，可用的api值true，不可用为false
				// 如：{"checkResult":{"onMenuShareAppMessage":true},"errMsg":"checkJsApi:ok"}
				console.log(res, 'changg')
				if (res.checkResult.onMenuShareAppMessage) {
					wxShareData(data)
				} else {
					// alert('新版分享，不支持分享后的分享量统计')
					wxNewShareData(data)
				}
			}
		})
	})
}
// 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
export function wxMenuShareWeibo({
	title = '',
	link = '',
	desc = '',
	imgUrl = '',
	success
}) {
	wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
		wx.onMenuShareWeibo({
			title, // 分享标题
			desc, // 分享描述
			link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl, // 分享图标
			success: function () {
				// 用户确认分享后执行的回调函数
				if (success) {
					success()
				}
			},
			fail: function (err) {
				// alert('分享失败')
			}
		})
	})
}
