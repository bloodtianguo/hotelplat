import request from '@/utils/request_hotel'
//条件分页查询
export function serverList (params) {
  return request({
    url: '/hotel/platform/server/list',
    method: 'post',
    params,
  })
}
//新增渠道商获取验证码
export function getPhoneSms (params) {
  return request({
    url: '/hotel/platform/server/getPhoneSms',
    method: 'get',
    params,
  })
}
//新增渠道商
export function serveradd (params) {
  return request({
    url: '/hotel/platform/server/add',
    method: 'post',
    params,
  })
}
// 编辑渠道商
export function servereditor (params) {
  return request({
    url: '/hotel/platform/server/editor',
    method: 'post',
    params,
  })
}
// 解绑
export function serverunbind (params) {
  return request({
    url: '/hotel/platform/server/unbind',
    method: 'post',
    params,
  })
}
