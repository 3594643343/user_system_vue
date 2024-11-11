import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickname: sessionStorage.getItem('nickname') || '',
    role: sessionStorage.getItem('role') || null,
  },
  getters: {
  },
  mutations: {
    setNickname(state, nickname) {
      state.nickname = nickname;
      // 使用会话存储保存登录用户信息到浏览器
      sessionStorage.setItem('nickname', nickname); 
    },
    setRole(state, role) {
      state.role = role;
      sessionStorage.setItem('role', role);
    }
  },
  actions: {
  },
  modules: {
  }
})
