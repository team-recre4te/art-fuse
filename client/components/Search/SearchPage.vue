<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <header>
      <SearchBar 
        @searched="handleSearch" 
        placeholderText="Search by tag..."
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
    </header>
    <section
      v-if="$store.state.posts.length"
    >
      <PostComponent
        v-for="post in $store.state.posts"
        :key="post._id"
        :post="post"
      />
    </section>
    <article
      v-else
    >
      <h3 v-if="searchTag != ''">
        No posts found with tag <span>{{ searchTag }}</span>
      </h3>
      <h3 v-else-if="!searching"> 
        No posts found
      </h3>
    </article>
  </main>
</template>

<script>
import PostComponent from '@/components/Post/PostComponent.vue';
import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'SearchPage',
  components: {
    PostComponent,
    SearchBar
  },
  data() {
    return {
      searching: false,
      searchTag: '',
      alerts: {}
    };
  },
  methods: {
    async handleSearch(value) {
      if (value.length > 0 && value.trim().length === 0) { // just whitespace in search
        // cannot search for empty string
        const e = ('status', 'empty_text_alert', 'Search text for tag cannot be empty');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
        
        this.searchTag = '';
        return;
      }

      this.searching = true;
      
      // clear old alerts
      this.alerts = {};

      this.searchTag = value.trim();

      this.$store.state.tagFilter = this.searchTag;

      const url = this.searchTag ? `/api/posts/tags?name=${this.searchTag}` : '/api/posts';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.searching = false;

        this.$store.commit('updateTagFilter', this.searchTag);
        this.$store.commit('updatePosts', res);
      } catch (e) {
        this.searching = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  mounted() {
    this.$store.state.tagFilter = '';
    this.$store.commit('refreshPosts');
  }
};
</script>

<style scoped>
.search-alerts {
  color: red;
  font-size: small;
}

.search-alerts p {
  margin: 8px 0px 10px 20px; /* top, right, bottom, left */
}

.placeholder p {
  opacity: 0;
  font-size: small;
  margin: 8px 0px 10px 20px; /* top, right, bottom, left */
}

h3 {
  text-align: center;
}

h3 span {
  color: #9DB5B2;
  font-weight: 500;
}
</style>