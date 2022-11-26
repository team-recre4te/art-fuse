<!-- Default page that also displays posts -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
    </section>
    <section v-else>
      <header>
        <h2>Art Fuse</h2>
      </header>
      <article>
        <h4>
          <router-link to="/login">Sign in</router-link>
          to create your own posts.
        </h4>
      </article>
    </section>
    <section>
      <header class="post-header">
        <h3>Posts</h3>
        <div>
          <SearchBar 
            @searched="handleSearch" 
            placeholderText="Search by author..."
          />
          <section
            v-if="Object.keys(alerts).length"
          >
            <article
              class="search-alerts"
              v-for="(status, alert, index) in alerts"
              :key="index"
              :class="status"
            >
              <p>{{ alert }}</p>
            </article>
          </section>
          <article
            v-else
            class="placeholder"
          >
            <!-- keeps spacing when there's no alert to display -->
            <p>placeholder</p>
          </article>  
        </div>
      </header>
      <section
        v-if="$store.state.posts.length"
      >
        <PostComponent
          v-for="post in $store.state.posts"
          :key="post.id"
          :post="post"
        />
      </section>
      <article
        v-else
      >
        <p>No posts</p>
      </article>
    </section>
  </main>
</template>

<script>
/*
Router Notes
- GET /api/posts : Get all the posts
- GET /api/posts?author=username : Get posts by author.
- POST /api/posts : Create a new post.
- DELETE /api/posts/:id : Delete a post
- PATCH /api/posts/:id : Modify a post
*/

import PostComponent from '@/components/Post/PostComponent.vue';
import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'PostsPage',
  components: {
    PostComponent, 
    SearchBar
  },
  data() {
    return {
      searching: false,
      searchAuthor: '',
      alerts: {}
    };
  },
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshPosts');
  },
  methods: {
    async handleSearch(value) {
      if (value.length > 0 && value.trim().length === 0) { // just whitespace in search
        // cannot search for empty string
        const e = ('status', 'empty_text_alert', 'Search text for author name cannot be empty');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
        
        this.searchAuthor = '';
        return;
      }

      this.searching = true;
      
      // clear old alerts
      this.alerts = {};

      this.searchAuthor = value.trim();

      this.$store.state.filter = this.searchAuthor;

      const url = this.searchAuthor ? `/api/posts?author=${this.searchAuthor}` : '/api/posts';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.searching = false;

        this.$store.commit('updateFilter', this.searchAuthor);
        this.$store.commit('updatePosts', res);
      } catch (e) {
        this.searching = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  font-weight: 400;
}

header h3, h5 {
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.post-header {
  display: flex;
  align-items: center;
}

.post-header div {
  display: block;
  min-width: 280px;
}

article p {
  font-size: smaller;
}

.search-alerts {
  color: red;
  font-size: small;
}

.search-alerts p {
  font-size: 12px;
  margin: 8px 0px 0px 20px; /* top, right, bottom, left */
}

.placeholder p {
  opacity: 0;
  font-size: 12px;
  margin: 8px 0px 0px 20px; /* top, right, bottom, left */
}
</style>
