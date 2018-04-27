<template>
  <div id="player">
    <div id="left-album" class="image-container">
      <img class="album-image" v-bind:src="prevSong.album" v-bind:alt="prevSong.track"/>
    </div>
    <div id="center-album" class="image-container">
      <img class="album-image" v-bind:src="curSong.album" v-bind:alt="curSong.track"/>
    </div>
    <div id="right-album" class="image-container">
      <img class="album-image" v-bind:src="nextSong.album" v-bind:alt="nextSong.track"/>
    </div>
    <PlayerControl/>
  </div>
</template>

<script>
  import PlayerControl from './playerControl';
  export default {
    name:"playerView",
    props:['prevSong', 'curSong', 'nextSong', 'playerMethods'],
    components: {
      PlayerControl
    },
    data () {
      return {
        leftAlbum:'',
        leftAlbumTrack:''
      }
    }
  }
</script>

<style scoped>
  #player {
    width: 100%;
    background-color: #000;
  }

  #left-album {
    float:left;
  }

  #right-album {
    float:right;
  }

  #center-album {
  }

  .image-container {
    display:inline-block;
    width: 33%;
    padding: 0px;
    margin: 0px;
  }

  .album-image {
    padding: 0px;
    margin: 0px;
  }
</style>