import {
  getScanForInfo,
  getCreateScanData,
  getscanCallback
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setMenu,
  removeMenu
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    platform: "hotel",
    rolemenu: ""
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLEMENU: (state, rolemenu) => {
    state.rolemenu = rolemenu
  }
}

const actions = {
  // 扫码获取创建二维码时需要的字符串
  getScanStr() {
    return new Promise((resolve, reject) => {
      getCreateScanData(state.platform).then(({
        data: {
          hotelCode
        }
      }) => {
        resolve(hotelCode)
      }).catch(err => {
        reject(err);
      })
    })
  },

  // 扫码登陆
  scanlogin({
    commit
  }, str) {
    return new Promise((resolve, reject) => {
      getScanForInfo(str).then(({
        data
      }) => {
        if (data.code == 1) {
          if(data.data.menu){
            commit('SET_TOKEN', data.token)
            setMenu(data.data.menu.children)//写入菜单
            setToken(data.token)
            localStorage.name = data.data.user.name
          }else{
            removeMenu()
          }
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 验证token是否过期
  getInfo({
    commit,
    state
  }) {
    commit('SET_NAME', sessionStorage.name)
    commit('SET_AVATAR', sessionStorage.avatar)
    resolve(data)
  },
  // 用户登出
  logout({
    commit
  }) {
    return new Promise((resolve, reject) => {
      removeToken()
      removeMenu()//移除菜单
      resetRouter()
      commit('RESET_STATE')
      sessionStorage.clear()
      resolve()
    })
  },
  // 移除token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken()
      removeMenu()//移除菜单
      commit('RESET_STATE')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
