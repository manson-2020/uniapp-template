import { isAbsoluteURL, pageData, transformQueryString } from "./utils";
import $config from "../config";
import { Response } from "../type";

export const pretreatment = {
  throttle: false,
  times: 0,
  codeHandler: {
    notAuth: async ({ msg: content }: Response): Promise<string | void> => {
      if (pretreatment.throttle) return;
      pretreatment.throttle = true;

      if ($config.page.auth) {
        pretreatment.throttle = true;
        uni.showModal({
          content,
          showCancel: false,
          confirmText: "login again",
          success() {
            uni.reLaunch({ url: $config.page.auth, success: uni.clearStorage });
            pretreatment.throttle = false;
          }
        });

        return Promise.reject(content);
      }
      if (!$config.path.auth) return Promise.reject("The authorization server address is not configured.");

      const { code } = await uni.login({}) as unknown as UniApp.LoginRes,
        { data }: Response = await uni.request({
          url: $config.path.auth as string,
          data: { code }
        }) as unknown as Response;

      uni.setStorage({
        key: $config.authInfoStorageKey,
        data: { value: data, validityDay: $config.authValidityDay }
      })

      if (++pretreatment.times >= 3) {
        const { cancel } = await uni.showModal({
          title: "Prompt",
          content: "Multiple redirects detected, Whether to continue?",
          confirmText: "Continue",
          cancelText: "Cancel"
        }) as unknown as UniApp.ShowModalRes;
        if (cancel) return;
      }
      pretreatment.times = 0;
      pretreatment.throttle = false;
      const { route, options }: any = pageData(-1);
      uni.reLaunch({ url: `/${route}?${transformQueryString(options)}` });
      return Promise.reject(content);
    },

    fail: (res: Response): Promise<Response> => {
      uni.showToast({ title: res.msg, icon: "none" });
      return Promise.reject(res)
    },

    error: (res: Response): Promise<Response> => Promise.reject(res),

    success: (res: Response): Promise<Response> => Promise.resolve(res),
  }
}

export function requestInvoke(
  args: UniApp.RequestOptions & UniApp.UploadFileOption,
  paramsKey: "data" | "formData"
): UniApp.RequestOptions | UniApp.UploadFileOption {
  args.url = isAbsoluteURL(args.url) ? args.url : $config.API_URL + args.url;
  args.header ?? (args.header = {});
  paramsKey === "data" && (args.header["Content-type"] = "application/x-www-form-urlencoded");
  args.header["lang"] = uni.getLocale();

  args[paramsKey] ?? (args[paramsKey] = {});
  args[paramsKey][$config.authField] = uni.getStorageSync($config.authInfoStorageKey)?.value?.[$config.authField];

  for (let key in args[paramsKey]) {
    if ([null, undefined, NaN].includes(args[paramsKey][key])) delete args[paramsKey][key];
  }
  return args;
}

export function requestSuccess({ data, statusCode }: UniApp.RequestSuccessCallbackResult) {
  try {
    const res = typeof (data) === "string" ? JSON.parse(data) : data,
      { success, notAuth, fail, error } = pretreatment.codeHandler;
    switch (+res.status) {
      case 400:
        return fail(res);
      case 200:
        return success(res);
      case 401:
        return notAuth(res);
      default:
        return error(res);
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
  success: (res: UniApp.RequestSuccessCallbackResult): Promise<any> => requestSuccess(res),
  fail({ errMsg }: UniApp.GeneralCallbackResult): void {
    if (errMsg.includes("abort")) return;
    uni.showToast({ title: String(errMsg), icon: "none" });
  },
  complete(res: UniApp.GeneralCallbackResult): void {
    console.log(
      `%c Response `,
      "color: #cfefdf; font-weight:500; background-color: #108ee9; padding: 1px; border-radius: 3px;",
      res
    );
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
    const { onCheckForUpdate, onUpdateReady, onUpdateFailed, applyUpdate } =
      uni.getUpdateManager();

    onCheckForUpdate(({ hasUpdate }) => {
      /* Callback after requesting new version information */
      hasUpdate && uni.clearStorage();
    });

    onUpdateReady((res) => {
      uni.showModal({
        title: "Update Tips",
        content:
          "The new version is ready. Do you want to restart the application?",
        success: ({ confirm }) => confirm && applyUpdate(),
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
    const { data, msg: title }: any = await uni.request({
      url: checkVersionURL,
      data: {
        platform: uni.getSystemInfoSync().platform,
        version: plus.runtime.version,
      },
    });

    if (!data.upgradeUrl) return;

    const [showModalFail, showModalRes]: any = await uni.showModal({
      title,
      content: data.description,
      showCancel: Boolean(+data.forceUpdate),
    });

    if (showModalFail || !showModalRes.cancel) return;

    if (uni.getSystemInfoSync().platform == "ios") {
      plus.runtime.openURL(data.upgradeUrl);
      return;
    }

    const showLoading = plus.nativeUI.showWaiting("start download...");

    const downloadTask = uni.downloadFile({
      url: data.upgradeUrl,
      success: ({ tempFilePath }) => {
        showLoading.setTitle("Installing...");

        plus.runtime.install(
          <any>tempFilePath,
          {},
          (e) => {
            plus.nativeUI.closeWaiting();
            uni.showModal({
              title: "Update complete",
              content: "The new version needs to restart the app.",
              confirmText: "Restart now",
              showCancel: false,
              success: plus.runtime.restart,
            });
          },
          (error) => {
            plus.nativeUI.closeWaiting();
            uni.showToast({ title: "install failed", icon: "none" });
          }
        );
      },
      fail() {
        uni.showToast({ title: "download failed", icon: "none" });
      },
    });

    downloadTask.onProgressUpdate(
      ({ progress, totalBytesWritten, totalBytesExpectedToWrite }) =>
        showLoading.setTitle(
          `Downloading (${(totalBytesWritten / 1024 ** 2).toFixed(2)}MB/${(
            totalBytesExpectedToWrite /
            1024 ** 2
          ).toFixed(2)}MB)	${progress}%`
        )
    );
    // #endif
  } catch ({ message }) {
    uni.showToast({ title: message as string, icon: "error" });
  }
}
