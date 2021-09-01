import request from '@/utils/request_hotel'
// 平台工作台统计
export function getwork () {
  return request({
    url: '/hotel/platform/work/get',
    method: 'post',
  })
}
