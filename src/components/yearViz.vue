<template>
  <div class="yearViz">
    <h1 id="title">Top Hits of {{year}}</h1>
    <playerView v-bind:prevSong="lastTrack" v-bind:curSong="currentTrack" v-bind:nextSong="nextTrack"></playerView>
    <playerControl v-bind:class="{'sticky':stickControl}" v-bind:controls="playerControls" v-bind:isPlaying="isPlaying" v-bind:curWeek="curWeekDate" v-bind:curSong="curTrackName" v-bind:curArtist="curArtistName"></playerControl>
    <div v-bind:class="{'pad-bot':stickControl}">
      {{songRanks}}
      <button @click="drawPlot">test</button>-->
      <button @click="manageTimer">play</button>
      <div class="graph"></div>
      <!--<svg width="960" height="500"></svg>-->
    </div>
  </div>
</template>

<script>
import playerView from './playerView';
import PlayerControl from './playerControl';
var billboard = require('billboard-top-100').getChart;
import Vue from 'vue'
var d3 = require('d3')
var VueFire = require('vuefire')
var firebase = require('firebase')

// global access to initialized app database
var db = firebase.app().database();
var storageRef = firebase.storage().ref();
// global reference to remote data
//var yearRef = db.ref('1966');

// connect Firebase to Vue
Vue.use(VueFire);
export default {
  name: 'yearViz',
  props: ['year'],
  components: {
    playerView,
    PlayerControl
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.intervalID);
    document.removeEventListener('scroll', this.handleScroll);
    this.curAudio.pause();
    next();
  },
  data () {
    return {
      msg: 'yearViz',
      curWeek: 0,
      curYear: 1965,
      curAudio: null,
      curTrack: '',
      isPlaying: true,
      lastCheckOrAction: 0,
      intevalID: null,
      startTime: null,
      stickControl: false,
      remaining: 15,
      playerControlOffset: 0,
      playerControls:{
        back: ()=>{
          clearInterval(this.intervalID);
          this.curWeek--;
          if(this.curWeek < 0) {
            this.curWeek = 0;
          }
          this.curTrack = '';
          this.play();
          this.intervalID = setInterval(()=>{
            this.step();
          },15000)
        },
        forward: ()=>{
          clearInterval(this.intervalID);
          this.curWeek++;
          if(this.curWeek >= this.weeks.len) {
            this.curWeek = this.weeks.len - 1;
          }
          this.curTrack = '';
          this.play();
          this.intervalID = setInterval(()=>{
            this.step();
          },15000)
        },
        pause: ()=>{
          this.curAudio.pause();
          clearInterval(this.intervalID);
          this.remaining = new Date() - this.startTime;
          this.isPlaying = false;
        },
        resume: ()=>{
          this.curAudio.play();
          this.intervalID = setInterval(()=>{
            this.step();
          },15000);
          this.isPlaying = true;
        }
      }
    }
  },

  /*firebase: {
    weeks: yearRef
  },*/

  created(){
    document.addEventListener('scroll', this.handleScroll);
    this.$bindAsArray('weeks',db.ref(this.year.toString()))
    this.startLifeCycle();
  },

  computed: {
    songRanks: function () {
      // console.log(this.weeks[0]);
      var songs = [];
      var that = this;
      this.weeks.forEach(function(elem){
        songs.push(elem);
        elem['.value'].forEach(function(element){
          //console.log(that.sanitizeArtist(element.artist));
          if(!(element.mp3 || element.img)) {
            const axios = require('axios')
            axios.get('http://localhost:3000/track/'+element.artist+'/'+element.track)
              .then(response => {
                var img = response.data.img ? response.data.img : 'https://upload.wikimedia.org/wikipedia/commons/f/f0/CD_disc4.png';
                var yearRef = db.ref(that.year.toString());
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
    },

    lastTrack: function () {
      const week = this.curWeek - 1;
      if (week < 0 || this.weeks[week]===undefined) {
        return {
          album:'',
          track:''
        };
      }
      var song = this.getPlayedSong(week);
      return {
        album:song.img,
        track:song.track
      }
    },

    currentTrack: function () {
      if(this.weeks[this.curWeek]===undefined) {
        return {
          album:'',
          track:''};
      }
      var song = this.getPlayedSong(this.curWeek);
      return {
        album:song.img,
        track:song.track
      }
    },

    nextTrack: function () {
      const week = this.curWeek + 1;
      if (week > this.weeks.len || this.weeks[week]===undefined) {
        return {
          album:'',
          track:''
        };
      }
      var song = this.getPlayedSong(week);
      return {
        album:song.img,
        track:song.track
      }
    },

    curWeekDate: function () {
      return this.getPlayedSong(this.curWeek).week;
    },

    curTrackName: function () {
      return this.getPlayedSong(this.curWeek).track;
    },

    curArtistName: function () {
      return this.getPlayedSong(this.curWeek).artist;
    }
  },
  methods: {

    sanitizeArtist (artist) {
      var cleanArtist = artist;
      if(cleanArtist.indexOf('Featuring') != -1){
        cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('Featuring'));
      }
      if(cleanArtist.indexOf('&') != -1){
        cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('&'));
      }
      if(cleanArtist.indexOf('+') != -1){
        cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('+'));
      }
      if(cleanArtist.indexOf(',') != -1){
        cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf(','));
      }
      cleanArtist.trim();
      return cleanArtist;
    },

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
          const newTrack = this.weeks[this.curWeek]['.value'][i];
          if(this.curAudio && newTrack.track != this.curTrack) {
            this.curAudio.pause();
          }
          else if (newTrack.track === this.curTrack) {
            if (Math.round(this.curAudio.currentTime)>=30) {
              this.curAudio.currentTime = 0;
            }
            this.lastCheckOrAction = Math.floor(Date.now()/1000);
            break;
          }
          this.curTrack = newTrack.track;
          if(this.curAudio===null) {
            this.curAudio = new Audio(newTrack.mp3);
          } else {
            this.curAudio.src = newTrack.mp3;
            this.curAudio.currentTime = 0;
          }
          this.curAudio.play();
          this.lastCheckOrAction = Math.floor(Date.now()/1000);
          break;
        }
      }
    },

    manageTimer() {
      this.startTime = new Date();
      this.intervalID = setInterval(()=>{
        this.step();
      },15000);
    },

    step() {
      if(this.curAudio) {
        this.curWeek++;
      }
      if (this.curWeek >= this.weeks.len) {
        this.done();
        this.curAudio.pause;
        clearInterval(this.intervalID);
        return;
      }
      console.log('playing week',this.curWeek,'of year',this.year);
      this.play();
    },

    startLifeCycle() {
      if (this.weeks[this.curWeek]===undefined) {
        setTimeout(()=>{
          this.startLifeCycle();
        },500)
      }
      else {
        this.step();
        this.manageTimer();
      }
    },

    getPlayedSong(week) {
      var song;
      if (this.weeks[week]===undefined) {
        return {};
      }
      for(var i = 1; i<=5; i++){
        if(this.weeks[week]['.value'][i].mp3){
          song = this.weeks[week]['.value'][i];
          break;
        }
      }
      return song;
    },

    handleScroll () {
      var player = document.getElementById('player');
      if (!this.stickControl) {
        this.playerControlOffset = player.offsetTop;
      }
      if(window.pageYOffset + window.innerHeight >= this.playerControlOffset + player.offsetHeight) {
        this.stickControl = true;
      }
      else {
        this.stickControl = false;
      }
    },

    done () {
      //TODO something
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#title {
  height:50px;
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
.sticky{
  position:fixed;
  bottom: 0;
  width:100%;
  z-index: 0;
}
.pad-bot {
  padding-bottom:120px;
}
</style>
