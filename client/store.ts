import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
Vue.config.devtools = true

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown posts by (null = show all)
    tagFilter: null, // Tag to filter shown posts by (null = show all)
    posts: [], // All posts created in the app
    remixes: [], // All posts created in the app
    bio: null,
    username: null, // Username of the logged in user
    recommendations: [], //All recommendations that have been generated
    preferences: [], //The user's preferences of what to get recommendations
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
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setPreferences(state, preferences) {
      /**
       * update the stored preferences to the specified ones
       * @param preferences - new preferences to set
       */
      state.preferences = preferences;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.filter = filter;
    },
    updateTagFilter(state, filter) {
      /**
       * Update the stored tag filter to the specified one.
       * @param filter - Tag to filter posts by
       */
      state.tagFilter = filter;
    },
    updatePosts(state, posts) {
      /**
       * Update the stored posts to the provided posts.
       * @param posts - Posts to store
       */
      state.posts = posts;
    },
    async loadRemixes(state, postId) {
      /**
       * Get all the remixes made from the post with the postId
       * @param postId - a post's id
       */
      const url = `/api/remix?postId=${postId}`;
      const res = await fetch(url).then(async r => r.json());
      state.remixes = res;
    },
    async refreshPosts(state) {
      /**
       * Request the server for the currently available posts.
       */
      const url = state.filter ? `/api/users/${state.filter}/posts` : '/api/posts';
      const res = await fetch(url).then(async r => r.json());
      state.posts = res;
    },
    async refreshBio(state) {
      /**
       * Request the server for the currently available user bio.
       */
      const url = `/api/users/session`;
      const res = await fetch(url).then(async r => r.json());
      const user = res.user;
      state.bio = user.bio;
    },
    async refreshRecommendations(state) {
      /**
       * Request the server for a new recommendation.
       */
      const url = `/api/recommendation`
      const r = await fetch(url);
      const res = await r.json();
      if (r.ok) {
        const recommendation = res.recommendation
        state.recommendations.unshift(recommendation)
      }
    },
    async refreshPreferences(state) {
      const url = `/api/users/session`;
      const r = await fetch(url);
      const res = await r.json();
      if (r.ok && res.user) {
        const user = res.user;
        state.preferences = user.preferences;
      }
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;