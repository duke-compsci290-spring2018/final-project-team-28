<template>
  <div>
    <div>
      <playlistEditor v-if="songlistRef!=null" v-on:doneEdit="doneEditting()" v-bind:songRef="songlistRef" v-bind:name="edittingPlaylist"></playlistEditor>
      <h1 class="pt-5 pb-5">Hello {{firstname}}</h1>
      <playlistManager v-bind:playlistRef="playlistRef" v-bind:user="username" v-on:editPlaylist="editPlaylist($event)"></playlistManager>
    </div>
    <div v-if="$root.$data.user.admin" class="mt-5">
      <userManager v-bind:admin="username"></userManager>
      I am an admin
    </div>
  </div>
</template>


<script>
import playlistEditor from './playlistEditor';
import playlistManager from './playlistManager';
import userManager from './userManager';
var firebase = require('firebase')

var db = firebase.app().database();

export default {
  name: 'userPage',
  props: ['username'],
  components: {
    playlistEditor: playlistEditor,
    playlistManager: playlistManager,
    userManager: userManager
  },
  created() {},
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (vm.$root.$data.user.username === to.params.username) {
        return;
      } else {
        vm.$router.push({
          name: 'HelloWorld'
        });
      }
    });
  },
  data() {
    return {
      firstname: this.$root.$data.user.firstname,
      lastname: this.$root.$data.user.lastname,
      admin: this.$root.$data.user.admin,
      playlistRef: db.ref('users/' + this.username + '/playlists'),
      status: '',
      songlistRef: null,
      edittingPlaylist: ''
    }
  },
  methods: {
    editPlaylist(l) {
      this.edittingPlaylist = l.name;
      this.songlistRef = db.ref('users/' + this.username + '/playlists/' + l['.key'] + '/songs');
    },
    doneEditting() {
      this.songlistRef = null;
      this.edittingPlaylist = '';
    },
  }
}



</script>

<style scoped>

</style>