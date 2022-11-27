<!-- Reusable component representing a single post and its actions -->

<template>
  <article class="post">
    <header class="post-header">
      <input
        v-if="editing"
        type="text"
        :value="draftTitle"
        @input="draftTitle = $event.target.value"
      >
      <h3 v-else>
        {{ post.title }}
      </h3>
      <p>
        By {{ post.author }}
      </p>
    </header>

    <div v-if="(post.images && post.images.length > 0) || editing">
      <h5 class="section-label">
        Images
      </h5>
      <div v-if="editing">
        <input 
          type="file"
          id="images"
          name="images"
          accept="image/png, image/jpeg, image/webp"
          @change="uploadImages($event)"
          ref="images"
          style="display: none"
          multiple
        >
        <input type="button" value="Choose images" @click="$refs['images'].click()" />
        <div>
          <img 
            v-for="image in draftImages"
            :key="image"
            :src="image"
            height=200
            alt=""
          >
        </div>
        <button v-if="draftImages.length" type="button" @click="clearImages()">Clear Images</button>
      </div>
      <!-- https://wlada.github.io/vue-carousel-3d/api/ -->
      <carousel-3d v-else>
        <slide class="slide" v-for=" (image, i) in postImagesToDisplay" :index="i" :key="i">
          <template slot-scope="{ index, isCurrent, leftIndex, rightIndex}">
            <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="image">
          </template>
        </slide>
      </carousel-3d>
    </div>

    <h5 class="section-label">Description</h5>
    <textarea
      v-if="editing"
      class="description"
      :value="draftDesc"
      @input="draftDesc = $event.target.value"
    />
    <div
      v-else
      class="description"
    >
      <p>{{ post.description }}</p>
    </div>

    <div>
      <TagsComponent 
        :post="post"
      />
    </div>

    <div class="actions">
      <div v-if="$store.state.username">
        <button
          v-if="isLiked"
          @click="unlikePost"
          class="icon-btn"
        >
          <img src="../../public/assets/heart_filled.png" alt="">
        </button>
        <button
          v-else
          @click="likePost"
          class="icon-btn"
        >
          <img src="../../public/assets/heart_outline.png" alt="">
        </button>
      </div>
      <p>
        {{ post.likedBy.length }} {{ post.likedBy.length == 1 ? 'Like' : 'Likes' }}
      </p>
    </div>

    <div v-if="(post.files && post.files.length) || editing">
      <h5 class="section-label">Files</h5>
      <div v-if="editing">
        <input 
          type="file"
          id="files"
          name="files"
          @change="uploadFiles($event)"
          ref="files"
          style="display: none"
          multiple
        >
        <input type="button" value="Choose files" @click="$refs['files'].click()" />
      </div>
      <ul>
        <li v-for="file in postFilesToDisplay" :key="file.index">
          <a :download="file.name" :href="file.file">{{file.name}}</a>
        </li>
      </ul>
      <button v-if="editing && postFilesToDisplay.length" type="button" @click="clearFiles()">Clear Files</button>
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
      <button
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
      </button>
      <button v-if="!editing" @click="deletePost">
        🗑️ Delete
      </button>
    </div>

    <button
      style="background-color: white; border: 0px;"
      @click="showComments = !showComments">
      💬 {{comments.length}} Comments
    </button>

    <div v-if="showComments">
      <section v-if="$store.state.username">
        <CreateCommentForm
        :postId=post._id
        />
      </section>
      <section
        v-if="comments.length"
      >
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        />
      </section>
      <article
        v-else
      >
        <h3>No Comments, write the first!</h3>
      </article>
    </div>
  </article>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d';
