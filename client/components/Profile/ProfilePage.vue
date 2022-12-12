<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h2 class="title">@{{ $route.query.author }}</h2>
      <p class="date-joined" v-if="dateJoined">Joined at {{ dateJoined }}</p>
      <section class="bio" v-if="bio.length">
        <h3>Bio:</h3>
        <p>{{ bio }}</p>
      </section>
      <section class="bio" v-else>
        <h3>Bio:</h3>
        <router-link to="/account">Add Bio</router-link>
      </section>
    </header>
    <section>
      <h3>Posts</h3>
      <section
        v-if="ownPosts.length"
      >
        <PostComponent
          v-for="post in ownPosts"
          :key="post.id"
          :post="post"
        />
      </section>
      <article v-else>
        <p>No posts</p>
      </article>
    </section>
    <!-- <section>
      <h3>Comments</h3>

    </section>
    <section>
      <h3>Liked Posts</h3>
    </section> -->
  </main>
</template>

<script>
import PostComponent from '@/components/Post/PostComponent.vue';

export default {
  name: 'ProfilePage',
  components: {
    PostComponent
  },
  data() {
    return {
      bio: '',
      dateJoined: '',
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    async getBio() {
      /**
       * Submits a request to the post's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const params = {
        method: 'GET',
        callback: () => {}
      };

      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/users?author=${this.$route.query.author}`, options);
        const res = await r.json();
        this.bio = res.user.bio;
        this.dateJoined = res.user.dateJoined;

        if (!r.ok) {
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  computed: {
    ownPosts() {
      return this.$store.state.posts.filter(post => { 
        return post.author === this.$route.query.author
      });
    }
  },
  mounted() {
    this.getBio();
    this.$store.commit('refreshPosts');
  }
};
</script>

<style scoped>
.title {
  font-size: xx-large;
  font-weight: 650;
  margin: 0px;  
}

header {
  margin-top: 20px;
  border: solid 1px rgb(0, 0, 0);
  border-radius: 15px;
  padding: 15px;
}

header p {
  font-size: 20px;
}

.bio p {
  margin-top: 10px;
}

h3 {
  margin-bottom: 10px;
}

.date-joined {
  color: #AEAEAE;
}

</style>