import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    posts: [], // All freets created in the app
    bio: null,
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setBio(state, bio) {
      /**
       * Update the stored user to the specified one.
       * @param user - new object to set
       */
      state.bio = bio;
      console.log(state.bio);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updatePosts(state, posts) {
      /**
       * Update the stored freets to the provided freets.
       * @param posts - Posts to store
       */
      state.posts = posts;
    },
    async refreshPosts(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/posts` : '/api/posts';
      const res = await fetch(url).then(async r => r.json());
      state.posts = res;
    },
    async refreshBio(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/users/session`;
      const res = await fetch(url).then(async r => r.json());
      const user = res.user;
      state.bio = user.bio;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;