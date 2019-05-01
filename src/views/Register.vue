
<template>
<div class = "register">
  <h1>Register for an account</h1>
  <form v-on:submit.prevent="register" class="pure-form pure-form-aligned">
    <fieldset>
      <p class="pure-form-message-inline">All fields are required.</p>
      <div class="pure-control-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" placeholder="Username">
      </div>

      <div class="pure-control-group">
        <label for="password">Password</label>
        <input v-on:keyup="checkPassword" v-model="password" type="password" placeholder="Password">
      </div>

      <div class="pure-control-group">
        <label for="password">Verify Password</label>
        <input v-on:blur="doubleCheckPassword" v-model="verifiedPassword" type="password" placeholder="Verify Password">
      </div>

      <password v-model="password" :strength-meter-only="true" :secure-length="6"/>
      <!-- <div class="pure-controls"> -->
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      <!-- </div> -->
    </fieldset>
  </form>
  <p v-show="error" class="error">
    {{error}}
  </p>
</div>
</template>

<script>
import Password from 'vue-password-strength-meter';
export default {
  name: 'register',
  components: {
    Password
  },
  data() {
    return {
      username: '',
      password: null,
      verifiedPassword: '',
      error: '',
    }
  },
  methods: {
    checkPassword() {
      if (this.password.length < 8) {
        this.error = "Password must be at least 8 characters."
      }
      else if (!(/[0-9]/.test(this.password) && /[$@$!%*#?&]/.test(this.password))) { //Some fancy RegEx stuff
        this.error = "Password must contain at least one digit and one special character.";
      }
      else {
        this.error = "";
      }
    },
    doubleCheckPassword() {
      if ((this.password !== this.verifiedPassword) && (this.verifiedPassword !== "")) { //If there is something in the verifiedPassword box and they don't match
        this.error = "Passwords do not match.";
      }
      else {
        this.error = "";
      }
    },
    async register() {
      try {
        this.error = await this.$store.dispatch("register", {
          username: this.username,
          password: this.password,
        });
        if (this.error === "") {
          this.$router.push('/'); //This sends the user to the mypage view
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
form {
  border: 1px solid #ccc;
  margin: auto;
  background-color: #eee;
  border-radius: 4px;
  /* padding: 20px; */
  width: 40%;
}
password {
  margin: auto;
}
.pure-controls {
  display: flex;
}

.pure-controls button {
  /* margin: auto; */
  /* margin-left: auto;
  margin-right: auto; */
}
</style>
