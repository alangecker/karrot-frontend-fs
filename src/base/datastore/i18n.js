import locales from '@/locales/index'

function initialState () {
  return {
    locale: locales.de,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    locale: state => state.locale,
  },
  actions: {
    async setLocale ({ commit, dispatch, rootGetters }, locale) {
      if (rootGetters['auth/isLoggedIn']) {
        dispatch('auth/maybeBackgroundSave', { language: locale }, { root: true })
      }
      commit('set', locale)
    },
  },
  mutations: {
    set (state, locale) {
      state.locale = locale
    },
  },
}
