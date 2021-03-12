import { createStore } from "vuex";

export default createStore({
  state: {test:1},
  mutations: {
    setTest(state) {
      state.test += 1;
    }
  },
  actions: {
    setTests(context) {
      context.commit('setTest');
    }
  },
  modules: {}
});
