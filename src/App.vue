<template>
  <div id="app">
    <loading />
    <title-bar />
    <router-view/>
    <br />
    <br />
    <div class="footer">
      <a href="https://github.com/AnsonSavage/FacePoll">Source Code on GitHub</a>
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/TitleBar.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'app',
  components: {
    TitleBar,
    Loading,
  }
}
</script>

<style>
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  margin-left: 1em;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.footer {
  box-shadow: 0px 0px 10px rgb(82, 82, 82);
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  color: #42b983;
  text-align: center;
  padding: 1%;
}

.footer a {
  text-decoration: none;
  color: #42b983;
}

.footer a:hover {
  text-decoration: none;
  color: #298b5f;
}
</style>
