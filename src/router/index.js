import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import yearViz from '@/components/yearViz'
import userPage from '@/components/userPage'
import playlistViz from '@/components/playlistViz'

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
    },
    {
      path: '/custom/:username/:listIndex/:playlist',
      name: 'userPlaylist',
      component: playlistViz,
      props: true
    },
    {
      path: '/public/:listIndex/:playlist',
      name: 'publicPlaylist',
      component: playlistViz,
      props: true
    }
  ]
})
