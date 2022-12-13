<!-- Default page that also displays posts -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <div style="font-size: 40px; padding-top: 30px; ">Welcome @{{ $store.state.username }}</div>
      </header>
    </section>
    <section v-else style="height: 100vh;">
      <div class = "row" style="height: 85vh;" id="info">

        <div class="first-column">
        <header>
        <h2 class="info-header"> <em> 'Explore. Exchange. Transform.' </em> </h2>
        </header>

        <p class = "info-text">
        <em>
        ArtFuse is a platform for remixes to happen much earlier in the creative process and for a wider range of mediums, not just music. It is built on three core values: collaboration, openness, and community, and challenges one fundamental question, “how far can an idea go?”
        </em>
        </p>

        <br>
       
        <p class = "info-text-bottom">
        <em>
          Ultimately, we want collaboration to go beyond ArtFuse and hope that artists can build lifelong connections through the framework we have provided. We are excited for you to join us on this journey.
        </em>
        </p>
        </div>
        
        <div class="second-column">

        <!-- <header>
        <h2  class="create-account-header">Join ArtFuse</h2>
        </header> -->

        <section class="create-account-form">
        <RegisterForm />
        Already have an account? <router-link to="/login">Log in</router-link>.
        </section>
        </div>

      </div>

      <div class="row" style="height: 15vh;" id="scrollBtn">
        <button onclick="document.getElementById('posts').scrollIntoView({behavior: 'smooth'});" id="myBtn" title="Browse Posts">Browse Posts ⬇️</button>
      </div>
        
  
    </section>

    <section>
      <header class="post-header" id="posts">
        <div>
          <SearchBar 
            @searched="handleSearch" 
            :currentSearchText="search"
            placeholderText="Search by author or tag..."
          />

          <div class="columns">
            <div class="category-btn">
              <button v-if="Object.keys(postsInCategory).includes('Digital Art')" @click="getDigitalArt" style="background-color: #923edc;">Digital Art</button>
              <button v-else @click="getDigitalArt">Digital Art</button>
              
              <button v-if="Object.keys(postsInCategory).includes('Music')" style="background-color: #923edc;" @click="getMusic" >Music</button>
              <button v-else @click="getMusic">Music</button>

              <button v-if="Object.keys(postsInCategory).includes('Dance')" @click="getDance" style="background-color: #923edc;">Dance</button>
              <button v-else @click="getDance">Dance</button>
              
              <button v-if="Object.keys(postsInCategory).includes('3D Modeling')" @click="get3DModeling" style="background-color: #923edc;">3D Modeling</button>
              <button v-else @click="get3DModeling">3D Modeling</button>
              
              <button v-if="Object.keys(postsInCategory).includes('Drawing Painting')" @click="getDrawingPainting" style="background-color: #923edc;">Drawing & Painting</button>
              <button v-else @click="getDrawingPainting">Drawing & Painting</button>
              
              <button v-if="Object.keys(postsInCategory).includes('Theater')" @click="getTheater" style="background-color: #923edc;">Theater</button>
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
      </header>

      <section
        v-if="($store.state.posts.length && !Object.keys(postsInCategory).length)"
      >
        <PostComponent
          v-for="post in $store.state.posts"
          :key="post.id"
          :post="post"
          :searchText="search"
          @searchFor="handleSearch"
          :selected="selected"
          :getDigitalArt="getDigitalArt"
          :getMusic="getMusic"
          :getDance="getDance"
          :get3DModeling="get3DModeling"
          :getDrawingPainting="getDrawingPainting"
          :getTheater="getTheater"
        />
      </section>
      <section
        v-else-if="(Object.keys(postsInCategory).length)"
      >
        <div v-if="currentCategoryPosts.length">
          <PostComponent
            v-for="post in currentCategoryPosts"
            :key="post.id"
            :post="post"
            :searchText="search"
            @searchFor="handleSearch"
            :selected="selected"
            :getDigitalArt="getDigitalArt"
            :getMusic="getMusic"
            :getDance="getDance"
            :get3DModeling="get3DModeling"
            :getDrawingPainting="getDrawingPainting"
            :getTheater="getTheater"
          />
        </div>
        <div v-else>
          No posts in selected category
        </div>
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
import RegisterForm from '@/components/Login/RegisterForm.vue';

