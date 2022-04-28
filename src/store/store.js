import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  store: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    username: localStorage.getItem('login_username')
  },
  mutations: {
    storeToken(state, token) {
      state.token = 'Bearer ' + token
      localStorage.setItem('token', state.token)
    },
    clearToken(state) {
      state.token = ''
      localStorage.removeItem('token')
    },
    updateUsername(state, username){
      state.username = username
      localStorage.setItem('login_username', state.username)
    },
    clearUsername(){
      state.username = ''
      localStorage.removeItem('login_username')
    }
  }
})


export default store
