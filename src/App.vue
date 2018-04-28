<template>
  <div id="app">
    <navbar v-bind:currentPlaylist="playlist" v-bind:rightMenu="navbarOptions"/>
    <router-view/>
  </div>
</template>

<script>
import navbar from './components/navbar';
export default {
  name: 'App',
  components: {
    navbar
  },
  data () {
    return {
      playlist: {

      },
      navbarOptions: [
        {
          display:"Sign In",
          onPress: function () {
            console.log("sign in");
          }

        },
        {
          display:"Sign Up",
          onPress: function () {
            console.lgo("sign up");
          }
        }
      ]
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
}
</style>
