import request from '@/utils/request_hotel'
//房型条件分页查询
export function roomlist(params) {
  return request({
    url: '/hotel/platform/room/list',
    method: 'post',
    data: params,
  })
}
// 查询详情
export function roomget(params) {
  return request({
    url: '/hotel/platform/room/get',
    method: 'post',
    params
  })
}

// 房型审核
export function roomaudit(params) {
  return request({
    url: '/hotel/platform/room/audit',
    method: 'post',
    params
  })
}
// 违规下架
export function roomviolation(params) {
  return request({
    url: '/hotel/platform/room/violation',
    method: 'post',
    params
  })
}
