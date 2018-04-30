<template>
  <div>
    <div>
      <playlistEditor v-if="songlistRef!=null" v-on:doneEdit="doneEditting()" v-bind:songRef="songlistRef" v-bind:name="edittingPlaylist"></playlistEditor>
      <h1 class="pt-5 pb-5">Hello {{firstname}}</h1>
      <playlistManager v-bind:playlistRef="playlistRef" v-bind:user="username" v-on:editPlaylist="editPlaylist($event)" v-bind:play="playUserPlaylist"
        containerColor="container-green"></playlistManager>
    </div>
    <div v-if="$root.$data.user.admin" class="mt-5 mb-5">
      <playlistManager v-bind:playlistRef="adminRef" user="Public" v-on:editPlaylist="editAdminPlaylist($event)" v-bind:play="playPublicPlaylist"
        containerColor="container-blue"></playlistManager>
      <userManager class="mt-5" v-bind:admin="username"></userManager>
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
      adminRef: db.ref('adminplaylists'),
      status: '',
      songlistRef: null,
      edittingPlaylist: '',
      playUserPlaylist(l, u) {
        this.$router.push({
          name: 'userPlaylist',
          params: {
            username: u,
            listIndex: l['.key'],
            playlist: l.name
          }
        });
      },
      playPublicPlaylist(l) {
        this.$router.push({
          name: 'publicPlaylist',
          params: {
            username: 'Public',
            listIndex: l['.key'],
            playlist: l.name
          }
        });
      }
    }
  },
  methods: {
    editPlaylist(l) {
      this.edittingPlaylist = l.name;
      this.songlistRef = db.ref('users/' + this.username + '/playlists/' + l['.key'] + '/songs');
    },
    editAdminPlaylist(l) {
      this.edittingPlaylist = l.name;
      this.songlistRef = db.ref('adminplaylists/' + l['.key'] + '/songs');
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