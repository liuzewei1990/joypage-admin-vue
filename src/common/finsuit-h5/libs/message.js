import { Message } from "element-ui"

const isIframe = !!window.parent.exportApi

/**
 * message封装
 * 调用 ：this.$msg.success | this.$msg.fail | this.$msg.error
 * @param {*} message
 * @returns
 */

/* 操作成功 */
export const success = (message = "") => (isIframe ? window.parent.exportApi.message({ type: "success", message }) : Message.success(message))

/* 操作失败 */
export const fail = (message = "") => (isIframe ? window.parent.exportApi.message({ type: "warning", message }) : Message.warning(message))

/* 操作错误 */
export const error = (message = "") => (isIframe ? window.parent.exportApi.message({ type: "error", message }) : Message.error(message))
