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
      <div v-for="poll in polls" v-bind:key="poll._id">
        <poll v-bind:poll="poll"></poll>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Poll from '@/components/Poll.vue';

export default {
  name: 'home',
  components: {
    Poll
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
  async created() {
    await this.$store.dispatch("getUser");
    if (this.user) {
      this.$store.dispatch("getPolls");
    }
  }

}
</script>
