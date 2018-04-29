<template>
  <div id="player-view" class= "container-fluid">
    <div class="row">
      <div class="col-4 low-opacity pl-0 pr-0">
        <img class="img-fluid" v-bind:src="prevSong.img" v-bind:alt="prevSong.track"/>
      </div>
      <div class="col-4 pl-0 pr-0">
        <img class="img-fluid mh-50" v-bind:src="curSong.img" v-bind:alt="curSong.track"/>
      </div>
      <div class="col-4 low-opacity pl-0 pr-0">
        <img class="img-fluid" v-bind:src="nextSong.img" v-bind:alt="nextSong.track"/>
      </div>
      <select v-if="userLoggedIn" v-model="chosenPlaylist">
        <option disabled value="">Playlist</option>
        <option v-for ="list in userPlaylists">{{list.name}}</option>
      </select>
      <button id="addButton" @click="addToUserPlaylist">+</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  var firebase = require('firebase');
  var VueFire = require('vuefire');
  var db = firebase.app().database();

  //var storageRef = firebase.storage().ref();
  // global reference to remote data
  var userRef = db.ref('users');

  // connect Firebase to Vue
  Vue.use(VueFire);
  export default {
    name:"playerView",
    props:['prevSong', 'curSong', 'nextSong'],
    data () {
      return {
<<<<<<< HEAD
        leftImg:'',
        leftAlbumTrack:''
=======
        leftAlbum:'',
        leftAlbumTrack:'',
        chosenPlaylist: '',
        curUserPlaylist: [],
        adding: false
      }
    },
    computed: {
      userLoggedIn: function () {
        if(this.$root.$data.user.username){
          this.$bindAsArray('userPlaylists', userRef.child(this.$root.$data.user.username).child('playlists'));
          console.log(this.userPlaylists);
          return true;
        }
        return false; 
      }
    },

    firebase: {
      allUsers: userRef
    },
    methods: {
      addToUserPlaylist() {
        if(!this.userLoggedIn || !this.chosenPlaylist){
          return;
        }
        var playlistNumber = 0;
        for(var i = 0 ; i < this.userPlaylists.length; i++){
          if(this.userPlaylists[i].name == this.chosenPlaylist){
            playlistNumber = i;
          }
        }
        if(this.userPlaylists[playlistNumber].songs){
          var numSongs = this.userPlaylists[playlistNumber].songs.length
          console.log('playlist number',playlistNumber);
          console.log('cursong', this.curSong);
          console.log('numsongs', numSongs);
          userRef.child(this.$root.$data.user.username).child('playlists').child(playlistNumber).child('songs').child(numSongs).set(this.curSong);   
        }
        else{
          userRef.child(this.$root.$data.user.username).child('playlists').child(playlistNumber).child('songs').child(0).set(this.curSong);
        }
        this.chosenPlaylist = '';
>>>>>>> 1244725c08fec5ea707951e3fe7bc23966b724bc
      }
    }
  }
</script>

<style scoped>
  #player-view {
    width: 100%;
    background-color: #000;
  }

  .low-opacity {
    opacity: .3;
  }
</style>