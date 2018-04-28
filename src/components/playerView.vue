<template>
  <div id="player" class= "container-fluid">
    <div class="row">
      <div class="col-4 low-opacity pl-0 pr-0">
        <img class="img-fluid" v-bind:src="prevSong.album" v-bind:alt="prevSong.track"/>
      </div>
      <div class="col-4 pl-0 pr-0">
        <img class="img-fluid mh-50" v-bind:src="curSong.album" v-bind:alt="curSong.track"/>
      </div>
      <div class="col-4 low-opacity pl-0 pr-0">
        <img class="img-fluid" v-bind:src="nextSong.album" v-bind:alt="nextSong.track"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"playerView",
    props:['prevSong', 'curSong', 'nextSong'],
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

  .low-opacity {
    opacity: .3;
  }
</style>