import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken,getMenu } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] //白名单重定向

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/home' })
      NProgress.done()
    } else {
      // 检查是否有菜单信息
      // const hasGetUserInfo = "资料"
      const hasroleMenu = getMenu()
      if (hasroleMenu) {
        next()
      } else {
        //没有权限直接清除token 到登录界面
        try {
          // 删除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          next()
        } catch (error) {
          // 删除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  //完成进度条
  NProgress.done()
})
