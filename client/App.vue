<template>
  <div id="app">
    <header>
      <SideBar />
    </header>
    <div class="main-text">
      <router-view />
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/common/SideBar.vue';

export default {
  name: 'App',
  components: {SideBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
      this.$store.commit('setBio', user ? user.bio : null);
      // this.$store.commit('refreshPreferences');
      // this.$store.commit('refreshRecommendations');
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  background-color: #f8fdfb;
  font-family: Arial, Helvetica, sans-serif;
  color: #000000;
}

main {
  padding: 0 5em 5em;
}

.main-text {
  margin-left: 240px;
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}


</style>
