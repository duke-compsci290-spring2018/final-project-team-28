<template>
  <div id="app">
    <yearselector/>
    <router-view/>
  </div>
</template>

<script>
import yearselector from './components/yearselector'
export default {
  name: 'App',
  components: {
    yearselector
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
  margin-top: 60px;
}
</style>
