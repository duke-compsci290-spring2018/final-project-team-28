<template>
<div>
<div class="userlist-container">
    <h2 class="pt-3 pb-4">SonQuest Users</h2>
    <button v-on:click="downloadPlaylist()" class="btn btn-default mb-3">Download All Playlists</button>
    <div class="userlist-list container">
      <ul>
        <li v-for="u in users" v-if="u['.key']!=admin" class="row">
          <div class="col-1">
            <img src="../assets/admin.png" alt="admin" class="admin-image img-fluid" v-if="u.admin" v-on:click="toggleAdmin(u)"/>
            <img src="../assets/regular.png" alt="regular user" class="admin-image img-fluid" v-if="!u.admin" v-on:click="toggleAdmin(u)"/>
          </div>
          <span class="col-8">
            <label class="text-center">{{u['.key']}}</label>
          </span>
          <span class="col-4">
            <div class="row">

            </div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
var firebase = require('firebase')

var db = firebase.app().database();
var userRef = db.ref('users');

export default {
  name: 'userManager',
  firebase: {
    users:userRef
  },
  props:['admin'],
  methods: {
    toggleAdmin(u) {
      userRef.child(u['.key']).update({
        admin:!u.admin
      });
    },
    downloadPlaylist() {
      
    }
  }
}

</script>

<style scoped>

.admin-image {
  height:30px;
  cursor:pointer;
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

.userlist-list {
  border-style:solid;
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