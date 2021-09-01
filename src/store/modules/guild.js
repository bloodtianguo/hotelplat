const getDefaultState = () => {
  return {
    guildId:'',//需要查看的公会ID
    anchorId:'',//需要查看的主播ID
  }
}

const state = getDefaultState()
const mutations = {
  // 写入公会id
  SET_GUILDID(state, val) {
    state.guildId = val
  },
  // 调用写入主播id
  SET_AMCHORID(state, val) {
    state.anchorId = val
  },
}

const actions = {
  // 调用写入公会id
  setGuildid ({ commit },val) {
    commit('SET_GUILDID', val)
  },
  // 调用写入主播id
  setAnchorId ({ commit },val) {
    commit('SET_AMCHORID', val)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

