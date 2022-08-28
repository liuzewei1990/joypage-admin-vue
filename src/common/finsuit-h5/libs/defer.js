export default function defer() {
  let resolve = null
  let reject = null
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    promise,
    resolve,
    reject,
  }
}
