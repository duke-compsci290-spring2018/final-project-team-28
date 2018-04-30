<template>
  <div class="hello container-fluid">
    <h1>{{ msg }}</h1>
    <div class="jumbotron sq-jumbotron text-left">
      <h3 class="display-4">Years' Best</h3>
      <p class="lead">Choose from any of the following years to get a taste of what was popular during the time. The songs chosen are from
        the Billboard Hot 100 for each respective year. You can see how long a song stays at the top or see how quickly tastes
        can change!</p>
      <hr class="my-4">
      <yearselector/>
    </div>
    <div class="row sq-jumbo-row justify-content-between mt-5">
      <div class="col-6 pl-0">
        <div class="text-left jumbotron sq-subtron">
          <h3 class="display-4">Top Choices</h3>
          <p class="lead">We've also created special playlists with certain themes in mind. Maybe it's something up your ally? Maybe it's
            not, but hopefully you might discover something new.</p>
          <div class="public-container text-center">
            <ul class="list-group">
              <li v-for="l in publicLists" v-on:click="play(l)" class="list-group-item mr-0 ml-0 sq-li-link">
                <span>{{l.name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-6 pr-0">
        <div>
          <div class="text-left jumbotron sq-subtron">
            <h3 class="display-4">You!</h3>
            <p class="lead">Hopefully something fits your taste from looking around. Maybe you have a list of what you like. If you create
              an account you can make your own custom playlists to listen to and to share.</p>
            <div class="row-fluid text-center mt-5">
              <button class="btn btn-success">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import yearselector from "./yearselector";
var firebase = require('firebase');

var db = firebase.app().database();
var publicRef = db.ref('adminplaylists');

export default {
  name: 'HelloWorld',
  components: {
    yearselector
  },
  firebase: {
    publicLists: publicRef
  },
  data() {
    return {
      msg: 'Welcome 2 sonquest'
    }
  },
  methods: {
    play(l) {
      this.$router.push({
        name: 'publicPlaylist',
        params: {
          username: 'Public',
          listIndex: l['.key'],
          playlist: l.name
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sq-li-link {
  color: #008c1d;
  cursor: pointer;
}

.public-container {
  height: 200px;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.sq-subtron {
  border-radius: 15px;
}

.sq-jumbotron {
  width: 70%;
  margin: 15px 15% 15px 15%;
  border-radius: 15px;
}

.sq-jumbo-row {
  width: 70%;
  margin: 15px 15% 15px 15%;
}

h1,
h2 {
  font-weight: normal;
  font-size: 80px;
  margin: 50px 0px 50px 0px;
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
