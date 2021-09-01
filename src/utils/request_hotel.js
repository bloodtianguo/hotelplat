import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
// var baseurl = '/api'
let baseurl = process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL: baseurl, //默认接口地址
  timeout: 5000,
})
// 图片上传地址
service.interceptors.request.use(config => {
    if (store.getters.token) {
      config.headers['Authorization'] =getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor 修改 层级格式
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== "0") {
      if (res.code === "-1" && res.msg == "该信用代码已被使用") {
        Message({
          message: "该信用代码已被使用",
          type: "warning",
          duration: 5 * 1000,
          center: true
        });
      } else if (res.code === "-1" && res.msg.includes("token")) {
        MessageBox.confirm('您已注销，请重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if(res.code === "-1" && res.msg.includes("未登录的请求")){
        MessageBox.confirm('您已注销，请重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.msg == '账号不存在') {
        return Promise.reject(res.msg)
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
          center: true
        })
      }
      return Promise.reject(new Error(res.msg || '错误!'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000,
      center: true
    })
    return Promise.reject(error)
  }
)

export default service
