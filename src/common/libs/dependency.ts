import { isAbsoluteURL } from "./utils";
import $config from "../config";
import { Response } from "../type";

export function requestInvoke(
  args: UniApp.RequestOptions & UniApp.UploadFileOption,
  paramsKey: "data" | "formData"
): UniApp.RequestOptions | UniApp.UploadFileOption {
  args.url = isAbsoluteURL(args.url) ? args.url : $config.URL_REMOTE + $config.API_PREFIX + args.url;
  args.header ?? (args.header = {});
  paramsKey === "data" && (args.header["Content-type"] = "application/x-www-form-urlencoded");
  args.header["lang"] = uni.getLocale();
  args[paramsKey] ?? (args[paramsKey] = {});

  const token = uni.getStorageSync($config.STORAGE_KEY_USER_INFO)?.value?.[$config.FIELD_TOKEN];
  if (token) {
    args.header[$config.FIELD_TOKEN] = token;
    // args[paramsKey][$config.FIELD_TOKEN] = token;
  }

  for (let key in args[paramsKey]) {
    if ([null, undefined, NaN].includes(args[paramsKey][key])) delete args[paramsKey][key];
  }
  return args;
}

const pretreatment = {
  debounce: false,
  login: ({ msg: content, data }: Response): Promise<string> | void => {
    if (pretreatment.debounce) return Promise.reject(content);
    pretreatment.debounce = true;
    uni.showModal({
      title: "温馨提示",
      content,
      confirmText: "去登录",
      success({ confirm, cancel }) {
        uni.removeStorage({ key: $config.STORAGE_KEY_USER_INFO });
        cancel && +data?.forcedLogin && uni.navigateBack();
        confirm && uni.navigateTo({
          url: [
            // #ifdef MP
            $config.PAGE_LOGIN_APPLETS,
            // #endif
            // #ifndef MP
            $config.PAGE_LOGIN_ACCOUNT
            // #endif
          ][0]
        });
      },
      complete: () => {
        pretreatment.debounce = false;
      }
    });
    return Promise.reject(content);
  },
  buy({ msg, data }: Response): Promise<string> | void {
    uni.showModal({
      title: "温馨提示",
      content: `${msg}, 要现在去购买吗？`,
      confirmText: "去购买",
      success({ confirm, cancel }) {
        // #ifdef APP-PLUS
        if (confirm) {
          uni.navigateTo({
            url: `${$config.PAGE_PLACE_AN_ORDER}?mode=1&id=${+data.id}&type=${+data.type}`
          });
        }
        // #endif

        // #ifndef APP-PLUS
        confirm && uni.showToast({
          title: "请前往APP购买",
          icon: "none",
          duration: 1200,
          success: () => setTimeout(uni.navigateBack, 1200)
        });
        // #endif

        cancel && uni.navigateBack();
      }
    });
    return Promise.reject(msg);
  },
  subscription({ msg: content }: Response): Promise<string> | void {
    uni.showModal({
      title: "温馨提示",
      content,
      confirmText: "去开通",
      success({ confirm, cancel }) {
        // #ifdef APP-PLUS
        confirm && uni.navigateTo({
          url: $config.PAGE_SUBSCRIPTION
        });
        // #endif

        // #ifndef APP-PLUS
        confirm && uni.showToast({
          title: "请前往APP开通",
          icon: "none",
          duration: 1200,
          success: () => setTimeout(uni.navigateBack, 1200)
        });
        // #endif

        cancel && uni.navigateBack();
      }
    });
    return Promise.reject(content);
  },
  fail(res: Response): Promise<Response> {
    uni.showToast({ title: res.msg, icon: "none" });
    return Promise.reject(res)
  },
  success: (res: Response): Promise<Response> => Promise.resolve(res),
}

export function requestSuccess({ data, statusCode }: UniApp.RequestSuccessCallbackResult) {
  try {
    const res = typeof (data) === "string" ? JSON.parse(data) : data,
      { success, login, fail, buy, subscription } = pretreatment;
    switch (+res.code) {
      case 0:
        return fail(res);
      case 2:
        return buy(res);
      case 401:
        return login(res);
      case 405:
        return subscription(res);
      default:
        return success(res);
    };
  } catch (error) {
    // DEBUG MODE
    const content = JSON.stringify(data || "服务器无响应", null, 2);
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
    console.log(`%c Response`, "color: #5b6cf2;", res);
  }
});

export function connectWebsocket() {
  if (!$config.URL_WEBSOCKET) return;
  let [socketOpen, socketMsgQueue]: [boolean, string[]] = [false, []];

  uni.connectSocket({ url: $config.URL_WEBSOCKET });
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

export function checkVersion({ showToast } = { showToast: false }) {
  const { appName, appVersion } = uni.getSystemInfoSync();
  console.log(
    `%c ${appName} %c Version ${appVersion} %c`,
    "background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff",
    "background: #007aff; padding: 1px; margin: 1px; border-radius: 0 3px 3px 0; color: #fff; font-weight: bold;",
    "background: transparent"
  );

  // #ifdef MP
  const { onCheckForUpdate, onUpdateReady, onUpdateFailed, applyUpdate } = uni.getUpdateManager();

  onCheckForUpdate(({ hasUpdate }) => {
    showToast && uni.showToast({ title: hasUpdate ? "发现新版本，正在更新..." : "已是最新版本！", icon: "none" });

    hasUpdate && console.log("New version found !");
  });

  onUpdateReady((res) => {
    uni.showModal({
      title: "Update Tips",
      confirmText: "Restart",
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
  if (!$config.API_CHECK_VERSION) return;
  const { osName, appVersionCode, deviceBrand } = uni.getSystemInfoSync();
  uni.request({
    url: $config.API_CHECK_VERSION,
    data: { osName, appVersionCode, deviceBrand },
    success: <any>(({ data, msg: title }: Response) => {
      if (!data?.upgradeURL) {
        showToast && uni.showToast({ title, icon: "none" });
        return;
      };
      uni.setStorage({
        key: "upgradeInfo",
        data: { title, ...data },
        success() {
          uni.navigateTo({ url: $config.PAGE_UPGRADE });
        }
      });
    }),
    fail({ errMsg: title }) {
      uni.showToast({ title, icon: "error" });
    }
  });
  // #endif
}

export async function setConfig() {
  await uni.setStorage({
    key: "$config",
    data: await uni.request({ url: `${$config.URL_ASSETS}/static/config.json` })
  });

  if ($config.API_CONFIG_GET) {
    const { data } = await <unknown>uni.request({ url: $config.API_CONFIG_GET }) as Response;
    await uni.setStorage({ key: "$config", data: { $type: "update", value: data } });
  };

}
