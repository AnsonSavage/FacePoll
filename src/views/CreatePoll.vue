<!-- I think this would be ideal to implement as a component instead, if you have time! -->

<template>
<div id="createWrapper">
  <form class="pure-form" v-on:submit.prevent="addPoll()" id="createPoll">
    <h2>Create Poll:</h2>
    <fieldset class="pure-group">
      <textarea class="pure-input-1-2" v-model="questionInCreation" placeholder="Enter text of poll"></textarea>
      <br />
      <div id="options" v-for="i in optionsInCreation.length" v-bind:key="i">
        <input class="pure-input-1-2" v-bind:placeholder="'Option ' + i" v-model="optionsInCreation[i - 1]" />
        <br />
      </div>
    </fieldset>
    <button class="pure-button" type="button" v-on:click="addOption()">Add Option</button>
    <br />
    <button class="pure-button pure-button-primary" type="submit" id="sendPoll">Create new Poll!</button>
    <p id="complete" v-show="questionInCreation ==='' | optionsInCreation[0] ==='' | optionsInCreation[1] === ''">
      Please enter a poll question and possible options.
    </p>
  </form>
</div>
</template>

<script>
export default {
  name: 'create-poll',
  data() {
    return {
      questionInCreation: '',
      optionsInCreation: ["", ""]
    }
  },
  methods: {
    addOption() {
      this.optionsInCreation.push("");
    },
    async addPoll() {
      if (!(this.questionInCreation === '' | this.optionsInCreation[0] === '' | this.optionsInCreation[1] === '')) { //TODO: This checking should be done on the server side, and it should send back a message.
        let poll = {
          questionText: this.questionInCreation,
          optionsText: [],
        }
        this.optionsInCreation.forEach(option => {
          if (option !== "") {
            poll.optionsText.push(option);
          }
        });
        this.$store.dispatch("addPoll", poll);
        this.questionInCreation = "";
        this.optionsInCreation = ["", ""];
      }
      else {
        console.log("Insufficient information to add a poll!")
      }
      this.$router.push('/');
    },
  }
}
</script>

<style>
#createWrapper {
  width: 100%;
}
.pure-form {
  width: 50%;
  margin: auto;
}

.pure-button {
  margin: 0.5em;
}

.pure-group{
  display: flex;
  flex-direction: column;
  align-content: center;
}
.pure-input-1-2 {
  width: 40% !important;
  margin: auto !important;
}
</style>
