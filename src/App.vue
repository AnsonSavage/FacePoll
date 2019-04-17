<template>
  <div id="app">
    <loading />
    <title-bar />
    <router-view/>
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
</style>
