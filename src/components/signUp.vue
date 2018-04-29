<template>
  <div>
    <div class="sonquest-modal container-fluid">
      <form class="sonquest-modal-content w-50">
        <h1 class="pb-1">Welcome!</h1>
        <h4 id="sign-up-status" class="mb-2 pt-1 pb-1" :class="{'sq-alert':error}">{{status}}</h4>
        <div class="row">
          <div class="col-2">
            <label>
              <b>First Name</b>
            </label>
          </div>
          <input class="col-4 text-center" type="text" placeholder="Enter First Name" v-model="firstname">

          <div class="col-2">
            <label>
              <b>Last Name</b>
            </label>
          </div>
          <input class="col-4 text-center" type="text" placeholder="Enter Last Name" v-model="lastname">
        </div>
        
        <div class="row">
          <div class="col-2">
            <label>
              <b>Username</b>
            </label>
          </div>
          <input class="col-4 text-center" type="text" placeholder="Enter Username" v-model="username">

          <div class="col-2">
            <label>
              <b>Password</b>
            </label>
          </div>
          <input class="col-4 text-center" type="password" placeholder="Enter Password" v-model="password">

        </div>

        <div class="sonquest-button-container row justify-content-center">
          <button type="button" v-on:click="cancel()">Cancel</button>
          <button type="button" v-on:click="login()">Sign Up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SignUp",
    props: ['signUpMethods'],
    data() {
      return {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        status: 'Please enter your information:',
        error: false
      }
    },
    methods: {
      reset() {
        this.firstname = '',
        this.lastname = '',
        this.username = '';
        this.password = '';
        this.status = 'Please enter your information';
        this.error = false;
      },
      cancel() {
        this.reset();
        this.$emit('canceled', true);
      },
      login() {
        this.error = false;
        if (!this.firstname) {
          this.status = 'Please enter a valid first name!';
          this.error = true;
        } else if (!this.lastname) {
          this.status = 'Please enter a valid last name!';
          this.error = true;
        } else if (!this.username && !this.password) {
          this.status = 'Please enter valid credentials!';
          this.error = true;
        } else {
          if (this.signUpMethods.unameLookUp(this.username).len > 0) {
            this.status = 'Username already taken!';
            this.error = true;
          }
          else {
            var u = this.signUpMethods.addUser(this.firstname, this.lastname, this.username, this.password);
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
          var element = document.getElementById('sign-up-status');
          element.classList.remove('sq-alert');
          setTimeout(() => {
            var element = document.getElementById('sign-up-status');
            element.classList.add('sq-alert');
          }, 100);
        }
      }
    }
  }
</script>

<style scoped>
  .sq-alert {
    animation-name:alertAnimation;
    animation-duration: 1s;
    background-color: #ffcccc;
    color:#ff7777;
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
    background-color:#fff;
    border-radius: 15px;
    padding: 50px;
    margin: 5px auto;
  }

  .sonquest-button-container {
    background-color:#ccc;
  }

  .sq-row {
    display: flex;
    flex-wrap: wrap;
  }

  .sq-col {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  @keyframes alertAnimation {
    0% {
      background-color:#fff;
      color:#000;
    }
    30% {
      background-color: #fc7676;
      color:#ff7777;
    }
    60% {
      background-color: #ffcccc;
      color:#ff7777;
    }
  }

</style>