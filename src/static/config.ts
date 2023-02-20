
const SERVER_URL = {
  development: {
    URL_ASSETS: "http://localhost:3000",
    URL_REMOTE: "",
    URL_WEBSOCKET: null,
  },
  production: {
    URL_ASSETS: "",
    URL_REMOTE: "",
    URL_WEBSOCKET: null,
  }
}

const config = {
  ...(SERVER_URL[process.env.NODE_ENV as keyof typeof SERVER_URL]),
  API_PREFIX: "/api",
  API_LOGIN_ACCOUNT: "",
  API_USER_INFO_GET: "",
  API_USER_INFO_SET: "",
  API_FILE_UPLOAD: "",
  API_CHECK_VERSION: "",
  API_CONFIG_GET: null,

  PAGE_CLIENT_HOME: "/pages/client/index",
  PAGE_LOGIN_ACCOUNT: "/pages/auth/login",
  PAGE_ERROR: "/pages/common/error",
  PAGE_UPGRADE: "/pages/common/upgrade",

  PATH_STATIC: "/static/server",
  STORAGE_KEY_USER_INFO: "userInfo",
  FIELD_TOKEN: "token",
  VALIDITY_DAY: 7
};

let URL_STATIC = config.PATH_STATIC;
// #ifdef MP
URL_STATIC = config.URL_ASSETS + URL_STATIC;
// #endif

export default Object.assign(config, { URL_STATIC }, uni.getStorageSync("$config") || {});
