import axios from 'axios'
import { addPendingRequest, removePendingRequest } from './cancelRepeatRequest'


axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 响应正常时候就从pendingRequest对象中移除请求
  removePendingRequest(response);
  return response
},
  error => {
    // 从pending 列表中移除请求
    removePendingRequest(error.config || {});
    // 需要特殊处理请求被取消的情况
    if (!Axios.isCancel(error)) {
      // 请求重发
      againRequest(error, axios);
    }

    return Promise.reject(error);
  });
export default axios