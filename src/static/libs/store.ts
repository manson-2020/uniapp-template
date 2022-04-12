
import { createStore } from 'vuex';

export interface State {
  theme: "light" | "dark" | "auto"
};

const state: State = {
  theme: uni.getStorageSync("theme") || "auto"
};

const mutations = {
  setTheme(state: State, payload: "light" | "dark" | "auto") {
    state.theme = payload;
  }
};

const actions = {};

export default createStore({
  state,
  mutations,
  actions
});
