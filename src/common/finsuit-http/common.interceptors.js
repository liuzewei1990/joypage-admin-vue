export const sxl_interceptors = (responseData) => {
  let { datatypeParam, headerModel } = responseData || {}
  if (headerModel.code == "0") {
    return Promise.resolve(datatypeParam)
  } else {
    const msg = headerModel.message || "系统未知异常"
    window.parent.exportApi.message({ type: "error", message: msg })
    return Promise.reject(new Error(msg))
  }
}
