<template>
  <div class="yearViz">
    <h1>yearViz</h1>
    {{songRanks}}
  </div>
</template>

<script>
var billboard = require('billboard-top-100').getChart;
import Vue from 'vue'
var VueFire = require('vuefire')
var firebase = require('firebase')
var config = {
  apiKey: "AIzaSyDSRaDpwgpKA6QPsGLlpi4jc5F0t2Cglz0",
  authDomain: "sonquest-3379c.firebaseapp.com",
  databaseURL: "https://sonquest-3379c.firebaseio.com",
  projectId: "sonquest-3379c",
  storageBucket: "sonquest-3379c.appspot.com",
  messagingSenderId: "228676657274"
};
// global access to initialized app database
var db = firebase.initializeApp(config).database();
var storageRef = firebase.storage().ref();
// global reference to remote data
var yearRef = db.ref('1965');
// connect Firebase to Vue
Vue.use(VueFire);
export default {
  name: 'yearViz',
  data () {
    return {
      msg: 'yearViz',
      curWeek: 1,
      curYear: 1965
    }
  },

  firebase: {
    weeks: yearRef
  },

  computed: {
    songRanks: function () {
      var songs = [];
      this.weeks.forEach(function(elem){
        songs.push(elem);
      });
      return songs;
    },
    allSongs: function () {
      var songs = new Set();
      this.weeks.forEach(function(elem){
        elem['.value'].forEach(function(element){
          songs.add(element.track);
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
