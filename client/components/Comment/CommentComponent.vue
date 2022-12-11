<template>
  <article
    class="comment"
  >
    <header>
      <h3 class="author">
        @{{ comment.author }}
      </h3>

      <div
        v-if="$store.state.username === comment.author"
        class="actions"
      >
        <button @click="deleteComment">
          🗑️ Delete
        </button>
      </div>
    </header>

    <p
      class="content"
    >
    {{ comment.content }}
    </p>
  </article>
</template>

<script>
  export default {
    name: 'CommentComponent',
    props: {
      // Data from the stored comment
      comment: {
        type: Object,
        required: true
      }
    },
    data() {
        return {}
    },
    methods: {
        deleteComment() {
        /**
         * Deletes this comment.
         */
        const params = {
            method: 'DELETE',
        };
        this.comment_request(params);
        },
        async comment_request(params) {
        /**
         * Submits a request to the comment's endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */ 
        const options = {
            method: params.method, headers: {'Content-Type': 'application/json'}
        };
        console.log(options);
        
        try {
            const r = await fetch(`/api/comments/${this.comment.id}`, options);
            if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
            }
            // console.log(r);

            // add something here to refresh??
            this.$emit('comment_deleted');
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
        },
    },
  };
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment {
  border: 2px solid #EAEAEA;
  padding: 20px;
  position: relative;
  margin: 10px 0px;
  border-radius: 12px;
  width:100%;
}

.content {
  margin-top: 0px;
}
</style>