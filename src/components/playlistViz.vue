<template>
  <div class="yearViz">
    <h1 id="title">{{playlist}}</h1>
    <playerView v-bind:prevSong="lastTrack" v-bind:curSong="currentTrack" v-bind:nextSong="nextTrack"></playerView>
    <playerControl v-bind:controls="playerControls" v-bind:isPlaying="isPlaying" v-bind:curSong="curTrackName" v-bind:curArtist="curArtistName"></playerControl>
    <div>
    </div>
  </div>
</template>

<script>
import playerView from './playerView';
import PlayerControl from './playerControl';
var firebase = require('firebase')

var db = firebase.app().database();
export default {
  name: 'playlistViz',
  props: ['username', 'listIndex', 'playlist'],
  components: {
    playerView,
    PlayerControl
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalID);
    if (this.curAudio) {
      this.curAudio.pause();
      this.curAudio = null;
    }
    next();
  },
  created() {
    if (this.username === 'Public') {
      this.$bindAsArray('songs', db.ref('adminplaylists/' + this.listIndex + '/songs'))
    } else {
      this.$bindAsArray('songs', db.ref('users/' + this.username + '/playlists/' + this.listIndex + '/songs'));
    }
    this.startLifeCycle();
  },
  data() {
    return {
      songIndex: 0,
      curAudio: null,
      curTrack: '',
      isPlaying: true,
      intevalID: null,
      startTime: null,
      remaining: 15,
      songRef: this.username === 'Public' ? db.ref('adminplaylists' / +this.listIndex + '/songs') : db.ref('users/' + this.username + '/playlists/' + this.key + '/songs'),
      playerControls: {
        back: () => {
          clearInterval(this.intervalID);
          this.songIndex--;
          if (this.songIndex < 0) {
            this.songIndex = 0;
          }
          this.curTrack = '';
          this.play();
          this.intervalID = setInterval(() => {
            this.step();
          }, 15000)
        },
        forward: () => {
          clearInterval(this.intervalID);
          this.songIndex++;
          if (this.songIndex >= this.songs.length) {
            this.songIndex = this.songs.length - 1;
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
  computed: {
    lastTrack: function () {
      const i = this.songIndex - 1;
      if (i < 0 || this.songs[i] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.songs[i];
      return {
        img: song.img,
        track: song.track
      }
    },
    currentTrack: function () {
      if (this.songs[this.songIndex] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.songs[this.songIndex];
      return {
        img: song.img,
        track: song.track
      }
    },
    nextTrack: function () {
      const i = this.songIndex + 1;
      if (i > this.songs.length || this.songs[i] === undefined) {
        return {
          img: '',
          track: ''
        };
      }
      var song = this.songs[i];
      return {
        img: song.img,
        track: song.track
      }
    },
    curTrackName: function () {
      if (this.songs[this.songIndex]) {
        return this.songs[this.songIndex].track;
      }
      return '';
    },
    curArtistName: function () {
      if (this.songs[this.songIndex]) {
        return this.songs[this.songIndex].artist;
      }
      return '';
    }
  },
  methods: {
    play() {
      const newTrack = this.songs[this.songIndex];
      if (this.curAudio && newTrack.track != this.curTrack) {
        this.curAudio.pause();
      } else if (newTrack.track === this.curTrack) {
        if (Math.round(this.curAudio.currentTime) >= 30) {
          this.curAudio.currentTime = 0;
        }
      }
      this.curTrack = newTrack.track;
      if (this.curAudio === null) {
        this.curAudio = new Audio(newTrack.mp3);
      } else {
        this.curAudio.src = newTrack.mp3;
        this.curAudio.currentTime = 0;
      }
      this.curAudio.play();
    },
    manageTimer() {
      this.startTime = new Date();
      this.intervalID = setInterval(() => {
        this.step();
      }, 15000);
    },
    step() {
      if (this.curAudio) {
        this.songIndex++;
      }
      if (this.songIndex >= this.songs.length) {
        this.curAudio.pause();
        clearInterval(this.intervalID);
        this.done();
      } else {
        this.play();
      }
    },
    startLifeCycle() {
      if (this.songs[this.songIndex] === undefined) {
        setTimeout(() => {
          this.startLifeCycle();
        }, 500)
      } else {
        this.step();
        this.manageTimer();
      }
    },
    done() {
      this.songIndex = 0;
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
  padding-bottom: 120px;
}
</style>
