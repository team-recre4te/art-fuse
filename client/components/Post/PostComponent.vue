<!-- Reusable component representing a single post and its actions -->

<template>
  <article class="post">
    <header class="post-header columns">
      <div>
        <div class="top-bar">
          <input
            v-if="editing"
            type="text"
            :value="draftTitle"
            @input="draftTitle = $event.target.value"
          >
          <h3 v-else>
            {{ post.title }}
          </h3>

          <div
            v-if="$store.state.username == post.author"
            class="top-bar-btns"
          >
            <button
              v-if="editing"
              @click="submitEdit"
            >
              ✅ Save Changes
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
        </div>
        <p>
          By
          <router-link class="author-link" :to="{ name: 'Profile', query: { author: post.author }}">
            {{ post.author }}
          </router-link>
        </p>
      </div>
      <div>
        <button class="remix-btn">Make Remix</button>
      </div>
    </header>

    <div class="columns">
      <div class="post-info">
        <!-- Category, parent post, description, and tags on right side -->
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
        <h5 v-if="category" class="section-label">Category</h5>
        <div v-if="category">{{category}}</div>
        <div>
          <TagsComponent 
            :post="post"
            :allowAddTag="!editing"
          />
        </div>
      </div>
      <div v-if="(post.images && post.images.length > 0) || editing" class="post-images">
        <!-- Images on left side -->
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
        <carousel-3d :width="260" :height="215" v-else>
          <slide class="slide" v-for=" (image, i) in postImagesToDisplay" :index="i" :key="i">
            <template slot-scope="{ index, isCurrent, leftIndex, rightIndex}">
              <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="image">
            </template>
          </slide>
        </carousel-3d>
      </div>
    </div>

    <div class="columns align-bottom">
      <div>
        <!-- Files -->
        <div v-if="(post.files && post.files.length) || editing">
          <div v-if="!editing">
            <button 
              class="files-btn"
              @click="showFiles = !showFiles"
            >
              {{ showFiles ? 'Hide Files' : 'Show Files' }}
            </button>
          </div>

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
          <ul v-if="showFiles || editing">
            <li v-for="file in postFilesToDisplay" :key="file.index">
              <div class="file">
                <a :download="file.name" :href="file.file">{{file.name}}</a>

                <audio v-if="['ogg', 'mp3', 'wav'].includes(file.name.split('.')[1])" controls>
                  <source :src="file.file">
                </audio>
              </div>
            </li>
          </ul>
          <button v-if="editing && postFilesToDisplay.length" type="button" @click="clearFiles()">Clear Files</button>
        </div>
      </div>
      <div v-if="!showFiles">
        <p class="info">
          {{ post.dateModified != post.dateCreated ? 'Modifed' : 'Posted' }} at {{ postDate }}
          <i v-if="post.edited">(edited)</i>
        </p>
      </div>
    </div>

    <!-- Posted at ... -->
    <div v-if="showFiles">
      <p class="info">
        {{ post.dateModified != post.dateCreated ? 'Modifed' : 'Posted' }} at {{ postDate }}
        <i v-if="post.edited">(edited)</i>
      </p>
    </div>

    <div class="columns bottom-bar" :class="{ 'bottom-bar-bottom-border': showComments } ">
      <div class="right-border" style="border-bottom-left-radius: 10px; padding: 2px 0px;">
        <!-- Likes -->
        <div>
          <div class="actions" v-if="$store.state.username">
            <button
              v-if="isLiked"
              @click="unlikePost"
              class="icon-btn"
            > 
              💛 {{ post.likedBy.length }} {{ post.likedBy.length == 1 ? 'Like' : 'Likes' }}
            </button>
            <button
              v-else
              @click="likePost"
              class="icon-btn"
            >
              ♡ {{ post.likedBy.length }} {{ post.likedBy.length == 1 ? 'Like' : 'Likes' }}
            </button>
          </div>
          <div v-else>
            <p>💛 {{ post.likedBy.length }} {{ post.likedBy.length == 1 ? 'Like' : 'Likes' }}</p>
          </div>
        </div>
      </div>
      <div class="right-border">
        <!-- Comments -->
        <button
          style="border: 0px;"
          @click="showComments = !showComments" class="icon-btn">
          💬 {{comments.length}} Comments
        </button>
      </div>
      <div class="right-border">
        <!-- Remixes -->
        <p>🔀 0 Remixes</p>
      </div>
      <div style="border-bottom-right-radius: 10px;">
        <!-- Report -->
        <p>🚩 Report</p>
      </div>
    </div>

    <div class="comments-section" v-if="showComments">
      <section v-if="$store.state.username">
        <CreateCommentForm
          :postId=post._id
          @comments_added="getComments"
        />
      </section>
      <section
        v-if="comments.length"
      >
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @comment_deleted="getComments"
        />
      </section>
      <article
        v-else
      >
        <h3>No Comments, write the first!</h3>
      </article>
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
    Carousel3d,
    Slide,
    CommentComponent, 
    CreateCommentForm
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
      showFiles: false,
      category: '',
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
    getCategory() {
      console.log("ran get category");
      const params = {
        method: 'GET',
        callback: () => {}
      };
      this.request(`categories?postId=${this.post._id}`, params);
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
          // console.log(this.comments);
        }

        if (path === `categories?postId=${this.post._id}`) {
          this.category = res[0]["name"] ?? '';
        }
        params.callback();
      } catch (e) {
        this.liking = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
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
  },
  created() {
    this.getCategory();
    this.getComments();
  },
};
</script>

