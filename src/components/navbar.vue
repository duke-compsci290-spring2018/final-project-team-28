<template>
  <nav class="navbar justify-content-between navbar-dark bg-dark">
    <router-link tag="a" :to='"/"' class="navbar-brand sonquest-brand">
      <img id="logo-pic" class="img-fluid" src="../assets/sqLogo.png" alt="sonquest logo"/>
      SonQuest
    </router-link>
    <div class="">
      <ul class="mb-0">
        <li class="nav-item d-inline-block" v-for="i in rightMenu">
          <span v-if="i.link" class="nav-link sonquest-link" v-on:click="i.onPress()">{{i.display}}</span>
          <span v-if="!i.link" class="nav-link sonquest-nonlink"><b>{{i.display}}</b></span>
        </li>
      </ul>
    </div>
  </nav>
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
.sonquest-nonlink {
  color: rgba(255,255,255,.75);
}

.sonquest-link {
  border-style:solid;
  border-width:1px;
  cursor: pointer;
  color: rgba(255,255,255,.75);
}

.sonquest-link:hover, .sonquest-link:active {
  cursor: pointer;
  color: rgba(255,255,255,.50);
}

.sonquest-brand:link,.sonquest-brand:visited {
  color: rgba(255,255,255,.75);
}

.sonquest-navbar {
  background-color: #c2c2c2;
  height: 60px;
  position:fixed;
  top:0;
  left:0;
  z-index:1;
  margin:auto;
}

#logo-pic {
  max-height: 50px;
  padding: 5px;
}

</style>
