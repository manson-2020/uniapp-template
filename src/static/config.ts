const config = {
  development: {
    http: "http://localhost:8000",
    socket: null
  },
  production: {
    http: null,
    socket: null
  },
  path: {
    prefix: null,
    auth: null,
    checkVersion: null,
    setUserInfo: "",
    setConfig: ""
  },
  page: {
    auth: [
      // #ifdef MP
      "/pages/auth/applets",
      // #endif
      // #ifndef MP
      "/pages/auth/login",
      // #endif
    ][0],
    home: [
      "/pages/tabs/home",
      "/pages/admin/index"
    ],
    error: "/pages/common/error"
  },
  userInfoStorageKey: "userInfo",
  tokenField: "token",
  authValidityDay: 7
}

const urls = config[process.env.NODE_ENV as "development" | "production"],
  API_URL = `${urls.http || ""}${config.path?.prefix || ""}`,
  SOCKET_URL = `${urls.socket || ""}${config.path?.prefix || ""}`;

export default Object.assign(config, {
  urls,
  API_URL,
  SOCKET_URL
}, uni.getStorageSync("$config") || {});
