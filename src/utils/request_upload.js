import axios from 'axios'
import {
  Message
} from 'element-ui'
// var baseurl = 'http://192.168.0.201:8000'
let baseurl = process.env.VUE_APP_BASE_UPLOAD
// var baseurl = 'http://api.meizkj.com:8080'//正式
const service = axios.create({
  baseURL: baseurl, //默认接口地址
  timeout: 5000,
})
// 图片上传地址
export var ITEMS_UP_IMG = baseurl + "/api/v1/basic/uploadFile"
service.interceptors.request.use(config => {
    return config
  },
  error => {
    console.log(error, "错误") // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== "0") {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
