/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace UniApp {
  interface Uni {
    showWaiting(args: ShowLoadingOptions): void;
    hideWaiting(): void;
    onUIStyleChange(args: (res: { theme: "dark" | "light" }) => void): void;
  }
}