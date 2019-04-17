<template>
  <div class="home">
    <div v-if="!user">
      <h1>Welcome to FacePoll, the happiest website on earth.</h1>
      <p>
        Please register or login.
      </p>
      <router-link to="/register" class="pure-button">Register</router-link> or
      <router-link to="/login" class="pure-button">Login</router-link>
    </div>
    <div v-else>
      <!-- <div v-for="poll in polls">
        <poll v-bind:poll="poll"></poll>
      </div> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'home',
  components: {

  },
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    polls() {
      return this.$store.state.polls;
    }
  },
  created() {
    this.$store.dispatch("getUser");
  }

}
</script>
