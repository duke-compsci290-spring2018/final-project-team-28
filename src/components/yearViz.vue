<template>
  <div class="yearViz">
    <h1 id="title">Top Hits of {{year}}</h1>
    <playerView v-bind:prevSong="lastTrack" v-bind:curSong="currentTrack" v-bind:nextSong="nextTrack"></playerView>
    <playerControl v-bind:controls="playerControls" v-bind:isPlaying="isPlaying" v-bind:curWeek="curWeekDate" v-bind:curSong="curTrackName"
      v-bind:curArtist="curArtistName"></playerControl>
    <div>
      <!--{{songRanks}}-->
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
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalID);
    // document.removeEventListener('scroll', this.handleScroll);
    if (this.curAudio) {
      this.curAudio.pause();
      this.curAudio = null;
    }
    if (document.getElementsByTagName('svg')[0]) {
      document.getElementsByTagName('svg')[0].remove();
    }
    next();
  },
  data() {
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
      vizParams: {

      },
      playerControls: {
        back: () => {
          clearInterval(this.intervalID);
          this.curWeek--;
          if (this.curWeek < 0) {
            this.curWeek = 0;
          }
          this.curTrack = '';
          this.play();
          this.intervalID = setInterval(() => {
            this.step();
          }, 15000)
        },
        forward: () => {
          clearInterval(this.intervalID);
          this.curWeek++;
          if (this.curWeek >= this.weeks.length) {
            this.curWeek = this.weeks.length - 1;
          }
          this.curTrack = '';
          this.play();
          this.intervalID = setInterval(() => {
            this.step();
          }, 15000)
        },
        pause: () => {
          this.curAudio.pause();
          clearInterval(this.intervalID);
          this.remaining = new Date() - this.startTime;
          this.isPlaying = false;
        },
        resume: () => {
          this.curAudio.play();
          this.intervalID = setInterval(() => {
            this.step();
          }, 15000);
          this.isPlaying = true;
        }
      }
    }
  },

  /*firebase: {
    weeks: yearRef
  },*/

  created() {
    // document.addEventListener('scroll', this.handleScroll);
    this.$bindAsArray('weeks', db.ref(this.year.toString()))
    this.startLifeCycle();
  },

  computed: {
    songRanks: function () {
      var songs = [];
      var that = this;
      this.weeks.forEach(function (elem) {
        songs.push(elem);
        elem['.value'].forEach(function (element) {
          if (!(element.mp3 || element.img)) {
            const axios = require('axios')
            axios.get('http://localhost:3000/track/' + element.artist + '/' + element.track)
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
      this.weeks.forEach(function (elem) {
        elem['.value'].forEach(function (element) {
          songs.add(element.track);
        });
      });

      return songs;
    },

    weeksInYear: function () {
      var weeks = [];
      this.weeks.forEach(function (elem) {
        weeks.push(elem['.key']);
      });
      return weeks;
    },

    getPlottable: function () {
      //var colors = ["#8b8b7a","#9fb6cd","#ffa500","#ffa07a","#292929","#ff7f00","#eeee00","#4169e1","#c1ffc1","#b8860b","#cdc9c9","#bc8f8f","#c1cdcd","#ee9a49","#4682b4","#ee3a8c","#ee00ee","#9acd32","#7f7f7f","#ff4040","#c4c4c4","#7b68ee","#7a8b8b","#eea9b8","#ff69b4","#54ff9f","#483d8b","#b5b5b5","#00cdcd","#ededed","#6e8b3d","#595959","#9a32cd","#66cd00","#f5fffa","#6e6e6e","#0000ee","#68838b","#7a67ee","#ababab","#4f4f4f","#4a4a4a","#ffb6c1","#cd5555","#e0ffff","#8b5a00","#fff0f5","#1874cd","#6e7b8b","#eed5b7","#20b2aa","#deb887","#a2b5cd","#00ffff","#da70d6","#eed8ae","#b0e2ff","#5c5c5c","#ee8262","#eee8aa","#000000","#eedd82","#050505","#ee7942","#ffe7ba","#8b4500","#fff68f","#ffe4b5","#5d478b","#db7093","#cdc9a5","#d02090","#778899","#969696","#cdc0b0","#8deeee","#ee6a50","#cd8c95","#698b22","#ff8c00","#ffb5c5","#8b2252","#636363","#cd950c","#b9d3ee","#8470ff","#76ee00","#3cb371","#8b3e2f","#5f9ea0","#c1cdc1","#ee4000","#cd9b9b","#9bcd9b","#eeb4b4","#eee0e5","#cdc5bf","#ee82ee","#00cd66","#4eee94","#98f5ff","#cd8162","#ff7f24","#575757","#104e8b","#009acd","#ffe4c4","#d8bfd8","#66cdaa","#5e5e5e","#00b2ee","#00f5ff","#e6e6fa","#551a8b","#ba55d3","#556b2f","#d1d1d1","#8b4513","#e0eee0","#ff00ff","#2e8b57","#98fb98","#8b864e","#cd8500","#36648b","#4f94cd","#363636","#8b7d7b","#7d7d7d","#6c7b8b","#7cfc00","#a52a2a","#e5e5e5","#ee30a7","#97ffff","#8b2500","#eecbad","#8b8378","#d15fee","#ee6aa7","#53868b","#f4a460","#b22222","#ffff00","#c7c7c7","#9f79ee","#8b475d","#add8e6","#eec900","#6ca6cd","#303030","#cdad00","#999999","#87ceff","#b23aee","#8b7d6b","#ffe1ff","#ffefd5","#cdc8b1","#d3d3d3","#191970","#f5f5f5","#8b3a62","#cd853f","#8b7500","#404040","#00ee76","#ee7ae9","#f2f2f2","#4876ff","#daa520","#cd5c5c","#141414","#87ceeb","#0f0f0f","#00ff7f","#8b5a2b","#454545","#8b2323","#fcfcfc","#474747","#d6d6d6","#8b8970","#cd5b45","#cd6839","#b4cdcd","#ee0000","#fa8072","#3a5fcd","#e9967a","#cd6090","#8b3a3a","#8b1a1a","#96cdcd","#ab82ff","#8b0a50","#00ee00","#8b4c39","#bfbfbf","#00fa9a"];
      var cCount = 0;
      var inWeek = false;
      var sRanks = this.songRanks;
      var aSongs = this.allSongs;
      var allCoords = [];
      var formatDate = d3.time.format('%Y-%m-%d');
      aSongs.forEach(function (elem) {
        var songPlot = [];
        sRanks.forEach(function (element) {
          element['.value'].forEach(function (top5Song) {
            if (top5Song.track == elem) {
              songPlot.push({
                'x': formatDate.parse(element['.key']),
                'y': top5Song.rank,
                'pic': top5Song.img,
                'track': elem,
                'artist': top5Song.artist
              }); // color': colors[cCount % 200]});
              inWeek = true;
            }
          });
          if (!inWeek) {
            songPlot.push({
              'x': formatDate.parse(element['.key']),
              'y': 10,
              'pic': '',
              'track': elem,
              'artist': ''
            }); //'color': colors[cCount % 200]});
          }
          inWeek = false;
        });
        allCoords.push(songPlot);
        cCount++;
      });
      return allCoords;
    },

    lastTrack: function () {
      const week = this.curWeek - 1;
      if (week < 0 || this.weeks[week] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.getPlayedSong(week);
      this.drawPlot();
      return {
        img: song.img,
        track: song.track
      }
    },

    currentTrack: function () {
      if (this.weeks[this.curWeek] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.getPlayedSong(this.curWeek);
      return {
        img: song.img,
        track: song.track,
        artist: song.artist,
        mp3: song.mp3,
      }
    },

    nextTrack: function () {
      const week = this.curWeek + 1;
      if (week > this.weeks.len || this.weeks[week] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.getPlayedSong(week);
      this.drawPlot();
      return {
        img: song.img,
        track: song.track
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

    sanitizeArtist(artist) {
      var cleanArtist = artist;
      if (cleanArtist.indexOf('Featuring') != -1) {
        cleanArtist = cleanArtist.substring(0, cleanArtist.indexOf('Featuring'));
      }
      if (cleanArtist.indexOf('&') != -1) {
        cleanArtist = cleanArtist.substring(0, cleanArtist.indexOf('&'));
      }
      if (cleanArtist.indexOf('+') != -1) {
        cleanArtist = cleanArtist.substring(0, cleanArtist.indexOf('+'));
      }
      if (cleanArtist.indexOf(',') != -1) {
        cleanArtist = cleanArtist.substring(0, cleanArtist.indexOf(','));
      }
      cleanArtist.trim();
      return cleanArtist;
    },

    drawPlot() {
      try {
        document.getElementsByTagName('svg')[0].remove();
      } catch (e) {}
      var data = this.getPlottable;
      var margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
      };
      var width = 1060 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;
      var formatDate = d3.time.format('%Y-%m-%d');
      var x = d3.time.scale()
        .domain([formatDate.parse(this.weeksInYear[this.curWeek]), formatDate.parse(this.weeksInYear[this.curWeek + 4])])
        .range([0, width])
      var y = d3.scale.linear()
        .domain([5.9, .4])
        .range([height, 0]);


      var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(4)
        .tickSize(-height)
        //.tickPadding(10)    
        //.tickSubdivide(true)    
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .tickPadding(10)
        .tickSize(-width)
        .tickFormat(d3.format('d'))
        .tickSubdivide(true)
        .orient("left");

      var zoom = d3.behavior.zoom().scaleExtent([1, 1])
        .x(x)
        .on("zoom", zoomed);

      var svg = d3.select("body").append("svg")
        .call(zoom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", 'pad-bot')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", (-margin.left) + 10)
        .attr("x", -height / 2)
        .text('Rank');
      svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        });

      /*svg.selectAll('.line')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#clip)')
        .attr('stroke', function(d){
          return d[0].color;
        })
        .attr('d', line);    */

      var points = svg.selectAll('.dots')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "dots")
      //.attr("clip-path", "url(#clip)");   

      points.selectAll('.dot')
        .data(function (d, index) {
          var a = [];
          d.forEach(function (point, i) {
            a.push({
              'index': index,
              'point': point
            });
          });
          return a;
        })
        .enter()
        //.append('circle')
        .append('image')
        .attr('xlink:href', function (d) {
          return d.point.pic;
        })
        .attr('width', 64)
        .attr('height', 64)
        .on('mouseover', tooltipIn)
        .on('mouseout', tooltipOut)
        //.attr('x', function(d){console.log(d); return x(d.point.x)})
        //.attr('y', function(d){return y(d.point.y)})
        //.attr('class','dot')
        //.attr("r", 2.5)
        //.attr('fill', function(d,i){    
        //    return d.point.color;
        //})  
        .attr("transform", function (d) {
          //console.log(d.point.x);
          return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
        });

      function zoomed() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll('path.line').attr('d', line);

        points.selectAll('image').attr("transform", function (d) {
          return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
        })
      }

      function tooltipIn(d, i) {
        svg.append('text').attr({
            id: 'tooltip-' + i,
            x: function () {
              return x(d.point.x) - 10;
            },
            y: function () {
              return y(d.point.y) - 5;
            },
            fill: '#4682B4'
          })
          //.style('color','#4682B4')
          .text(function () {
            //console.log(d);
            return d.point.artist + ': ' + d.point.track;
          });
      }

      function tooltipOut(d, i) {
        //d3.select('#x'+x(d.point.x)+'-'+y(d.point.y)+'-'+i).remove()
        d3.select('#tooltip-' + i).remove();
        //console.log('#tooltip-'+i);
        //console.log('out',d,i)
      }
    },
    play() {
      for (var i = 1; i <= 5; i++) {
        if (this.weeks[this.curWeek]['.value'][i].mp3) {
          const newTrack = this.weeks[this.curWeek]['.value'][i];
          if (this.curAudio && newTrack.track != this.curTrack) {
            this.curAudio.pause();
          } else if (newTrack.track === this.curTrack) {
            if (Math.round(this.curAudio.currentTime) >= 30) {
              this.curAudio.currentTime = 0;
            }
            this.lastCheckOrAction = Math.floor(Date.now() / 1000);
            break;
          }
          this.curTrack = newTrack.track;
          if (this.curAudio === null) {
            this.curAudio = new Audio(newTrack.mp3);
          } else {
            this.curAudio.src = newTrack.mp3;
            this.curAudio.currentTime = 0;
          }
          this.curAudio.play();
          this.lastCheckOrAction = Math.floor(Date.now() / 1000);
          break;
        }
      }
    },
    manageTimer() {
      this.startTime = new Date();
      this.intervalID = setInterval(() => {
        this.step();
      }, 15000);
    },
    step() {
      if (this.curAudio) {
        this.curWeek++;
        this.drawPlot();
      }
      if (this.curWeek >= this.weeks.length) {
        this.curAudio.pause();
        clearInterval(this.intervalID);
        this.done();
      } else {
        this.play();
      }
    },
    startLifeCycle() {
      if (this.weeks[this.curWeek] === undefined) {
        setTimeout(() => {
          this.startLifeCycle();
        }, 500)
      } else {
        this.step();
        this.manageTimer();
      }
    },
    getPlayedSong(week) {
      var song;
      if (this.weeks[week] === undefined) {
        return {};
      }
      for (var i = 1; i <= 5; i++) {
        if (this.weeks[week]['.value'][i].mp3) {
          song = this.weeks[week]['.value'][i];
          break;
        }
      }
      return song;
    },
    handleScroll() {
      var player = document.getElementById('player');
      if (!this.stickControl) {
        this.playerControlOffset = player.offsetTop;
      }
      if (window.pageYOffset + window.innerHeight >= this.playerControlOffset + player.offsetHeight) {
        this.stickControl = true;
      } else {
        this.stickControl = false;
      }
    },
    done() {
      this.curWeek = 0;
      this.curAudio = null;
      this.curTrack = '';
      this.$router.push({
        name: "HelloWorld"
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  padding-bottom: 250px;
}

#tooltip {
  color: '#4682B4';
}

#title {
  height: 50px;
}

h1,
h2 {
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

.sticky {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 0;
}

.pad-bot {
  padding-bottom: 200px;
}

</style>
