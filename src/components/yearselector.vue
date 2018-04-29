<template>
  <div class="years text-center">
    <span v-for="yr in yearList">
      <router-link tag="a" class="year-link" :to='"/"+yr'>{{yr}} </router-link> 
    </span>
  </div>
</template>

<script>
export default {
  name: 'yearselector',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  computed: {
    yearList: function () {
      var year = (new Date ()).getFullYear();
      var yearRange = [];
      for(var i = 1965; i <= year; i++){
        yearRange.push(i);
      }
      return yearRange; 

    } 
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.year-link:link,.year-link:visited {
  color: #008c1d;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
