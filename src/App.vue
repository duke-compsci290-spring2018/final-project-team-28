<template>
  <div id="app">
    <navbar :rightMenu="navbarOptions"></navbar>
    <SignIn :class="{hide:signInHide}" v-on:canceled="onCancel" :signInMethods="signInMethods" v-on:loggedIn="loggedIn"></SignIn>
    <SignUp :class="{hide:signUpHide}" v-on:canceled="onCancel" :signUpMethods="signUpMethods" v-on:loggedIn="loggedIn"></SignUp>
    <router-view/>
    <footer class="sq-footer">
      <p>Created By: Asa Royal and Gordon Huynh</p>
      <img id="cc-pic" class="img-fluid" src="./assets/cc-logo.png" alt="creative commons logo" />
    </footer>
  </div>
</template>

<script>
import navbar from './components/navbar';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import Vue from 'vue';
var VueFire = require('vuefire');
var firebase = require('firebase');
var bcrypt = require('bcrypt-nodejs');

var config = {
  apiKey: "AIzaSyDSRaDpwgpKA6QPsGLlpi4jc5F0t2Cglz0",
  authDomain: "sonquest-3379c.firebaseapp.com",
  databaseURL: "https://sonquest-3379c.firebaseio.com",
  projectId: "sonquest-3379c",
  storageBucket: "sonquest-3379c.appspot.com",
  messagingSenderId: "228676657274"
};

// global access to initialized app database
var db = firebase.initializeApp(config).database();
var storageRef = firebase.storage().ref();
var userRef = db.ref('users');

// connect Firebase to Vue
Vue.use(VueFire);

export default {
  name: 'App',
  components: {
    navbar,
    SignIn,
    SignUp
  },
  firebase: {
    users: userRef,
  },
  data() {
    return {
      signInHide: true,
      signUpHide: true,
      navbarOptions: [{
          display: "Sign In",
          link: true,
          onPress: () => {
            this.signInHide = false;
          }

        },
        {
          display: "Sign Up",
          link: true,
          onPress: () => {
            this.signUpHide = false;
          }
        }
      ],
      signUpMethods: {
        unameLookUp: (uname) => {
          return this.users.filter(user => user.username === uname);
        },
        addUser: (fname, lname, uname, password) => {
          userRef.child(uname).set({
            firstname: fname,
            lastname: lname,
            username: uname,
            password: bcrypt.hashSync(password),
            admin: false
          });

          return this.users.filter(user => user.username === uname)[0];
        }
      },
      signInMethods: {
        unameLookUp: (uname) => {
          return this.users.filter(user => user.username === uname);
        },
        logIn: (uname, password) => {
          var u = this.users.filter(user => user.username === uname);
          if (u.length > 0) {
            u = u[0];
          } else {
            return null;
          }
          if (bcrypt.compareSync(password, u.password)) {
            return u;
          } else {
            return null;
          }
        }
      }

    }
  },
  methods: {
    onCancel() {
      this.signInHide = true;
      this.signUpHide = true;
    },
    loggedIn() {
      this.onCancel();
      this.navbarOptions = [{
          display: this.$root.$data.user.firstname,
          link: false,
          onPress: () => {
            return;
          }
        },
        {
          display: "My Account",
          link: true,
          onPress: () => {
            this.$router.push({
              name: 'userPage',
              params: {
                username: this.$root.$data.user.username,
                curUser: this.$root.$data.user
              }
            });
          }
        },
        {
          display: "Sign Out",
          link: true,
          onPress: () => {
            var u = this.$root.$data.user;
            u.loggedIn = false;
            u.username = '';
            u.firstname = '';
            u.lastname = '';
            u.admin = '';
            this.navbarOptions = [{
                display: "Sign In",
                link: true,
                onPress: () => {
                  this.signInHide = false;
                }

              },
              {
                display: "Sign Up",
                link: true,
                onPress: () => {
                  this.signUpHide = false;
                }
              }
            ];
            this.$router.push({
              name: 'HelloWorld'
            });
          }
        }
      ];
    }
  }
}

</script>

<style>
#cc-pic {
  height: 50px;
}

.sq-footer {
  background-color: #343a40;
  color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
}

.hide {
  display: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