<style scoped>
.post {
  border: 2px solid #EAEAEA;
  padding: 20px;
  position: relative;
  margin: 10px 0px;
  border-radius: 12px;
}

.author {
  margin: 0px;
  padding-right: 15px;
}

.columns {
  display: flex;
  justify-content: space-between;
}

.align-bottom {
  align-items: flex-end;
}

.bottom-bar {
  justify-content: space-evenly;
  align-items: center;
  border-top: 2px solid #EAEAEA;
  margin: 10px -20px;
  padding-bottom: -10px;
  margin-bottom: -20px;
}

.bottom-bar-bottom-border {
  border-bottom: 2px solid #EAEAEA;
}

.bottom-bar > * {
  height: 100%;
  width: 100%;
  text-align: center;
  padding: 2px 0px;
  padding: auto 0;
}

.bottom-bar > *:hover {
  background-color: #EAEAEA;
}

.bottom-bar p {
  font-size: 14px;
}

.right-border {
  border-right: 2px solid #EAEAEA;
}

.comments-section {
  margin-top: 40px;
}

.post-header h3 {
  margin: 0px;
}

.post-header p {
  margin-top: 6px;
  font-size: smaller;
}

.remix-btn {
  background-color: #3E7DDC;
  color: #EAEAEA;
  padding: 5px 15px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
}

.post-images {
  width: 50%;
}

.slide img {
  width: auto;
  height: 100%;
}

.slide {
  text-align: center;
  border: none;
  background-color: #EAEAEA;
  /* margin: 20px; */
}

.post-info {
  width: 50%;
  margin-right: 20px;
}

.info {
  font-size: small;
  margin-bottom: 0px;
  color: #AEAEAE;
  text-align: end;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-bar p {
  margin-bottom: 3px;
  margin-top: 3px;
}

.top-bar-btns {
  margin-left: 20px;
}

.top-bar-btns button {
  margin-right: 10px;
  font-size: 11px;
}

.file {
  display: flex;
  align-items: center;
}

.file audio {
  margin-left: 20px;
  height: 36px;
}

.files-btn {
  border: none;
  background-color: transparent;
  text-decoration: underline;
  color: #CEAD92;
  font-weight: 700;
  font-size: 14px;
  margin-top: 20px;
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
  margin-block-start: 1em;
  margin-block-end: 1em;
  font-size: 14px;
}

.author-link {
  color: #904D29;
}
</style>
