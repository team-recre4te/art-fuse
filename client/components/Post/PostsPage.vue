<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreatePostForm />
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
        <h3>All Posts</h3>
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
import CreatePostForm from '@/components/Post/CreatePostForm.vue';

export default {
  name: 'PostsPage',
  components: {PostComponent, CreatePostForm},
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshPosts');
  },
  computed: {
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

article p {
  font-size: smaller;
}
</style>
