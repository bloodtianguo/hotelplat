import request from '@/utils/request_hotel'
// 订单条件分页查询
export function orderList (params) {
  return request({
    url: '/hotel/platform/order/list',
    method: 'post',
    data:params,
  })
}

// 订单详情查询
export function orderdetail (params) {
  return request({
    url: '/hotel/platform/order/get',
    method: 'post',
    params
  })
}

// 订单待确定审核接口
export function orderconfirm (params) {
  return request({
    url: '/hotel/platform/order/confirm',
    method: 'post',
    params
  })
}
//订单待入住接口
export function orderocc (params) {
  return request({
    url: '/hotel/platform/order/occ',
    method: 'post',
    params
  })
}

// 离店接口
export function orderout (params) {
  return request({
    url: '/hotel/platform/order/out',
    method: 'post',
    params
  })
}
//同意拒绝退款接口
export function orderrefund (params) {
  return request({
    url: '/hotel/platform/order/refund',
    method: 'post',
    params
  })
}
//确认取消订单
export function refundOrderById (params) {
  return request({
    url: '/hotel/platform/order/cancel',
    method: 'post',
    params
  })
}

