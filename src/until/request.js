import axios from 'axios'
import Qs from 'qs'


axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//generateReqKey：用于根据当前请求的信息，生成请求 Key；
function generateReqKey (config) {
  const { method, url, params, data } = config;
  return [method, url, Qs.stringify(params), Qs.stringify(data)].join("&");
}
// addPendingRequest：用于把当前请求信息添加到pendingRequest对象中；
const pendingRequest = new Map();
function addPendingRequest (config) {
  const requestKey = generateReqKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingRequest.has(requestKey)) {
      pendingRequest.set(requestKey, cancel);
    }
  });
}
//removePendingRequest：检查是否存在重复请求，若存在则取消已发的请求。
function removePendingRequest (config) {
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey);
    cancelToken(requestKey);
    pendingRequest.delete(requestKey);
  }
}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
  addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

axios.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config); // 从pendingRequest对象中移除请求
    return response;
  },
  (error) => {
    removePendingRequest(error.config || {}); // 从pendingRequest对象中移除请求
    if (axios.isCancel(error)) {
      console.log("已取消的重复请求：" + error.message);
    } else {
      // 添加异常处理
    }
    return Promise.reject(error);
  }
);

export default axios