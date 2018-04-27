<template>
  <div class="yearViz">
    <h1>yearViz</h1>
    <div id="album-art"></div>
    {{songRanks}}
    <button @click="drawPlot">test</button>-->
    <button @click="manageTimer">play</button>
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
      curYear: 1965,
      isPlaying: true,
      lastCheckOrAction: 0,
    }
  },

  firebase: {
    weeks: yearRef
  },

  created(){
    this.manageTimer();
  } ,

  computed: {
    songRanks: function () {
      console.log(this.weeks);
      var songs = [];
      this.weeks.forEach(function(elem){
        songs.push(elem);
        elem['.value'].forEach(function(element){
          if(!(element.mp3 || element.img)) {
            const axios = require('axios')
            axios.get('http://localhost:3000/track/'+element.artist+'/'+element.track)
              .then(response => {
                //var img = response.data.img ? response.data.img : 'https://upload.wikimedia.org/wikipedia/commons/f/f0/CD_disc4.png';
                if(!img){
                  console.log(element.artist,element.track);
                }
                yearRef.child(elem['.key']).child(element.rank).update({
                  'img': img,
                  'mp3': response.data.mp3
                });
              })
              .catch(err => {
                console.error(err);
              });            
          }
        });

      });
      console.log('hello?')
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
      this.weeks(function(elem){
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
    play () { 
      for(var i = 1; i<=5; i++){
        if(this.weeks[this.curWeek]['.value'][i].mp3){
          var audio = new Audio(this.weeks[this.curWeek]['.value'][i].mp3);
          document.getElementById('album-art').innnerHTML="<img src='"+this.weeks[this.curWeek]+"'>";
          audio.play();
          this.lastCheckOrAction = Math.floor(Date.now()/1000);
          break;
        }
      }
    },

    manageTimer() {
      var that = this;
      setInterval(function() {
        console.log('playing week',that.curWeek);
        that.play();
        that.curWeek+=1;
      },15000);
      /*var that = this;
      setInterval(function() {
        if(that.lastCheckOrAction - Math.floor(Date.now()/1000) > 15){
          that.lastCheckOrAction += 15;
          that.curWeek += 1;
          that.play();
        }
      }, 1000);*/
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
