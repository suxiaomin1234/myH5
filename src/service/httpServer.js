import axios from "axios";
import store from "@/store/index";
import $config from "@/config/index";
import QS from "qs";
import encry from "./encry";


// 线上环境配置nginx代理，开发环境则用proxy代理
// if (process.env.VUE_APP_ENV_NAME !== 'development') {
  // console.log('请求地址',API_CONFIG.dev.proxyTable['/api'].target)
// axios.defaults.baseURL = '/H5QuickBuild'+$config.baseURL;
axios.defaults.baseURL = 'http://172.19.80.233:7024/'+$config.baseURL;
// }
axios.defaults.headers["Content-Type"] = "application/json;charse=UTF-8";
// axios.defaults.headers['Authorization'] = 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0TFYiOiIwIiwidGpJbnN0SWQiOiIwMDAwMDEiLCJ1c2VyX25hbWUiOiIyMDIwMDgyMTA5NDAwNDcwMyIsInJvbGVJZCI6InhtY2VzaGkiLCJzY29wZSI6WyJhbGwiXSwianVyaXNJbnN0SWQiOiIwMDAwMDEiLCJpZCI6IjIwMjAwODIxMDk0MDA0NzAzIiwiZXhwIjoxNjAzMzI5OTEwLCJyb2xlVHlwZSI6IjAzIiwiYXV0aG9yaXRpZXMiOlsiUl9OZXRNa3RBZG1pbiIsIjAwMiIsInhtY2VzaGkiLCJSX2hlYWRCYW5rTWt0QWRtaW4iLCJSX2JyYW5jaEJhbmtNa3RNYW5hZ2VyIiwiUl9icmFuY2hCYW5rTWt0QWRtaW4iLCJSX2R1dHlNYW5hZ2VyIiwiUl9zeXNBZG1pbiIsIlJfRmluYW5jaW5nIiwiUl9oZWFkQmFua01rdE1hbmFnZXIiXSwianRpIjoiZDc1ZTk2YWUtNzc5Yi00OWJhLThlMmUtMWU5YjA0NWU3YTE2IiwiY2xpZW50X2lkIjoibXRiaW0ifQ.M0Vm6iw4t7fhQOd2EEre1YHClJiSYBexpuGRZgssMRE4KgJ00S-_NKkCmBynPJW7ttaiP6TrD8EN8yzOLOX194GVnbmy3cVp4_SFnR6lSfljA9HaKyfv2jbaP8vF_JpQ35rtvTtUrKHa_yOZr-v0yif12toxA6iwkS_uejn9ZHehu6nzIltGbZO4x0x2LlzrDMDnXvPa-S8EQiiFnR1RdmBmm5WlTOW-TtFqwbuSTQRKq4SjUgVo7GhqnIAmN11wqI-Xruvmm5CRr9vXZYDYHLJ8v_Ap5Ppw7187CTXnMFMOAeYik57Tbjez3o-tUp-7Fu7ytP2JcZcNgU-wfZsRtQ'

