
<template>
   <div id="top-bar">
    <h1>FacePoll</h1>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <div v-if="user">
        <a v-on:click="logout">Logout</a>
        <router-link to="/create-poll">Create Poll</router-link>
        <!-- <p>
          Welcome, {{user.name}}!
        </p> -->
      </div>
      <div v-else>
        <router-link to="/login">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-bar',
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  }
}
</script>

<style scoped>
#top-bar {
  display: flex;
  width: 100%;
  box-shadow: 0px 0px 10px rgb(82, 82, 82);
}

h1 {
  text-align: center;
  margin-left: 2%;
}

#nav {
  display: flex;
  justify-content: space-between;
  margin-left: auto;
}
</style>
