import request from '@/utils/request_hotel'
// 发票条件分页查询
export function invoiceList (params) {
  return request({
    url: '/hotel/platform/invoice/list',
    method: 'post',
    data:params,
  })
}
// 查询详情
export function invoiceDetail (params) {
  return request({
    url: '/hotel/platform/invoice/get',
    method: 'post',
    params
  })
}
// 上传发票审核
export function invoiceAudit (params) {
  return request({
    url: '/hotel/platform/invoice/audit',
    method: 'post',
    params
  })
}
//查询退款列表
export function refundList (params) {
  return request({
    url: '/hotel/platform/refund/list',
    method: 'post',
    data:params,
  })
}
// 发起退款
export function orderRefund (params) {
  return request({
    url: '/hotel/platform/order/sponsor',
    method: 'post',
    params
  })
}
//退款详情
export function refundGet (params) {
  return request({
    url: '/hotel/platform/refund/get',
    method: 'post',
    params
  })
}
