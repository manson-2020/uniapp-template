import { isAbsoluteURL } from "./utils";
import $config from "../config";
import { Response } from "../type";

export function requestInvoke(
  args: UniApp.RequestOptions & UniApp.UploadFileOption,
  paramsKey: "data" | "formData"
): UniApp.RequestOptions | UniApp.UploadFileOption {
  args.url = isAbsoluteURL(args.url) ? args.url : $config.API_URL + args.url;
  args.header ?? (args.header = {});
  paramsKey === "data" && (args.header["Content-type"] = "application/x-www-form-urlencoded");
  args.header["lang"] = uni.getLocale();

  args[paramsKey] ?? (args[paramsKey] = {});
  args[paramsKey][$config.tokenField] = uni.getStorageSync($config.userInfoStorageKey)?.value?.[$config.tokenField];

  for (let key in args[paramsKey]) {
    if ([null, undefined, NaN].includes(args[paramsKey][key])) delete args[paramsKey][key];
  }
  return args;
}

const pretreatment = {
  debounce: false,
  login: ({ msg: content }: Response): Promise<string> | void => {
    if (pretreatment.debounce === true) return;
    pretreatment.debounce = true;
    uni.showModal({
      content,
      confirmText: "login again",
      success() {
        uni.reLaunch({
          url: $config.page.auth,
          success: uni.clearStorage
        });
      },
      complete: () => {
        pretreatment.debounce = false;
        uni.hideWaiting();
      }
    });
    return Promise.reject(content);
  },
  fail: (res: Response): Promise<Response> => {
    uni.showToast({ title: res.msg, icon: "none" });
    return Promise.reject(res)
  },
  auth: (res: Response): Promise<Response> => {
    uni.navigateTo({ url: $config.page.auth });
    return Promise.reject(res)
  },
  success: (res: Response): Promise<Response> => Promise.resolve(res),
}

export function requestSuccess({ data, statusCode }: UniApp.RequestSuccessCallbackResult) {
  try {
    const res = typeof (data) === "string" ? JSON.parse(data) : data,
      { success, login, fail, auth } = pretreatment;
    switch (+res.code) {
      case 400:
        return fail(res);
      case 401:
        return login(res);
      case 402:
        return auth(res);
      default:
        return success(res);
    };
  } catch (error) {
    const content = String(data) || "No Response!";
    uni.showModal({
      title: `StatusCode ${statusCode}`,
      content,
      confirmText: "Copy",
      cancelText: "Cancel",
      success: ({ confirm }) =>
        confirm && uni.setClipboardData({ data: content })
    });
    return Promise.reject(content);
  }
}

export const requestInterceptorOptions = (paramsKey: "data" | "formData"): UniApp.InterceptorOptions => ({
  invoke: (args: UniApp.RequestOptions & UniApp.UploadFileOption):
    UniApp.RequestOptions | UniApp.UploadFileOption => requestInvoke(args, paramsKey),
  success: (res: UniApp.RequestSuccessCallbackResult) => requestSuccess(res),
  fail({ errMsg }: UniApp.GeneralCallbackResult): void {
    if (errMsg.includes("abort")) return;
    uni.showToast({ title: String(errMsg), icon: "none" });
  },
  complete(res: UniApp.GeneralCallbackResult): void {
    console.log(`%c Response `, "color: #cfefdf;", res);
  }
});

export function openWebsocket() {
  let [socketOpen, socketMsgQueue]: [boolean, string[]] = [false, []];

  uni.connectSocket({ url: $config.SOCKET_URL });
  uni.onSocketOpen((res) => {
    socketOpen = true;
    for (let i = 0; i < socketMsgQueue.length; i++) {
      socketOpen
        ? uni.sendSocketMessage({ data: socketMsgQueue[i] })
        : socketMsgQueue.push(socketMsgQueue[i]);
    }
    socketMsgQueue = [];
    // uni.closeSocket({});
  });
  uni.onSocketMessage((res) => {
    console.log("Received server content:" + res.data);
  });
  uni.onSocketClose((res) => {
    socketOpen = false;
    console.log("Websocket closed!");
  });
  uni.onSocketError((res) => {
    console.log("Websocket connection opening failed, please check!");
  });
}

export async function checkVersion() {
  console.log(
    `%c uni Admin %c enjoy! %c`,
    "background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff",
    "background: #007aff; padding: 1px; margin: 1px; border-radius: 0 3px 3px 0; color: #fff; font-weight: bold;",
    "background: transparent"
  );
  try {
    // #ifdef MP
    const {
      onCheckForUpdate,
      onUpdateReady,
      onUpdateFailed,
      applyUpdate
    } = uni.getUpdateManager();

    onCheckForUpdate(({ hasUpdate }) => {
      hasUpdate && console.log("New version found !");
    });

    onUpdateReady((res) => {
      uni.showModal({
        title: "Update Tips",
        confirmText: "Restart now",
        cancelText: "Cancel",
        content:
          "The new version is ready. Do you want to restart the application?",
        success: ({ confirm }) => {
          uni.clearStorage();
          confirm && applyUpdate();
        },
      });
    });

    onUpdateFailed((res) => {
      uni.showToast({
        title: "Failed to download the new version. Please try again later.",
        icon: "none",
      });
    });
    // #endif

    // #ifdef APP-PLUS
    const { checkVersion: checkVersionURL } = $config.path;
    if (!checkVersionURL) return;
    const { data, msg: title } = await (<unknown>uni.request({
      url: checkVersionURL,
      data: {
        platform: uni.getSystemInfoSync().platform,
        version: plus.runtime.version,
      },
    }) as Promise<Response>);

    if (!data.upgradeUrl) return;

    const { confirm } = await (<unknown>uni.showModal({
      title,
      content: data.description,
      showCancel: Boolean(+data.forceUpdate),
      confirmText: "go to upgrade"
    }) as Promise<UniApp.ShowModalRes>);

    confirm && plus.runtime.openURL(data.upgradeURL);

    // #endif
  } catch ({ message }) {
    uni.showToast({ title: message as string, icon: "error" });
  }
}

export function setConfig() {
  uni.request({
    url: $config.path.setConfig,
    success({ data }) {
      uni.setStorageSync("$config", data);
    }
  })
}
