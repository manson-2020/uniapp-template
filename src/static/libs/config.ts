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
    api: null,
    socket: null,
    login: null,
    checkVersion: null
  },
  page: {
    auth: "/pages/auth/login",
    userHome: "/pages/user/tabs/home",
    adminHome: "/pages/admin/index",
    error: "/pages/common/notFound"
  },
  authValidityDay: 7
}

const urls = config[process.env.NODE_ENV as "development" | "production"],
  API_URL = `${urls.http || ""}${config.path?.api || ""}`,
  SOCKET_URL = `${urls.socket || ""}${config.path?.socket || ""}`;

export default Object.assign(config, { urls, API_URL, SOCKET_URL });
