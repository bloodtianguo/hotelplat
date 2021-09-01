import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/home',
    component: Layout,
    children: [{
      path: '',
      name: 'Home',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '工作台',
        icon: 'workbench'
      }
    }]
  },
  {
    path: '/hotel',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Hotelmanage',
        component: () => import('@/views/hotelmanage/index'),
        meta: {
          title: '酒店管理',
          icon: 'hotel'
        },
      },
      {
        path: 'details',
        name: 'Hoteldetails',
        component: () => import('@/views/hotelmanage/details'),
        meta: {
          title: '酒店详情'
        },
        hidden: true
      }
    ]
  },

  {
    path: '/ordermanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Ordermanage',
        component: () => import('@/views/ordermanage/manager'),
        meta: {
          title: '订单管理',
          icon: 'order'
        }
      },
      {
        path: 'details',
        name: 'Orderdetails',
        component: () => import('@/views/ordermanage/details'),
        meta: {
          title: '订单详情'
        },
        hidden: true
      }
    ]
  },

  {
    path: '/roommanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Roommanage',
        component: () => import('@/views/roommanage/manager'),
        meta: {
          title: '房型管理',
          icon: 'room'
        }
      },
      {
        path: 'details',
        name: 'Roomdetails',
        component: () => import('@/views/roommanage/details'),
        meta: {
          title: '房型详情'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/finanmanage',
    redirect: "/finanmanage/manage",
    component: Layout,
    meta: {
      title: '财务管理',
      icon: 'finan'
    },
    children: [{
        path: 'manage',
        name: 'FinaManage',
        component: () => import('@/views/finanmanage/manager'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'details',
        name: 'Finadetails',
        component: () => import('@/views/finanmanage/details'),
        meta: {
          title: '订单详情'
        },
        hidden: true
      },
      {
        path: 'invoice',
        name: 'Invoice',
        component: () => import('@/views/finanmanage/invoice'),
        meta: {
          title: '发票列表'
        },
      },
      {
        path: 'invoicedetails',
        name: 'Invoicedetails',
        component: () => import('@/views/finanmanage/invoicedetails'),
        meta: {
          title: '发票详情'
        },
        hidden: true
      },
      {
        path: 'refund',
        name: 'Refund',
        component: () => import('@/views/finanmanage/refund'),
        meta: {
          title: '退款列表'
        },
      },
      {
        path: 'refunddetails',
        name: 'Refunddetails',
        component: () => import('@/views/finanmanage/refunddetails'),
        meta: {
          title: '退款详情'
        },
        hidden: true
      },
    ]
  },
  {
    path: '/entermanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Entermanage',
        component: () => import('@/views/entermanage/manager'),
        meta: {
          title: '入驻消息',
          icon: 'enter'
        }
      },
      {
        path: 'details',
        name: 'Enterdetails',
        component: () => import('@/views/entermanage/details'),
        meta: {
          title: '入驻详情'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    children: [{
      path: 'manager',
      name: 'Channelmanager',
      component: () => import('@/views/channelmanage/manager'),
      meta: {
        title: '渠道商管理',
        icon: 'channel'
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
