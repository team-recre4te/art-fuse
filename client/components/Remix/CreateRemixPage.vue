<template>
  <main v-if="parentPost">
    <p class="remix-title">Remixing From Post Titled - {{ parentPost.title }}</p>
    <p class="remix-info">Create a post inspired by {{ parentPost.title }}  and share your take on the subject</p>

    <CreateRemixForm :parentId=this.$route.params.postId />
  </main>
  <main v-else>
    Loading...
  </main>
</template>

<script>
import CreateRemixForm from '@/components/Remix/CreateRemixForm.vue';

export default {
  name: 'CreateRemixPage',
  components: {CreateRemixForm},
  data() {
      return {
          parentPost: null,
      }
  },
  methods: {
    async getParentPost() {
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
            const r = await fetch(`/api/posts/id/${this.$route.params.postId}`, options);
            const res = await r.json();
            this.parentPost = res;

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
  mounted() {
      this.getParentPost();
  }
};
</script>
  
<style scoped>
main {
  margin-top: 30px;
}
.remix-title{
  font-size: 24px;
  font-weight: bold;
}

.remix-info {
  margin-bottom: 30px;
}
</style>