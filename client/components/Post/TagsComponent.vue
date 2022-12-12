
<template>
  <section>
    <div class="tags">
      <button
        class="tag"
        :class="{ editableTag: editing, selected: searchText == tag.name }"
        v-for="tag in tagsToDisplay"
        :key="tag._id"
        :tag="tag"
        @click="editing ? removeTagFromDrafts(tag) : searchForTag(tag)"
      >
        #{{tag.name}} <span>x</span>
      </button>
      
      <div v-if="editing" :class="{ 'display-inline': displayInline }">
        <input type="text" 
              :value="newTag"
              @input="newTag = $event.target.value"
        >
        <div>
          <button @click="addTagToDrafts()" style="margin-right: 8px;" type="button">Add Tag</button>
          <button @click="clearAllTagsFromDrafts()" type="button">Clear Tags</button>
        </div>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-else style="opacity: 0;" class="error">placeholder</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TagsComponent',
  props: {
    post: {
      type: Object,
      required: false
    },
    editing: {
      type: Boolean,
      required: true
    },
    displayInline: {
      type: Boolean,
      required: true
    },
    searchText: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      newTag: '',
      draftTags: this.post ? this.post.tags : [],
      errorMessage: '',
      alerts: {}, // Displays success/error messages encountered during post modification
    }
  },
  mounted() {
    this.draftTags = this.post ? this.post.tags.slice() : [];
  },
  methods: {
    addTagToDrafts() {
      this.newTag = this.newTag.trim();
      const draftTagNames = this.draftTags.map(tag => { return tag.name });
      if (this.newTag == '') {
        this.errorMessage = 'Tag name cannot be empty';
        setTimeout(() => this.errorMessage = '', 3000);
      } else if (this.newTag.length > 30) {
        this.errorMessage = 'Tag name cannot be longer than 30 characters';
        setTimeout(() => this.errorMessage = '', 3000);
      } else if (this.newTag.includes(' ')) {
        this.errorMessage = 'Tag name must be one word';
        setTimeout(() => this.errorMessage = '', 3000);
      } else if (draftTagNames.includes(this.newTag)) {
        this.errorMessage = 'Tag already exists';
        setTimeout(() => this.errorMessage = '', 3000);
      } else {
        this.draftTags.push({ name: this.newTag })
        this.newTag = '';
      }
    },
    removeTagFromDrafts(tag) {
      if (this.editing && this.draftTags.includes(tag)) {
        this.draftTags.splice(this.draftTags.indexOf(tag), 1);
      }
    },
    clearAllTagsFromDrafts() {
      this.draftTags = [];
    },
    searchForTag(tag) {
      if (this.searchText == tag.name) {
        // clear old search
        this.$emit('searchFor', '');
      } else {
        // make new search
        this.$emit('searchFor', tag.name);
      }
    },
    saveTags(postId) {
      /**
       * Add tag to post
       */
      if (postId !== undefined) {
        const draftTagNames = this.draftTags.map(tag => { return tag.name });
        const params = {
          method: 'POST',
          message: 'Successfully added tag!',
          body: JSON.stringify({ names: draftTagNames, postId: postId }),
          callback: () => {
            this.$store.commit('refreshPosts');

            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(`tags`, params);
      }
    },
    removeTag(tag) {
      /**
       * Remove tag from post
       */
      if (this.editing) { // must be signed in and author of post to delete its tag
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
      }
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
    tagsToDisplay() {
      return this.editing ? this.draftTags : this.post.tags;
    }
  }
};
</script>

<style scoped>
.tag {
  background-color: transparent;
  border: none;
  margin-right: 5px;
  padding: 0px;
  color: #DCA73E;
  font-size: 16px;
}

.tags {
  margin-top: 10px;
}

.tag span {
  display: none;
}

.tag:hover {
  opacity: 0.6;
}

.editableTag:hover span {
  display: inline-block;
}

.add-tag-btn {
  margin-top: 8px;
  padding: 0px 7px;
  font-size: 12px;
}

.section-label {
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 5px;
}

input {
  margin-right: 5px;
}

.error {
  color: red;
  font-size: 12px;
  margin: 4px 0px 4px 0px; /* top, right, bottom, left */
}

.display-inline {
  display: inline-flex;
}

.selected {
  font-weight: 600;
}
</style>