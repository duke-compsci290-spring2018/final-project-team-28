<template>
  <div>
    <div>
      <playlistEditor v-if="songlistRef!=null" v-on:doneEdit="doneEditting()" v-bind:songRef="songlistRef" v-bind:name="edittingPlaylist"></playlistEditor>
      <h1 class="pt-5 pb-5">Hello {{firstname}}</h1>
      <div class="playlist-container">
        <h2 class="pt-3 pb-5">{{firstname}}'s Playlists</h2>
        <div class="playlist-list container">
          <ul>
            <li class="row">
              <span class="col-8">
                <label>Name (click to edit)</label>
              </span>
              <span class="col-4">
                <label>{{status}}</label>
              </span>
            </li>
            <li class="row">
              <span class="col-8">
                <input class="text-center" type="text" placeholder="New Playlist Name" v-model="newPlayListName" />
              </span>
              <span class="col-4">
                <button v-on:click="newPlaylist" class="btn btn-default">&plus;</button>
              </span>
            </li>
            <li v-for="(l, index) in playlists" class="row">
                <span class="col-8">
                  <label class="text-center" v-on:click="editName(l)">{{l.name}}</label>
                </span>
                <span class="col-4">
                  <div class="row">
                  <button v-on:click="deletePlaylist(l)" class="btn btn-default col-2 mr-3">&times;</button>
                  <button v-on:click="editPlaylist(l)" class="btn btn-default col-2 mr-3">Edit</button>
                  <button v-on:click="playPlaylist" class="btn btn-default col-2">Play</button>
                  <div class="d-inline-block col-2">
					          <button v-if="index!=0" v-on:click="moveUp(l)" class="btn btn-default d-block arrow-btn">&uarr;</button>
					          <button v-if="index!=playlists.length-1" v-on:click="moveDown(l)" class="btn btn-default d-block arrow-btn">&darr;</button>
				          </div>
                  </div>
                </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="$root.$data.user.admin">
      I am an admin
    </div>
  </div>
</template>


<script>
import playlistEditor from './playlistEditor';
var firebase = require('firebase')

var db = firebase.app().database();

export default {
  name: 'userPage',
  props: ['username'],
  components: {
    playlistEditor:playlistEditor
  },
  created() {
    this.playListRef = db.ref('users/' + this.username + '/playlists');
    this.$bindAsArray('playlists', this.playListRef);
  },
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
      newPlayListName: '',
      playlistRef: db.ref('users/' + this.username + '/playlists'),
      status: '',
      songlistRef: null,
      edittingPlaylist: ''
    }
  },
  methods: {
    newPlaylist() {
      if (!this.newPlayListName) {
        this.status = 'Please enter a valid name';
      } else if (this.playlists.filter(list => list.name === this.newPlayListName).length > 0) {
        this.status = 'Playlist Name Already In Use';
      } else {
        if (this.playlists.length === 0) {
          db.ref('users/' + this.username).child('playlists').child(0).set({
            name: this.newPlayListName
          });
        } else {
          this.playlistRef.child(this.playlists.length).set({
            name: this.newPlayListName
          })
        }
      }
      this.newPlayListName = '';
    },
    deletePlaylist(l) {
      var i = l['.key'];
      for (i; i < this.playlists.length - 1; i++) {
        const temp = Object.assign({}, this.playlists[parseInt(i) + 1]);
        delete temp['.key'];
        this.playlistRef.child(i).set(temp);
      }
      this.playlistRef.child(i).remove();
    },
    editName(list) {
      var response = prompt("Please enter a new name", list.name);
      if (!response && this.playlists.filter(l => l.name === list.name)) {
        return;
      } else {
        this.playListRef.child(list['.key']).update({
          name: response
        });
      }
    },
    playPlaylist(l) {

    },
    editPlaylist(l) {
      this.edittingPlaylist = l.name;
      this.songlistRef = db.ref('users/'+this.username+'/playlists/'+l['.key']+'/songs');
    },
    moveUp(l) {
      const tempIndex = parseInt(l['.key']);
      const target = this.playlists.filter(list => list['.key'] == tempIndex - 1)[0];
      const tempL = Object.assign({}, l);
      delete tempL['.key'];
      const tempTar = Object.assign({}, target);
      delete tempTar['.key'];
      this.playListRef.child(target['.key']).set(tempL);
      this.playListRef.child(tempIndex).set(tempTar);
    },
    moveDown(l) {
      const tempIndex = parseInt(l['.key']);
      const target = this.playlists.filter(list => list['.key'] == tempIndex + 1)[0];
      const tempL = Object.assign({}, l);
      delete tempL['.key'];
      const tempTar = Object.assign({}, target);
      delete tempTar['.key'];
      this.playListRef.child(target['.key']).set(tempL);
      this.playListRef.child(tempIndex).set(tempTar);
    },
    doneEditting() {
      this.songlistRef=null;
      this.edittingPlaylist = '';
    }
  }
}


</script>

<style scoped>

.arrow-btn {
	height: 20px;
	padding: 0px 15px 0px 15px;
}

ul {
  list-style-type: none;
  margin: 0px;
  padding: 0px;
}

li {
  border-style:solid;
  border-width: 0px 0px 2px 0px;
  padding: 5px 0px 5px 0px;
  width: 100%;
  margin: 0;
}

.playlist-list {
  border-style:solid;
  background-color: #e8e8e8;
  padding: 0;
}

.playlist-container {
  background-color: #a2ff9b;
  margin-left: 15%;
  margin-right: 15%;
  padding: 0% 8% 5% 8%;
}
</style>