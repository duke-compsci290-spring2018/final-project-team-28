<template>
  <div id="player">
    <div>
      <h2>{{curSong}}</h2>
      <h3>By: {{curArtist}}</h3>
      <h4>Week: {{curWeek}}</h4>
    </div>
    <div>
      <button id="button-prev" v-on:click="controls.back()"></button>
      <button id="button-play" v-on:click="controls.resume()" v-bind:class="{hide:isPlaying}"></button>
      <button id="button-pause" v-on:click="controls.pause()" v-bind:class="{hide:!isPlaying}"></button>
      <button id="button-next" v-on:click="controls.forward()"></button>
    </div>
  </div>
</template>

<script>
  export default {
    name:"PlayerControl",
    props:['controls','isPlaying','curWeek','curSong','curArtist'],
    methods: {
    }
  }
</script>

<style scoped>
.hide {
  display:none;
}

#player {
  background-color: #000;
}

h1 {
  padding: 0px;
  margin: 0px;
}

h2 {
  padding: 0px;
  margin: 0px;
}

#button-prev {
  background-image:url(../assets/left-arrow.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 40px;
  width: 40px;
}

#button-play {
  background-image:url(../assets/play.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 60px;
  width: 60px;
}

#button-pause {
  background-image:url(../assets/pause.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 60px;
  width: 60px;
}

#button-next {
  background-image:url(../assets/right-arrow.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 40px;
  width: 40px;
}

</style>