
<template>
<div id="log-in-form">
  <h1>Log In to your account</h1>
   <form @submit.prevent="login" class="pure-form pure-form-aligned">
    <fieldset>
      <p class="pure-form-message-inline">All fields are required.</p>

      <div class="pure-control-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" placeholder="Username">
      </div>

      <div class="pure-control-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" placeholder="Password">
      </div>

      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Log in</button>
      </div>
    </fieldset>
  </form>
  <p v-show="error" class="error">
    <!-- This simply shows the error returned from the server if there is one -->
    {{error}}
  </p>
</div>
</template>


<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async login() {
      try {
        this.error = await this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
        });
        if (this.error === "") {
          this.$router.push('mypage'); //Again, sends the user to mypage if there is no error
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
#log-in-form {
  /* width: 40%;
  margin: auto;
  display: flex;
  flex-direction: column; */
}
form {
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 4px;
  /* padding: 20px; */
}

.pure-controls {
  display: flex;
}

.pure-controls button {
  margin: auto;
}
</style>
