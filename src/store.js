import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const COVER_URL = [
  'https://pic.imgdb.cn/item/61a1dd812ab3f51d91124074.jpg',
  'https://pic.imgdb.cn/item/61a1dd932ab3f51d911245b1.jpg',
  'https://pic.imgdb.cn/item/61a1dda52ab3f51d91124c49.jpg'
]

export default new Vuex.Store({
  state: {
    isPlaying: false,
    coverUrl: ''
  },
  getters: {},
  mutations: {
    togglePlay (state, toggle) {
      state.isPlaying = toggle !== undefined ? toggle : !state.isPlaying
    },
    changeCover (state) {
      while (1) {
        const index = Math.floor(Math.random() * COVER_URL.length)
        const coverUrl = COVER_URL[index]
        if (coverUrl !== state.coverUrl) {
          state.coverUrl = coverUrl
          break
        }
      }
    }
  },
  actions: {}
})
