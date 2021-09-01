import request from '@/utils/request_hotel'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
//登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 扫码登陆:获取创建二维码数据
export function getCreateScanData(data) {
  return request({
    url: '/hotel/platform/login/getCreateScanData',
    method: 'post',
    params:{
      platform:data
    },
  })
}

// 扫码登陆：扫码轮询
export function getScanForInfo(data) {
  return request({
    url: '/hotel/platform/login/getScanForInfo',
    method: 'post',
    params:{code:data}
  })
}
//扫码回调
export function getscanCallback(data) {
  return request({
    url: '/hotel/platform/login/scanCallback',
    method: 'post',
    params:{
      code:data,
    }
  })
}
