import request from '@/utils/request_hotel'
// 酒店申请条件分页查询
export function hotelList(params) {
  return request({
    url: '/hotel/platform/hotel/list',
    method: 'post',
    data: params,
  })
}
// 查询酒店详情接口
export function hotelGet(params) {
  return request({
    url: '/hotel/platform/hotel/get',
    method: 'post',
    params
  })
}
//酒店审核
export function hotelAudit(params) {
  return request({
    url: '/hotel/platform/hotel/audit',
    method: 'post',
    params
  })
}
// 填写信用代码
export function hotelCode(params) {
  return request({
    url: '/hotel/platform/hotel/code',
    method: 'post',
    params
  })
}
