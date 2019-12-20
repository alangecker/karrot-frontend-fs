
function initialState () {
  return {

  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {

  },
  actions: {
    async goToProfile ({ commit }, { userId }) {
      window.location = '/profile/' + userId
    },
  },
  mutations: {
  },
}
