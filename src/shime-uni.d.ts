import { Store } from 'vuex'
import { State } from './common/libs/store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
    $route?: {
      fullPath: string;
      hash: string;
      matched: any[];
      meta: any;
      name?: string;
      params: any;
      path: string;
      query: any;
      redirectedFrom?: string
    }
  }
}

// Vuex@4.0.0-beta.1 is missing the typing for `useStore`. See https://github.com/vuejs/vuex/issues/1736
declare module 'vuex' {
  export function useStore(key?: string): Store<State>
}