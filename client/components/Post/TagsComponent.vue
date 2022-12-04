
<template>
  <section>
    <div class="tags">
      <button
        class="tag"
        :class="{ editableTag: isUsersPost }"
        v-for="tag in post.tags"
        :key="tag._id"
        :tag="tag"
        @click="removeTag(tag)"
      >
        {{tag.name}} <span>x</span>
      </button>
      
      <!-- Must be logged in and author of the post to edit its tags -->
      <div v-if="isUsersPost">
        <div v-if="addingTag">
        <input type="text" 
              :value="newTag"
              @input="newTag = $event.target.value"
        >
        <button @click="addTag()">&#x2713;</button>
        <button @click="stopAddingTag()">&#x2715;</button>
      </div>
      <button v-else-if="allowAddTag" class="add-tag-btn" @click="startAddingTag">+ tag</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TagsComponent',
  props: {
    post: {
      type: Object,
      required: true
    },
    allowAddTag: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      addingTag: false,
      newTag: '',
      alerts: {}, // Displays success/error messages encountered during post modification
    }
  },
  methods: {
    startAddingTag() {
      if (this.isUsersPost) {
        this.addingTag = true;
      }
    },
    stopAddingTag() {
      this.newTag = '';
      this.addingTag = false;
    },
    addTag() {
      /**
       * Add tag to post
       */
      const params = {
        method: 'POST',
        message: 'Successfully added tag!',
        body: JSON.stringify({ name: this.newTag, postId: this.post._id }),
        callback: () => {
          this.stopAddingTag()

          this.$store.commit('refreshPosts');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`tags`, params);
    },
    removeTag(tag) {
      /**
       * Remove tag from post
       */
      console.log("remove tag w/ query param");
      console.log("id - " + tag._id)

      const params = {
        method: 'DELETE',
        message: 'Successfully removed tag!',
        callback: () => {
          this.$store.commit('refreshPosts');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`tags/${tag._id}`, params);
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
    }
  },
  computed: {
    isUsersPost() {
      // If user is signed in and this is their post, they can edit its tags
      return this.$store.state.username && this.post.author === this.$store.state.username;
    }
  }
};
</script>

<style scoped>
.tag {
  background-color: transparent;
  border: solid black 1px;
  border-radius: 20px;
  margin-right: 10px;
  padding: 2px 10px;
}

.tag span {
  display: none;
}

.editableTag:hover span {
  display: inline-block;
}

.add-tag-btn {
  margin-top: 5px;
}
</style>