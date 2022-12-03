<!-- Default page that also displays posts -->

<template>
  <main>
    <CreatePostForm />
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

import CreatePostForm from '@/components/Post/CreatePostForm.vue';

export default {
  name: 'CreatePostPage',
  components: {CreatePostForm},
};
</script>

<style scoped>
main {
  margin-top: 40px;
}
</style>