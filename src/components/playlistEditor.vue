<template>
<div>
  <div class="sonquest-modal container-fluid song-container">
    <div class="sonquest-modal-content w-50">
      <h2 class="pt-3 pb-3">{{name}}</h2>
      <h4 class="pb-3">{{status}}</h4>
      <div class="playlist-list container">
        <ul>
          <li class="row">
            <span class="col-8">
              <input class="text-center" type="text" placeholder="Song" v-model="searchSong"/>
              <input class="text-center" type="text" placeholder="Artist" v-model="searchArtist"/>
            </span>
            <span class="col-4">
              <button v-on:click="addSong" class="btn btn-default">&plus;</button>
            </span>
          </li>
          <li v-for="(s, index) in songs" class="row">
            <span class="col-8">
              <img class="img-fluid album-pic" v-bind:src="s.img" v-bind:alt="s.track"/>
              <label class="text-center">{{s.track}} by: {{s.artist}}</label>
            </span>
            <span class="col-4">
              <div class="row">
                <button v-on:click="deleteSong(s)" class="btn btn-default col-2 mr-3">&times;</button>
                <div class="d-inline-block col-2">
                  <button v-if="index!=0" v-on:click="moveUp(s)" class="btn btn-default d-block arrow-btn">&uarr;</button>
                  <button v-if="index!=songs.length-1" v-on:click="moveDown(s)" class="btn btn-default d-block arrow-btn">&darr;</button>
                </div>
              </div>
            </span>
          </li>
        </ul>
      </div>
      <button v-on:click="closeModal()">&times;</button>
    </div>
  </div>
</div>
</template>

<script>
var axios = require('axios');
export default {
  name: 'playlistEditor',
  props: ['songRef', 'name'],
  created() {
    this.$bindAsArray('songs', this.songRef);
  },
  data() {
    return {
      searchSong: '',
      searchArtist: '',
      status: 'Enter a Song and Artist to add to the playlist!'
    }
  },
  methods: {
    closeModal: function () {
      this.$emit('doneEdit', true);
    },
    addSong: function () {
      this.status = 'Enter a Song and Artist to add to the playlist!';
      if (!this.searchSong) {
        this.status = 'Invalid Song Name';
      } else if (!this.searchArtist) {
        this.status = 'Invalid Artist Name';
      } else {
        axios.get('http://localhost:3000/track/' + this.searchArtist + '/' + this.searchSong)
          .then(response => {
            if(response.data.mp3) {
              this.songRef.child(this.songs.length).set({
                track:this.searchSong,
                artist:this.searchArtist,
                img:response.data.img,
                mp3:response.data.mp3
              })
            } else {
              this.status = 'Unable to add song';
            }
            this.searchArtist = '';
            this.searchSong = '';
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    deleteSong: function (s) {

    },
    moveUp: function (s) {

    },
    moveDown: function (s) {

    }
  }
}


  
</script>

<style scope>
.album-pic {
  height: 80px;
}

.arrow-btn {
  height: 20px;
  padding: 0px 15px 0px 15px;
}

.song-container ul {
  list-style-type: none;
  margin: 0px;
  padding: 0px;
}

.song-container li {
  border-style: solid;
  border-width: 2px 2px 2px 2px;
  padding: 5px 0px 5px 0px;
  width: 100%;
  margin: 0;
}

.sq-alert {
  animation-name: alertAnimation;
  animation-duration: 1s;
  background-color: #ffcccc;
  color: #ff7777;
}

.sonquest-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
  padding-top: 200px;
}

.sonquest-modal-content {
  background-color: #fff;
  border-radius: 15px;
  padding: 50px;
  margin: 5px auto;
}

.sonquest-button-container {
  background-color: #ccc;
}

@keyframes alertAnimation {
  0% {
    background-color: #fff;
    color: #000;
  }
  30% {
    background-color: #fc7676;
    color: #ff7777;
  }
  60% {
    background-color: #ffcccc;
    color: #ff7777;
  }
}

</style>