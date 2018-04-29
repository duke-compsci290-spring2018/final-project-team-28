<template>
  <div>
    <div class="sonquest-modal container-fluid">
      <form class="sonquest-modal-content w-50">
        <h1 class="pb-1">Welcome Back!</h1>
        <h4 id="sign-in-status" class="mb-2 pt-1 pb-1" :class="{'sq-alert':error}">{{status}}</h4>
        <div class="row">
          <div class="col-sm-2">
            <label>
              <b>Username</b>
            </label>
          </div>
          <input class="col-sm-4 text-center" type="text" placeholder="Enter Username" v-model="username">

          <div class="col-sm-2">
            <label>
              <b>Password</b>
            </label>
          </div>
          <input class="col-sm-4 text-center" type="password" placeholder="Enter Password" v-model="password">
        </div>

        <div class="sonquest-button-container row justify-content-center">
          <button type="button" v-on:click="cancel()">Cancel</button>
          <button type="button" v-on:click="login()">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SignIn",
    props: ['signInMethods', 'blah'],
    data() {
      return {
        username: '',
        password: '',
        status: 'Please enter your credentials:',
        error: false
      }
    },
    methods: {
      reset: function () {
        this.username = '';
        this.password = '';
        this.status= 'Please enter your credentials:';
        this.error= false;
      },
      cancel: function () {
        this.reset();
        this.$emit('canceled', true);
      },
      login: function () {
        this.error = false;
        if (this.signInMethods.unameLookUp(this.username).len === 0) {
          this.status = 'No user associated with this name!';
          this.error = true;
        } else {
          var u = this.signInMethods.logIn(this.username, this.password);
          if (!u) {
            this.status = 'Incorrect Password!';
            this.error = true;
          } else {
            var curU = this.$root.$data.user;
            curU.loggedIn = true;
            curU.firstname = u.firstname;
            curU.lastname = u.lastname;
            curU.username = u.username;
            curU.admin = u.admin;
            this.reset();
            this.$emit('loggedIn', true);
          }
        }

        if (this.error) {
          var element = document.getElementById('sign-in-status');
          element.classList.remove('sq-alert');
          setTimeout(() => {
            var element = document.getElementById('sign-in-status');
            element.classList.add('sq-alert');
          }, 100);
        }
      }
    }
  }

</script>


<style scoped>
  .sq-alert {
    animation-name: alertAnimation;
    animation-duration: 1s;
    background-color: #ffcccc;
    color: #ff7777;
  }

  .sonquest-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
    padding-top: 200px;
  }

  .sonquest-modal-content {
    background-color: #fff;
    border-radius: 15px;
    padding: 50px;
    margin: 5px auto;
  }

  .sonquest-button-container {
    background-color: #ccc;
  }

  @keyframes alertAnimation {
    0% {
      background-color: #fff;
      color: #000;
    }
    30% {
      background-color: #fc7676;
      color: #ff7777;
    }
    60% {
      background-color: #ffcccc;
      color: #ff7777;
    }
  }
</style>