//请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      config.headers.Authorization =
        "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmluY2lwYWwiOnsidXNlcklkIjoiMTQxMjgiLCJ3eFVzcklkIjpudWxsLCJwYXNzd29yZCI6bnVsbCwidHJ1ZU5tIjoi6ZmI5L-K5b2sIiwidXNyU3RjZCI6IjEiLCJkZWxJbmQiOiIwIiwicHN3ZEVyckNudCI6MCwibWF4UGFzc3dvcmRFcnJvckNvdW50Ijo1LCJsb2NrVG0iOiIxOTcwLTAxLTAxIDAwOjAwOjAwIiwic3VwckVtcElkIjoiYWRtaW4iLCJzdXByVHJ1ZU5tIjoi6LaF57qn566h55CG5ZGYIiwibWF4TG9ja1RpbWVNcyI6MzAwMDAwLCJvbmxpbmVTdGF0dXMiOm51bGwsInZjIjpudWxsLCJ1c2VyUm9sZUluZlZPUyI6W3sidXJJZCI6IjM4ZDdmMDcwMTk0NjQ2ZWFhNmMxNjA3YjZhYzllOWI5Iiwicm9sZUlkIjoiMjAyMDA5MTgiLCJyb2xlTmFtZSI6IuWFqOWKn-iDveinkuiJsiIsInJvbGVUeXBlIjoiMDMiLCJidXNlTG4iOiIwMiIsImp1cmlzSW5zdElkIjoiMDAwMDAxIiwianVyaXNJbnN0Tm0iOiLlpKnpmLPnp5HmioAiLCJhdXRob3JpdHkiOiIyMDIwMDkxOCJ9LHsidXJJZCI6IjYzMTY4NDM5NzczOTRhZjc4NWVjOWQyMjYzMzQ5YWUyIiwicm9sZUlkIjoiUl9zdXBlckFkbWluIiwicm9sZU5hbWUiOiLotoXnuqfnrqHnkIblkZgiLCJyb2xlVHlwZSI6IjAzIiwiYnVzZUxuIjoiMDIiLCJqdXJpc0luc3RJZCI6IjAwMDAwMSIsImp1cmlzSW5zdE5tIjoi5aSp6Ziz56eR5oqAIiwiYXV0aG9yaXR5IjoiUl9zdXBlckFkbWluIn1dLCJibG5nSW5zdElkIjoiMDAwMDAxIiwiYmxuZ0luc3RObSI6IuWkqemYs-enkeaKgCIsImN1cnJlbnRVcklkIjoiNjMxNjg0Mzk3NzM5NGFmNzg1ZWM5ZDIyNjMzNDlhZTIiLCJjdXJyZW50Um9sZUlkIjoiUl9zdXBlckFkbWluIiwiY3VycmVudFJvbGVUeXBlIjoiMDMiLCJjdXJyZW50QnVzZUxuIjoiMDIiLCJjdXJyZW50SnVyaXNJbnN0SWQiOiIwMDAwMDEiLCJjdXJyZW50SnVyaXNJbnN0Tm0iOiLlpKnpmLPnp5HmioAiLCJlbmFibGVkIjp0cnVlLCJ1c2VybmFtZSI6IjE0MTI4IiwiY3JlZGVudGlhbHNOb25FeHBpcmVkIjp0cnVlLCJhdXRob3JpemF0aW9uVmFsaWQiOnRydWUsImFjY291bnROb25Mb2NrZWQiOnRydWUsImFjY291bnROb25FeHBpcmVkIjp0cnVlfSwidXNlcl9uYW1lIjoiMTQxMjgiLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjIzODA5MzI0LCJhdXRob3JpdGllcyI6WyIyMDIwMDkxOCIsIlJfc3VwZXJBZG1pbiJdLCJqdGkiOiJkMGFjMmQ0Yi0zYjg3LTQ0N2QtYWY5MS1kY2IyZGRlNzg4OGIiLCJjbGllbnRfaWQiOiJtdGJpbSJ9.N570hI6HZEwbF9D59-IHBx8Ecgc_gO0UzyDuKncryRYtuehPvmIyeCuEmQUPg72FhuXN5UmBzl8ReCJUz9URy2kLevjVp6_BZSMuNAuSyLgP1PjJdloiIELzfXJ267QKksFSWr1B8FZusRpUX9IM62DZC1lRTIqS2lj8vu72bLMoH15CpyN3HcY0SeuSi26psZYZycLCRIIjBYvyIDdh8P48wZWQsFbb8DGQKecvtWuTIypO6Jm-DscWR6v-e9PZ9kMxRfNfX2gfU2mW6Crj_BN2bb-FGAllpBeMWeuYDH3tyIdufZBIsdNpsR-6QJLVGTwgde8HE4UVfyIxUwIJdg";
    } else {
      config.headers.Authorization = store.getters.authorization;
    }

    // ----------------签名加密 start-----------------------
    const URL = config.url;
    const URLIndex = URL.indexOf("?");
    let sign = {
        // 签名
        url: URLIndex != -1 ? URL.substring(0, URLIndex) : URL, // 请求地址
        timestamp: String(
          new Date().getTime() + Number(sessionStorage.getItem("timeDis")) || 0
        ), // 随机字符串
        random: String(parseInt(Math.random() * 1000000)),
      },
      // signEn = encodeURIComponent(encodeURIComponent(encry.encryptCBC(JSON.stringify(sign)))) // 签名加密 + encodeURIComponent
      signEn = encry.encryptCBC(JSON.stringify(sign)); // 签名加密
    // console.log(sign,signEn)
    config.headers["SIGN"] = signEn;
    // ----------------签名加密 end------------------------
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//响应拦截器即异常处理
axios.interceptors.response.use(
  (response) => {
    if (response.data.code) {
      return Promise.resolve(response.data);
    } else {
      store.dispatch("showMassage", {
        type: "error",
        message:
          response.data.message || response.data.msg || response.data.errMsg,
      });
      return Promise.reject(response);
    }
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "错误请求";
          break;
        case 401:
          err.message = "未授权，请重新登录";
          store.dispatch("goLogin");
          break;
        case 403:
          err.message = "没有访问权限，拒绝访问";
          break;
        case 404:
          err.message = "请求错误,未找到该资源";
          break;
        case 405:
          err.message = "请求方法未允许";
          break;
        case 408:
          err.message = "请求超时";
          break;
        case 429:
          err.message = "请求过于频繁，请1秒后重试";
          break;
        case 500:
          err.message = err.response.data.message;
          break;
        case 501:
          err.message = "网络未实现";
          break;
        case 502:
          err.message = "网络错误";
          break;
        case 503:
          err.message = "服务不可用";
          break;
        case 504:
          err.message = "网络超时";
          break;
        default:
          err.message = `连接错误${err.response.msg}`;
      }
    } else {
      err.message = "连接到服务器失败";
    }
    store.dispatch("showMassage", {
      type: "error",
      data: err.message || err.response.msg,
    });
    return Promise.reject(err.response);
  }
);
/**
 * 下载文件
 */
let downloadFile = (url) => {
  window.open(url);
};
export default {
  //get请求
  get(url, param, responseType, header) {
    return axios({
      method: "get",
      url,
      headers: {
        ...(header || {}),
      },
      responseType: responseType,
      params: param || {},
    });
  },
  //post请求
  post(url, param, header) {
    return axios({
      method: "post",
      url,
      headers: {
        ...(header || {}),
        "Content-Type": "application/json;charse=UTF-8",
      },
      data: param || {},
    });
  },
  postFormData(url, params, header) {
    return axios({
      method: "post",
      url,
      headers: {
        ...(header || {}),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: QS.stringify(params) || {},
    });
  },
  //post请求
  put(url, param, header) {
    return axios({
      method: "put",
      url,
      headers: {
        ...(header || {}),
        "Content-Type": "application/json;charse=UTF-8",
      },
      data: param || {},
    });
  },
  // delete
  delete(url, param, header) {
    return axios({
      method: "delete",
      url,
      headers: {
        ...(header || {}),
      },
      params: param || {},
    });
  },
  // 此方法非promise 导出文件
  getFile(url, params) {
    let tempParams = {
      ...(params || {}),
    };
    // 拼接下载地址
    let list = [];
    for (let key in tempParams) {
      list.push(key.toString() + "=" + tempParams[key]);
    }
    url = $config.baseURL + url + "?" + list.join("&");
    url = encodeURI(url);
    downloadFile(url);
  },
};