export default {
  name: 'PostsPage',
  components: {
    PostComponent, 
    SearchBar,
    RegisterForm
  },
  data() {
    return {
      searching: false,
      search: '',
      alerts: {},
      category: '',
      selected: false,
      postsInCategory: {},
      currentCategoryPosts: [],
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

      if (!Object.keys(this.postsInCategory).includes('Digital Art')) {
        this.category = 'Digital Art';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['Digital Art'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
      }
    },
    getMusic() {
      const params = {
        method: 'GET',
        callback: () => {},
      };
      if (!Object.keys(this.postsInCategory).includes('Music')) {
        this.category = 'Music';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['Music'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
      }
    },
    getDance() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (!Object.keys(this.postsInCategory).includes('Dance')) {
        this.category = 'Dance';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['Dance'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
      }
    },
    get3DModeling() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (!Object.keys(this.postsInCategory).includes('3D Modeling')) {
        this.category = '3D Modeling';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['3D Modeling'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
      }
    },
    getDrawingPainting() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (!Object.keys(this.postsInCategory).includes('Drawing Painting')) {
        this.category = 'Drawing Painting';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['Drawing Painting'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
      }
    },
    getTheater() {
      const params = {
        method: 'GET',
        callback: () => {},
      };

      if (!Object.keys(this.postsInCategory).includes('Theater')) {
        this.category = 'Theater';
        this.postsInCategory[this.category] = [];
        this.request(`/api/categories?name=${this.category.trim()}`, params);
        this.selected = true;
      } else {
        delete this.postsInCategory['Theater'];
        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        this.selected = Object.keys(this.postsInCategory).length === 0 ? false : true;
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
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        console.log("this.category", this.category);
        this.postsInCategory[this.category] = res;

        this.currentCategoryPosts = [];
        for (const arr of Object.values(this.postsInCategory)) {
          console.log("arr", arr);
          for (const post of arr) {
            this.currentCategoryPosts.push(post);
          }
        }
        console.log('this.currentCategoryPosts', this.currentCategoryPosts);
        console.log("Object.keys(postsInCategory).includes('Music')", Object.keys(this.postsInCategory).includes('Music'));
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
        
        this.search = '';
        return;
      }

      this.searching = true;
      
      // clear old alerts
      this.alerts = {};

      this.search = value.trim();

      this.$store.state.filter = this.search;

      const author_url = this.search ? `/api/posts?author=${this.search}` : '/api/posts';
      const tag_url = this.search ? `/api/tags?name=${this.search}` : '/api/posts';

      
      try {
        const author_r = await fetch(author_url);
        const author_res = await author_r.json();

        if (!author_r.ok) {
          throw new Error(author_res.error);
        }
        
        if (author_url === '/api/posts') {
          this.searching = false;
          this.$store.commit('updateFilter', this.search);
          this.$store.commit('updatePosts', author_res);
          return;
        }

        const tag_r = await fetch(tag_url);
        const tag_res = await tag_r.json();
        if (!tag_r.ok) {
          throw new Error(tag_res.error);
        }

        this.searching = false;

        const res = author_res.concat(tag_res);
        this.$store.commit('updateFilter', this.search);
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
  margin-left: 0px;
  margin-top: 0px;
}

.first-column, .second-column {
  float: left;
  width: 50%;
  height: 85vh;
  padding-left: 5%;
  padding-right: 5%;
  overflow:scroll;
}

.first-column{
  border-right: 1px solid black;
  padding-top: 20vh;
}

.second-column{
  padding-top: 20vh;
}

#info {
  background-color: #FFECBC;
  margin-left: -5em;
  margin-right: -5em;
  height: 80vh;
}

#scrollBtn{
  height: 20vh;
  background-color: #FFECBC;
  margin-left: -5em;
  margin-right: -5em;
  text-align: center;
  padding: 2%;
}

#myBtn{
  border: none;
  background: none;
  font-size: 15px;
  font-weight: bold;
}

#myBtn:hover {
  color: #923edc;
  cursor: pointer;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.create-account-header, .info-header{
  /* padding-top: 30%; */
  padding-bottom: 4%;
  font-weight: bold;
  font-size: 22px;
  /* overflow:hidden; */
}

.create-account-form{
  padding-bottom: 5%;
  overflow:scroll;
}

.info-text{
  /* font-size: 2.2vh; */
  overflow:scroll;
}

.info-text-bottom{
  /* font-size:  2.2vh; */
  margin-bottom: 20%;
  overflow:hidden;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.category-btn button {
  background-color: #923edcab;
  border: none; 
  color: white; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 10px;
}

.category-btn button:hover {
  background-color: #923edc;
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
  align-items: flex-start;
  flex-direction: column;
  padding: 30px;
}

.post-header div {
  display: block;
  min-width: 280px;
  width: 100%;
}

.post-header h3 {
  margin-top: 0px;
  margin-bottom: 20px;
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
