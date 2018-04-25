<template>
  <div class="yearViz">
    <h1>yearViz</h1>
    {{getPlottable}}
    <button @click="drawPlot">test</button>
    <div class="graph"></div>
    <!--<svg width="960" height="500"></svg>-->
  </div>
</template>

<script>
var billboard = require('billboard-top-100').getChart;
import Vue from 'vue'
var d3 = require('d3')
var VueFire = require('vuefire')
var firebase = require('firebase')
var request = require('request')
var payload = 'd556205db80d40ceae86e67253b69898'+':'+'7a98e8d42f0944ecb2aef2d72dc53745';
var encodedPayload = new Buffer(payload).toString('base64');

var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    "Authorization": 'Basic ' + encodedPayload,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  form: {
    grant_type: "client_credentials"
  },
  json: true
};
console.log(authOptions);

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(response);
      console.log(body);
    });
  }
});

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
        console.log(elem)
      });
      //console.log('song ranks',songs);
      return songs;
    },
    allSongs: function () {
      var songs = new Set();
      this.weeks.forEach(function(elem){
        elem['.value'].forEach(function(element){
          songs.add(element.track);
        });
      });
      return songs;
    },

    weeksInYear: function () {
      var weeks = [];
      this.songRanks.forEach(function(elem){
        weeks.push(elem['.key']);
      });
      return weeks;
    },

    getPlottable: function () {
      var sRanks = this.songRanks;
      var aSongs = this.allSongs;
      var allCoords = [];
      aSongs.forEach(function(elem){
        var songPlot = {};
        songPlot['track']=elem;
        sRanks.forEach(function(element){
          element['.value'].forEach(function(top5Song){
            if(top5Song.track == elem){
              //console.log('got one',elem);
              songPlot[element['.key']] = top5Song.rank+1;
            }
          });
        });
        allCoords.push(songPlot);
      });
      var weeks = this.weeksInYear;
      allCoords.forEach(function(elem){
        weeks.forEach(function(element){
          if(!elem[element]){
            elem[element]=100;
          }
        });
      });
      //console.log(allCoords);
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/users/jmperezperez',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function(error, response, body) {
          console.log(body);
        });
      }
    });
      return allCoords;
    }
  },
  methods: {
    drawPlot () {
      //ATTACH TO LIFECYCLE HOOK LATER
      var svg = d3.select("svg");
      var margin = {top: 20, right: 80, bottom: 30, left: 50};
      var width = svg.attr("width") - margin.left - margin.right;
      var height = svg.attr("height") - margin.top - margin.bottom;
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parseTime = d3.timeParse('%Y-%m-%d');

      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var z = d3.scaleOrdinal(d3.schemeCategory20c);

      var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.rank); });
    },
    postData() {
      return fetch(url, {

      })
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
