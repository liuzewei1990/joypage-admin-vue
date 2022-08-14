import { Message } from "element-ui"
export const success = (message) => (process.env.NODE_ENV === "development" ? Message.success(message) : window.parent.exportApi.message({ type: "success", message }))
export const fail = (message) => (process.env.NODE_ENV === "development" ? Message.warning(message) : window.parent.exportApi.message({ type: "warning", message }))
export const error = (message) => (process.env.NODE_ENV === "development" ? Message.error(message) : window.parent.exportApi.message({ type: "error", message }))
