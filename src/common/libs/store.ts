
import { createStore, mapState, useStore } from 'vuex';
import { computed } from "vue";

export interface State {
  theme: "light" | "dark";
  downloadProgress: any;
  addressInfo: AnyObject;
};

const state: State = {
  theme: "light",
  downloadProgress: {},
  addressInfo: {}
};

const mutations = {
  setTheme(state: State, payload: "light" | "dark") {
    state.theme = payload;
  },
  setDownloadProgress(state: State, payload: any) {
    if (payload.progressInfo) {
      state.downloadProgress[payload.key] = payload.progressInfo;
    } else {
      delete state.downloadProgress[payload.key];
    }
  },
  setAddressInfo(state: State, payload: AnyObject) {
    state.addressInfo = payload;
  }
};

const actions = {};

export const useMapState = (getKeys: string[]) => {
  const $store = useStore();
  const storeState: any = {};
  const storeFns = mapState(getKeys)

  Object.keys(storeFns).forEach((fnKeys: string) => {
    const fn = storeFns[fnKeys].bind({ $store })
    storeState[fnKeys] = computed(fn)
  })

  return storeState
}

export default createStore({
  state,
  mutations,
  actions
});