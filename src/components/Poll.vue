<template>
  <div>
    <div class="pollHeader">
      <img class="userPortrait" src="images/Portrait_Placeholder_Square.png" />
      <p class="username">
        {{user.username}}
      </p>
      <p class="date">
        {{formatedDate}}
      </p>
    </div>
    <p class="question">
      {{poll.questionText}}
    </p>
    <div class="buttons">
      <div class="vote" v-for="i in poll.optionsText.length" v-bind:key="i">
        <button v-on:click="addCount(i -1)">{{poll.optionsText[i - 1]}}</button>
        <strong>
          Votes: {{poll.optionsVotes[i-1]}}
        </strong>
        <p v-show="total !== 0">
          {{Math.round((poll.optionsVotes[i-1]/total) * 10000)/100}}%
          <!-- If you're feeling lucky, you can optimize this with computed properties. -->
        </p>
      </div>
    </div>
    <div class="pollBottomButtons">
      <button v-on:click="deletePoll()" class="delete">Delete Poll</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'; //We do this simply so we can properly mutate the array
import moment from 'moment';
export default {
  name: 'Poll',
  props: {
    poll: Object,
  },
  data() {
    return {

    };
  },
  methods: {
    async addCount(index) {
      Vue.set(this.poll.optionsVotes, index, this.poll.optionsVotes[index] + 1);
      let data = {
        id: this.poll._id,
        optionsVotes: this.poll.optionsVotes
      };
      await this.$store.dispatch('addCount', data);
    },
    async deletePoll() {
      this.$store.dispatch('deletePoll', this.poll._id)
    }
  },
  computed: {
    total() {
      // return this.poll.optionsVotes.reduce((total, current) => {
      //   total + current;
      // });
      let sum = 0;
      this.poll.optionsVotes.forEach(vote => {
        sum += vote;
      });
      return sum;
    },
    user() {
      return this.$store.state.user;
    },
    formatedDate() { //IDK if this is more efficient to have as a method or not.
      if (moment(this.poll.date).diff(Date.now(), 'days') < 15) {
        return moment(this.poll.date).fromNow();
      }
      else {
        return moment(this.poll.date).format('d MMMM YYYY');
      }
    },
  }
}
</script>

<style scoped>
/* I think I want to go with more pure CSS stuff here. */
button {
  background-color: rgb(184, 227, 209);
  padding: 1.5%;
  border-radius: 5px;
  border-style: none;
}

.pollBottomButtons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete {
  background-color: rgb(255, 107, 107);
  display: flex;
  justify-content: center;
}
.poll {
  border-color: rgb(167, 167, 167);
  border-radius: 10px;
  border-style: solid;
  border-width: thin;
  box-shadow: 0px 0px 10px rgb(82, 82, 82);
  padding: 2%;
  width: 50%;
  margin: auto;
  margin-top: 1%;
}

.pollHeader {
  display: flex;
  flex-direction: row;
}

.userPortrait {
  width: 5%;
  height: 5%;
  margin: 1%;
}

.username {
  font-size: 2em;
  padding-left: 1%;
  margin: 0;
}

.date {
  width: 100%;
  font-style: italic;
  align-self: flex-end;
  text-align: right;
}

.question {
  padding: 3%;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.vote {
  padding: 1%;
  display: flex;
  flex-direction: column;
}
</style>
