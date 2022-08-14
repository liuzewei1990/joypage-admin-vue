//BcSelect validator
export const bcSelect = (message = "该值不能为空") => {
  return (rule, value, callback) => {
    if (!value.id) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
}
