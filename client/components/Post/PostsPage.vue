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
          <div class="columns">
          <div class="category-btn">
            <!-- <button style="background-color: #3e7ddc" @click="getDigitalArt">Digital Art</button> -->
            <!-- <button v-else style="background-color:#ca3edc" @click="getDigitalArt">Digital Art</button> -->
            <button v-if="category === 'Digital Art'" @click="getDigitalArt" style="background-color: #3E7DDC;">Digital Art</button>
            <button v-else @click="getDigitalArt">Digital Art</button>
            
            <button v-if="category === 'Music'" @click="getMusic" style="background-color: #3E7DDC;">Music</button>
            <button v-else @click="getMusic">Music</button>

            <button v-if="category === 'Dance'" @click="getDance" style="background-color: #3E7DDC;">Dance</button>
            <button v-else @click="getDance">Dance</button>
            
            <button v-if="category === '3D Modeling'" @click="get3DModeling" style="background-color: #3E7DDC;">3D Modeling</button>
            <button v-else @click="get3DModeling">3D Modeling</button>
            
            <button v-if="category === 'Drawing & Painting'" @click="getDrawingPainting" style="background-color: #3E7DDC;">Drawing & Painting</button>
            <button v-else @click="getDrawingPainting">Drawing & Painting</button>
            
            <button v-if="category === 'Theater'" @click="getTheater" style="background-color: #3E7DDC;">Theater</button>
            <button v-else @click="getTheater">Theater</button>
          </div>
        </div>
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
        <div>

        </div>
      </header>
      <section
        v-if="$store.state.posts.length"
      >
        <PostComponent
          v-for="post in posts"
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
      alerts: {},
      category: '',
      posts:  this.$store.state.posts, 
    };
  },
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshPosts');
  },
  methods: {
    getDigitalArt() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = 'Digital Art';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    getMusic() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = 'Music';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    getDance() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = 'Dance';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    get3DModeling() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = '3D Modeling';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    getDrawingPainting() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = 'Drawing & Painting';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    getTheater() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (this.category == '') {
        this.category = 'Theater';
        this.request(`/api/categories?name=${this.category.trim()}`, params);
      } else {
        this.category = '';
        this.posts = this.$store.state.posts;
      }
    },
    async request(path, params) {
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(path, options);
        console.log("r", r);
        const res = await r.json();
        console.log("res", res);
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.posts = res;
      } catch (e) {

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

    },
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
.columns {
  display: flex;
  justify-content: space-between;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.btn-group {

}
.category-btn button {
  background-color: #3e7ddc4e;
  border: none; 
  color: white; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 10px;
}

.category-btn button:hover {
  background-color: #3E7DDC;
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

.post-header h3 {
  margin-top: 0px;
  margin-bottom: 22px;
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
