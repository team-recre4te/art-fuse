<template>
  <div class="sidebar">
    <div class="top">
      <router-link to="/">
        <img src="../../public/assets/other-logo-transparent.png">
      </router-link>
    </div>
    <div class="middle">
      <router-link to="/" :class="{ 'selected': (isOnHome) }">
        <img :src="getHomeIcon()" class="icon">
        Home
      </router-link>

      <!-- <router-link
        v-if="$store.state.username"
        to="/recommendations"
        :class="{ 'selected':(isOnRec) }"
      >
      <img :src="getRecIcon()" class="icon">
        Recommendations
      </router-link> -->
      <router-link v-if="$store.state.username" :to="{ name: 'Profile', query: { author: $store.state.username } }"
        :class="{ 'selected': (isOnProfile) }">
        <img :src="getUserIcon()" class="icon">
        Profile
      </router-link>
      <router-link v-if="$store.state.username" to="/account" :class="{ 'selected': (isOnSettings) }">
        <img :src="getSettingsIcon()" class="icon">
        Settings
      </router-link>
      <router-link v-else to="/login" :class="{ 'selected': (isOnLogin) }">
        <img :src="getLoginIcon()" class="icon">
        Login
      </router-link>

      <router-link v-if="$store.state.username" id="create-post" to="/create">
        Create Post
      </router-link>
    </div>

    <section class="alerts">
      <article v-for="(status, alert, index) in $store.state.alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  methods: {
    getHomeIcon() {
      return this.isOnHome ? './assets/home_filled.png' : './assets/home_outline.png';
    },
    getSearchIcon() {
      return this.isOnBrowse ? './assets/search_bold.png' : './assets/search.png';
    },
    getUserIcon() {
      return this.isOnProfile ? './assets/user_filled.png' : './assets/user_outline.png';
    },
    getLoginIcon() {
      return this.isOnLogin ? './assets/login_filled.png' : './assets/login_outline.png';
    },
    getRecIcon() {
      return this.isOnRec ? './assets/rec-filled.png' : './assets/rec-outline.png';
    },
    getSettingsIcon() {
      return this.isOnSettings ? './assets/settings-filled.png' : './assets/settings-outline.png';
    }
  },
  computed: {
    isOnHome() {
      return this.$route.path === '/';
    },
    isOnBrowse() {
      return this.$route.path === '/browse';
    },
    isOnProfile() {
      return this.$route.path.includes('/profile');
    },
    isOnLogin() {
      return this.$route.path === '/login' || this.$route.path === '/register';
    },
    isOnRec() {
      return this.$route.path === '/recommendations';
    }, 
    isOnSettings() {
      return this.$route.path === '/account';
    }
  }
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 240px;
  position: fixed;
  left: 30;
  top: 0;
  padding-top: 30px;
  padding-left: 30px;
  background-color: #ccc;
}

.sidebar div {
  padding: 8px;
}

.title {
  font-size: 32px;
  margin: 0 5px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #3B413C;
}

.top {
  margin-bottom: 60px;
}

.top img {
  height: 84px;
}

img {
  height: 32px;
}

.middle {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.middle a {
  font-size: 24px;
  margin-bottom: 15px;
  text-decoration: none;
  color: black;
}

.selected {
  font-weight: 500;
}

.icon {
  margin-bottom: -7px;
  padding-right: 10px;
  scale: 0.9;
}

.alerts {
  width: 25%;
}

#create-post {
  margin-top: 100px;
  background-color: #EDBD48;
  padding: 5px 20px;
  border-radius: 20px;
  margin-right: 44px;
  font-size: 20px;
}
</style>
