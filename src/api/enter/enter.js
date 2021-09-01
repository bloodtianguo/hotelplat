import request from '@/utils/request_hotel'
//条件分页查询
export function enterList (params) {
  return request({
    url: '/hotel/platform/enter/list',
    method: 'post',
    data:params,
  })
}

//入驻消息详情
export function enterGet (params) {
  return request({
    url: '/hotel/platform/enter/get',
    method: 'post',
    params
  })
}
// 处理入驻消息
export function enterHandle (params) {
  return request({
    url: '/hotel/platform/enter/handle',
    method: 'post',
    params
  })
}
