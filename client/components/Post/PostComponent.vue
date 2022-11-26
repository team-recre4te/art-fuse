<!-- Reusable component representing a single post and its actions -->

<template>
  <article class="post">
    <header class="post-header">
      <h3>
        {{ post.title }}
      </h3>
      <p>
        By {{ post.author }}
      </p>
    </header>

    <!-- <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    /> -->
    <div
      class="description"
    >
      <h5 class="section-label">Description</h5>
      <p>{{ post.description }}</p>
    </div>

    <div>
      <TagsComponent 
        :post="post"
      />
    </div>

    <h5 
      v-if="post.images && post.images.length > 0"
      class="section-label"
    >
      Images
    </h5>
    <div
      v-for="image in post.images"
      :key="image.index"
    >
      <img :src="image" width="200px"/> 
    </div>

    <div v-if="post.files && post.files.length">
      <h5 class="section-label">Files</h5>
      <div
        v-for="file in post.files"
        :key="file.index"
      >
        <iframe 
          :src="file"
          width=300
          height=400
        >
        </iframe>
      </div>
    </div>

    <div>
      <p class="info">
        {{ post.dateModified != post.dateCreated ? 'Modifed' : 'Posted' }} at {{ postDate }}
        <i v-if="post.edited">(edited)</i>
      </p>
    </div>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>

    <div
      v-if="$store.state.username == post.author"
      class="actions"
    >
      <!-- <button
        v-if="editing"
        @click="submitEdit"
      >
        ✅ Save
      </button>
      <button
        v-if="editing"
        @click="stopEditing"
      >
        🚫 Discard
      </button>
      <button
        v-if="!editing"
        @click="startEditing"
      >
        ✏️ Edit
      </button> -->
      <button v-if="!editing" @click="deletePost">
        🗑️ Delete
      </button>
    </div>
  </article>
</template>

<script>
import TagsComponent from '@/components/Post/TagsComponent.vue';

export default {
  name: 'PostComponent',
  props: {
    // Data from the stored post
    post: {
      type: Object,
      required: true
    }
  },
  components: {
    TagsComponent
  },
  data() {
    return {
      editing: false, // Whether or not this post is in edit mode
      draft: this.post.description, // Potentially-new description for this post
      alerts: {}, // Displays success/error messages encountered during post modification
    };
  },
  mounted() {
    // if (this.post.files.length) {
    //   console.log(this.post)
    // }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this post.
       */
      this.editing = true; // Keeps track of if a post is being edited
      this.draft = this.post.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this post.
       */
      this.editing = false;
      this.draft = this.post.content;
    },
    deletePost() {
      /**
       * Deletes this post.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('refreshPosts');
          
          this.$store.commit('alert', {
            message: 'Successfully deleted post!', status: 'success'
          });
        }
      };
      this.request(`posts/${this.post._id}`, params);
    },
    submitEdit() {
      /**
       * Updates post to have the submitted draft content.
       */
      if (this.post.content === this.draft) {
        const error = 'Error: Edited post content should be different than current post content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited post!',
        body: JSON.stringify({description: this.draft}),
        callback: () => {
          this.editing = false;
          this.$store.commit('refreshPosts');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`posts/${this.post._id}`, params);
    },
    async request(path, params) {
      /**
       * Submits a request to the post's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/${path}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    convertDate(date) {
      var d = new Date(date);
      return d.toLocaleString();
    }
  },
  computed: {
    // postAuthorUsername() {
    //   return this.post.authorId.username;
    // },
    // postParentUsername() {
    //   return this.post.parentId.username;
    // },
    postDate() {
      // return this.convertDate(this.post.dateCreated);
      return this.post.dateCreated;
    }
  }
};
</script>

<style scoped>
.post {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    margin: 10px 0px;
    border-radius: 15px;
}

.author {
  margin: 0px;
  padding-right: 15px;
}

.post-header h3 {
  margin: 0px;
}

.post-header p {
  margin-top: 10px;
  font-size: smaller;
}

.info {
  font-size: small;
  margin-bottom: 0px;
  color: #3B413C;
}

.actions {
  display: flex;
  align-items: center;
}

.actions p {
  margin-bottom: 3px;
}

.description {
  width: 100%;
  resize: vertical;
}

.section-label {
  margin: 0px;
}

.description p {
  margin-top: 5px;
}
</style>
