import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      // 消息推送
        {
            name: 'messageHistory',
            path: '/messageHistory',
            component: require('../view/messageHistory').default,
            meta: { title: '推送历史', requiresAuth: false, keepAlive: false },
        },
        {
          name: 'sendMessage',
          path: '/sendMessage',
          component: require('../view/sendMessage').default,
          meta: { title: '发送通知', requiresAuth: false, keepAlive: false },
        },
        {
          name: 'timingMessage',
          path: '/timingMessage',
          component: require('../view/timingMessage').default,
          meta: { title: '定时消息', requiresAuth: false, keepAlive: false },
        },
        
    ]
})
