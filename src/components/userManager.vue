<template>
  <div>
    <div class="userlist-container">
      <h2 class="pt-3 pb-4">SonQuest Users</h2>
      <button v-on:click="downloadPlaylists()" class="btn btn-default mb-3">Download All Playlists</button>
      <div class="userlist-list container">
        <ul>
          <li v-for="u in users" v-if="u['.key']!=admin" class="row">
            <div class="col-1">
              <img src="../assets/admin.png" alt="admin" class="admin-image img-fluid" v-if="u.admin" v-on:click="toggleAdmin(u)" />
              <img src="../assets/regular.png" alt="regular user" class="admin-image img-fluid" v-if="!u.admin" v-on:click="toggleAdmin(u)"
              />
            </div>
            <span class="col-3 text-left">
              <label class="">User: {{u['.key']}}</label>
            </span>
            <span class="col-6 text-left">
              <label class="">Name: {{u.firstname}} {{u.lastname}}</label>
            </span>
            <span class="col-2 text-left">
              <label class=""># of Playlists: {{u.playlists ? u.playlists.length : 0}}</label>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
var firebase = require('firebase')
var axios = require('axios');
var db = firebase.app().database();
var userRef = db.ref('users');
var FileSaver = require('file-saver');

export default {
  name: 'userManager',
  firebase: {
    users: userRef
  },
  props: ['admin'],
  methods: {
    toggleAdmin(u) {
      userRef.child(u['.key']).update({
        admin: !u.admin
      });
    },
    downloadPlaylists() {
      axios.get('http://localhost:3000/admindump/')
        .then(response => {
          var jString = JSON.stringify(response.data);
          var blob = new Blob([jString], {
            type: 'application/json'
          });
          FileSaver.saveAs(blob, 'alluserdump.json');
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
}
</script>

<style scoped>
.admin-image {
  height: 30px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  margin: 0px;
  padding: 0px;
}

li {
  border-style: solid;
  border-width: 0px 0px 2px 0px;
  padding: 5px 0px 5px 0px;
  width: 100%;
  margin: 0;
}

.userlist-list {
  border-style: solid;
  background-color: #e8e8e8;
  padding: 0;
}

.userlist-container {
  background-color: #7fb0ff;
  margin-left: 15%;
  margin-right: 15%;
  padding: 0% 8% 5% 8%;
}
</style>