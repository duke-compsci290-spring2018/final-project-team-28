import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import yearViz from '@/components/yearViz'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/:cur_year',
      name: 'yearViz',
      component: yearViz,
      props: true
    }
  ]
})
