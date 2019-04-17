import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    polls: [],
    loading: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setPolls(state, polls) {
      state.polls = polls;
    },
    startLoading(state) {
      state.loading = true;
    },
    finishLoading(state) {
      state.loading = false;
    }
  },
  actions: {
    async register(context, data) { //One of the parameters is a context object, which abstracts the scope of the current module (in this case a Store)
      try {
        console.log("Trying to register the user!");
        let response = await axios.post("/api/users", data);
        context.commit('setUser', response.data); //Because the user object is sent back in the response from the server
        return ""; //We return an empty string so nothing shows in our error message
      } catch (error) { //Remember, anything other than a 200 status is considered an error
        return error.response.data.message;
      }
    },
    async login(context, data) {
      try {
        let response = await axios.post("/api/users/login", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit('setUser', null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        let response = await axios.get("/api/users");
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return ""; //The get endpoint doesn't return any messages or anything like that
      }
    },
    async addPoll(context, data) {
      try {
        context.commit('startLoading');
        let response = await axios.post("/api/polls", data);
        console.log(response.data);
        await context.dispatch('getPolls');
        context.commit('finishLoading');
      } catch (error) {
        console.log(error);
      }
    },
    async getPolls(context) {
      try {
        let response = await axios.get("/api/polls");
        context.commit('setPolls', response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async deletePoll(context, id) {
      try {
        context.commit('startLoading');
        await axios.delete("/api/polls/" + id);
        await context.dispatch('getPolls');
        context.commit('finishLoading');
      } catch (error) {
        console.log(error);
      }
    },
    async addCount(context, data) {
      try {
        await axios.put("/api/polls/" + data.id, {
          optionsVotes: data.optionsVotes,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
})