import defer from "./defer.js"

export default class Queue {
  constructor() {
    let tasks = []
    let isRunning = false //记录是否有未完成的任务

    async function execute(currentTask, resolve, reject) {
      try {
        let data = await currentTask()
        resolve(data)
      } catch (error) {
        reject(error)
      }
      //等待任务队列中如果有任务，则触发它；否则设置isRunning = false,表示无任务状态
      if (tasks.length) {
        const next = tasks.shift()
        execute(next.task, next.resolve, next.reject)
      } else {
        isRunning = false
      }
    }

    return function (task) {
      let { promise, resolve, reject } = defer()
      if (isRunning) {
        tasks.push({ task, resolve, reject })
      } else {
        isRunning = true
        execute(task, resolve, reject)
      }
      return promise
    }
  }
}
