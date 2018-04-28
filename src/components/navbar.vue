<template>
  <div class="navbar">
    <div id="navbar-left" class="subbar">
      <img id="logo-pic" class="navbar-left-el" src="../assets/sqLogo.png" alt="sonquest logo"/>
      <router-link tag="a" :to='"/"' class="navbar-left-el">sonquest</router-link>
    </div>
    <div id="navbar-right" class="subbar">
      <ul>
        <li v-for="i in rightMenu">
          <a>{{i.display}}</a>
        </li>
      </ul>
    </div>
    <div id="navbar-center" class="subbar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: ['rightMenu'],
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
  font-size: 50px;
}

.navbar {
  display:inline-block;
  background-color: #c2c2c2;
  width: 100%;
  height: 100px;
  position:fixed;
  top:0;
  left:0;
  z-index:100;
  margin:auto;
}

ul {
  text-decoration: none;
  margin: 0px;
  padding: 0px;
}

li {
  display: inline-block;
  margin-right: 20px;
}

.subbar {
  height: 100px;
}

#navbar-center {
  width: 50%;
  margin-right: 25%;
  margin-left: 25%;
}

#navbar-left {
  float: left;
}

#navbar-right {
  float: right;
}

#logo-pic {
  max-height: 80px;
  padding: 5px;
}

</style>
