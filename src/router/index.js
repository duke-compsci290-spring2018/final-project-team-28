import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import yearViz from '@/components/yearViz'
import userPage from '@/components/userPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/:year',
      name: 'yearViz',
      component: yearViz,
      props: true
    },
    {
      path: '/user/:username',
      name: 'userPage',
      component: userPage,
      props: true
    }
  ]
})
