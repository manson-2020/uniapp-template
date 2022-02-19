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
    checkVersion: null
  },
  page: {
    auth: "/pages/auth/login",
    clientHome: "/pages/client/tabs/home",
    adminHome: "/pages/admin/index",
    error: "/pages/common/error"
  },
  authInfoStorageKey: "userInfo",
  authField: "token",
  authValidityDay: 7
}

const urls = config[process.env.NODE_ENV as "development" | "production"],
  API_URL = `${urls.http || ""}${config.path?.prefix || ""}`,
  SOCKET_URL = `${urls.socket || ""}${config.path?.prefix || ""}`;

export default Object.assign(config, {
  urls,
  API_URL,
  SOCKET_URL
});
