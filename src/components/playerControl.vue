<template>
  <div id="player" class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-5 text-left p-2">
        <h3 v-if="curSong">{{curSong}}</h3>
        <h4 v-if="curArtist">By: {{curArtist}}</h4>
        <h5 v-if="curWeek" class="mb-0">Week: {{curWeek}}</h5>
      </div>
      <div class="col-2 pt-4">
        <ul class="pl-0 mb-0">
          <li class="d-inline-block">
            <button id="button-prev" v-on:click="controls.back()"></button>
          </li>
          <li class="d-inline-block">
            <button id="button-play" v-on:click="controls.resume()" v-bind:class="{hide:isPlaying}"></button>
            <button id="button-pause" v-on:click="controls.pause()" v-bind:class="{hide:!isPlaying}"></button>
          </li>
          <li class="d-inline-block">
            <button id="button-next" v-on:click="controls.forward()"></button>
          </li>
        </ul>
      </div>
      <div class="col-5">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PlayerControl",
    props: ['controls', 'isPlaying', 'curWeek', 'curSong', 'curArtist'],
    methods: {}
  }
</script>

<style scoped>
.hide {
  display: none;
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
  background-image: url(../assets/left-arrow.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 45px;
  width: 45px;
}

#button-play {
  background-image: url(../assets/play.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 70px;
  width: 70px;
}

#button-pause {
  background-image: url(../assets/pause.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 70px;
  width: 70px;
}

#button-next {
  background-image: url(../assets/right-arrow.png);
  background-position: center;
  background-size: contain;
  border-radius: 50%;
  height: 45px;
  width: 45px;
}
</style>