import TagsComponent from '@/components/Post/TagsComponent.vue';
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

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
    TagsComponent,
    CommentComponent, 
    CreateCommentForm,
    Carousel3d,
    Slide
  },
  data() {
    return {
      editing: false, // Whether or not this post is in edit mode
      liking: false,
      draftTitle: this.post.title, // Potentially-new title for this post
      draftDesc: this.post.description, // Potentially-new description for this post
      draftFiles: this.post.files, // Potentially updated files for this post
      draftImages: this.post.images, // Potentially updated images for this post
      alerts: {}, // Displays success/error messages encountered during post modification
      showComments: false,
      comments: [],
    };
  },
  mounted() {
    // console.log(this.post)
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this post.
       */
      this.editing = true; // Keeps track of if a post is being edited
      this.draftTitle = this.post.title;
      this.draftDesc = this.post.description; // The content of our current "draft" while being edited
      this.draftFiles = this.post.files.slice();
      this.draftImages = this.post.images.slice();
    },
    stopEditing() {
      /**
       * Disables edit mode on this post.
       */
      this.editing = false;
    },
    likePost() {
      /**
       * Likes this post.
       */
      const params = {
        method: 'POST',
        message: 'Successfully liked post!',
        body: JSON.stringify({postId: this.post._id}),
        callback: () => {
          this.liking = false;
          this.$store.commit('refreshPosts');
        }
      };

      // If already liking/unliking ignore, once that has finished then accept new requests to like/unlike
      if (!this.liking) {
        this.request(`likes/`, params);
        this.liking = true;
      }
    },
    unlikePost() {
      /**
       * Unlikes this post.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unliked post!',
        callback: () => {
          this.liking = false;
          this.$store.commit('refreshPosts');
        }
      };

      // If already liking/unliking ignore, once that has finished then accept new requests to like/unlike
      if (!this.liking) {
        this.request(`likes/${this.post._id}`, params);
        this.liking = true;
      }
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
      this.comments = [];
      this.request(`posts/${this.post._id}`, params);
    },
      getComments() {
      /**
       * Get the comments for the freet
       */
      const params = {
        method: 'GET',
        callback: () => {}
      };      
      this.request(`comments?postId=${this.post._id}`, params);
    },
    clearImages() {
      this.draftImages = [];
      this.$refs["images"].value = '';
    },
    clearFiles() {
      this.draftFiles = [];
      this.$refs["files"].value = null;
    },
    uploadImages(e){
      Array.from(e.target.files).forEach(image => { 
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
          this.draftImages.push(e.target.result);
        };
      });
    },
    uploadFiles(e) {
      Array.from(e.target.files).forEach(file => { 
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e =>{
          this.draftFiles.push({ name: file.name, file: e.target.result });
        };
      });
    },
    submitEdit() {
      /**
       * Updates post to have the submitted draft content.
       */
      // Check if description, title, or number of files/images was edited
      var postEdited = this.post.description !== this.draftDesc || this.post.title !== this.draftTitle || this.post.images.length != this.draftImages.length || this.post.files.length != this.draftFiles.length;

      if (!postEdited) {
        // Check if images or files were edited
        this.draftImages.forEach(image => {
          if (!this.post.images.includes(image)) {
            postEdited = true;
          }
        });
        this.draftFiles.forEach(file => {
          if (!this.post.files.includes(file)) {
            postEdited = true;
          }
        });
      }

      if (!postEdited) {
        const error = 'Error: Edited post should be different than original post.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited post!',
        body: JSON.stringify({ 
          title: this.draftTitle, 
          description: this.draftDesc,
          files: this.draftFiles,
          images: this.draftImages
        }),
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

        if (path === `comments?postId=${this.post._id}`) {
          const comments = [];

          for (var i = 0; i < res.length; i++) {
            comments.push({author: res[i]['user'], content: res[i]['content'], dateCreated: res[i]['dateCreated'], id:  res[i]['_id'], freetId:  res[i]['freetId']});
          }
          this.comments = comments;
        }
        params.callback();
      } catch (e) {
        this.liking = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
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
      return this.post.dateCreated;
    }
  },
  created() {
    this.getComments();
  },
  updated() {
    this.getComments();
    },
    isLiked() {
      return this.postLikedBy.includes(this.$store.state.username);
    },
    postLikedBy() {
      return this.post.likedBy.map(like => { return like.userId.username });
    },
    postFilesToDisplay() {
      return this.editing ? this.draftFiles : this.post.files;
    },
    postImagesToDisplay() {
      return this.editing ? this.draftImages : this.post.images;
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
    border-radius: 12px;
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
  margin-top: 3px;
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

.icon-btn {
  border: none;
  background-color: transparent;
}

.icon-btn img {
  height: 24px;
}

.slide img {
  width: auto;
  height: 100%;
}

.slide {
  text-align: center;
  border: none;
  background-color: #EAEAEA;
}
</style>
