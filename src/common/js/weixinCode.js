// 微信授权页面
import {
  getAllAgentInfo
} from './wx-setting'
import {
  interParams
} from '@src/service/interParams/H5/h5.js' // 引入接口
import httpServer from '@src/service/httpServer' // axios拦截器配置
import store from '@src/store'

export function weixCode(topath) {
  // 判断微信是否授权
  let CORPID = "wx5b39d0ab86f2b345";
  let appsecret = '199e51ea24dc8a205da3df227d19e579';
  let REDIRECT_URI = encodeURIComponent(location.origin);
  // 判断当前链接是否有code
  let code = GetUrlParame('code');
  console.log('code', code);
  if (!code) {
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CORPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=${topath}#wechat_redirect`
  } else {
    let state = GetUrlParame('state');
    // 含有code
    httpServer.post(interParams.userInfo, {
      "agentId": '',
      "code": code,
      "state": state
    }).then((res) => {
      if (res.code == 200) {
        let usr_id = res.data ? res.data.userId : '';
        getWeixinToken(usr_id)
        store.dispatch('saveWxUserInfo', res.data)
      } else {
        alert('没有权限')
      }
    })
  }
}
// 调用微信用户信息
export function getWeixinToken(usr_id) {

  httpServer.post(interParams.weixinToken, {
    openId: usr_id ? usr_id : '1', // 客户经理的usr_id
    usrTpCd: 'OUTER' // 用户类型 INNER-内部员工
  }).then((res) => {
    if (res.code == 200) {
      getUserInfo();
      store.dispatch('saveToken', red.data.access_token)
    }
  })
}
// 调用用户信息
export function getUserInfo() {
  httpServer.post(interParams.info, {}, (res => {
    if (res.code == 200) {
      // 用户信息调用成功
      store.dispatch('saveUserInfo', res.data)
    } else {
      console.log(res.message)
    }
  }))
}
// 截取code
export function GetUrlParame(parameName) {
  /// 获取地址栏指定参数的值
  /// <param name="parameName">参数名</param>
  // 获取url中跟在问号后面的部分
  var parames = window.location.search
  // 检测参数是否存在
  if (parames.indexOf(parameName) > -1) {
    var parameValue = ''
    parameValue = parames.substring(parames.indexOf(parameName), parames.length)
    // 检测后面是否还有参数
    if (parameValue.indexOf('&') > -1) {
      // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
      parameValue = parameValue.substring(0, parameValue.indexOf('&'))
      // 去掉参数名, 得到最终纯值字符串
      parameValue = parameValue.replace(parameName + '=', '')
      return parameValue
    }
    return ''
  }
}
