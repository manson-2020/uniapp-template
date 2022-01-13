const config = {
    development: {
        http: "https://api.muxiaoguo.cn",
        socket: null
    },
    production: {
        http: null,
        socket: null
    },
    path: {
        api: "/api",
        socket: null,
        login: "/login",
        checkVersion: "/check_version"
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
