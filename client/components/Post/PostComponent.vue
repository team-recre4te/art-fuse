<!-- Reusable component representing a single post and its actions -->

<template>
    <div v-if="(postIsReported && !viewPost)" class="blur">
      <span>
        <div style="font-weight: bold; font-size: 24px;">🚩 Reported: {{post.reports[0].reportType}}</div>
        <div><button style="border-radius: 20px; font-size: 20px; border: none; background-color: #904D29; color: white; padding: 8px;" @click="(viewPost = true)">View Post</button></div>
      </span>
    </div>
    
    <article v-else class="post">
    <div :class="{'overlay-reported': postIsReported}">
    </div>
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
              🚫 Discard Changes
            </button>
            <button
              v-if="!editing"
              @click="startEditing"
              class="top-buttons"
            >
              ✏️ Edit
            </button>
            <button v-if="!editing" @click="deletePost" class="top-buttons">
              🗑️ Delete
            </button>
          </div>
        </div>
        <p class="posted-by">
          By
          <router-link class="author-link" :to="{ name: 'Profile', query: { author: post.author }}">
            {{ post.author }}
          </router-link>
        </p>
      </div>
      <div>
        <router-link 
          v-if="$store.state.username" class="remix-btn"
          :to="{ name: 'Create Remix', params: {postId: post._id} }"
        >
          Make Remix
        </router-link>
      </div>
    </header>

    <div class="columns">
      <div :class="{ 'post-info': post.images.length > 0 }">
        <!-- Category, parent post, description, and tags on right side -->
        <h5 v-if="post.parentId" class="section-label" style="margin-top: 10px;">Remixed From</h5>
        <p v-if="post.parentId" style="margin: 5px 0px;">{{ post.parentId.title }}</p>

        <!-- <h5 class="section-label">Description</h5> -->
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

        <div v-if="editing" class="columns">
          <div class="category-btn-edit" v-if="draftCategory === 'Digital Art'" >Digital Art</div>
          <div class="category-btn-edit" v-else @click="editDigitalArt">Digital Art</div>
            
          <div class="category-btn-edit" v-if="draftCategory === 'Music'" >Music</div>
          <div class="category-btn-edit" v-else @click="editMusic">Music</div>

          <div class="category-btn-edit" v-if="draftCategory === 'Dance'" >Dance</div>
          <div class="category-btn-edit" v-else @click="editDance">Dance</div>
        
          <div class="category-btn-edit" v-if="draftCategory === '3D Modeling'" >3D Modeling</div>
          <div class="category-btn-edit" v-else @click="edit3DModeling">3D Modeling</div>
        
          <div class="category-btn-edit" v-if="draftCategory === 'Drawing Painting'" >Drawing & Painting</div>
          <div class="category-btn-edit" v-else @click="editDrawingPainting">Drawing & Painting</div>
          
          <div class="category-btn-edit" v-if="draftCategory === 'Theater'" >Theater</div>
          <div class="category-btn-edit" v-else @click="editTheater">Theater</div>
        </div>
        <div v-else-if="(post.category && post.category.name !== '')" class="columns">
          <div class="category-btn">
            <button v-if="selected" @click="getCategoryPosts" >{{post.category.name}}</button>
            <button v-else @click="getCategoryPosts">{{post.category.name}}</button>
          </div>
        </div>

        <div>
          <TagsComponent 
            ref="tagsChildRef"
            @searchFor="handleSearch" 
            :post="post"
            :editing="editing"
            :displayInline="false"
            :searchText="searchText"
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
              :key="image.name"
              :src="image.file"
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
              <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="image.file">
            </template>
          </slide>
        </carousel-3d>
      </div>
    </div>

    <div class="columns align-bottom">
      <div>
        <!-- Files -->
        <div v-if="(postFilesToDisplay.length) || editing">
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

                <audio v-if="['ogg', 'mp3', 'wav'].includes(file.name.split('.')[1]) && !editing" controls>
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
              💛 {{ post.likes.length }} {{ post.likes.length == 1 ? 'Like' : 'Likes' }}
            </button>
            <button
              v-else
              @click="likePost"
              class="icon-btn"
            >
              ♡ {{ post.likes.length }} {{ post.likes.length == 1 ? 'Like' : 'Likes' }}
            </button>
          </div>
          <div v-else>
            <p>💛 {{ post.likes.length }} {{ post.likes.length == 1 ? 'Like' : 'Likes' }}</p>
          </div>
        </div>
      </div>
      <div class="right-border">
        <!-- Comments -->
        <button
          style="border: 0px;"
          @click="showComments = !showComments" class="icon-btn">
          💬 {{post.comments.length}} Comments
        </button>
      </div>
      <div class="right-border">
        <!-- Remixes -->
        <router-link class="remixes-link" :to="{ name: 'Remixes', query: { postId: post._id }}">
          🔀 {{ post.remixes.length }} Remixes
        </router-link>
      </div>
      
      <div style="border-bottom-right-radius: 10px;" v-if="$store.state.username && !postIsReported">
        <!-- Report -->
        <div>
          <div class="actions">

            <b-dropdown :triggers="['hover']" aria-role="list" paddingless="true">
            <template #trigger>
                <b-button
                    label="🚩 Report "
                    icon-right="menu-down" 
                    class="icon-btn"/>
            </template>

            <b-dropdown-item aria-role="listitem" @click="reportPost('Plagiarism')">Plagiarism</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="reportPost('Offensive/ Inappropriate Content')">Offensive/ Inappropriate Content</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="reportPost('Unrelated Content')">Unrelated Content</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="reportPost('Other')">Other</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="actions" v-else-if="postIsReported">
      <button style="border: none; background-color: transparent" @click="(viewPost = false)">
        <!-- Reported -->
        <p>
          🚩 Hide Post
        </p>
      </button>
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
        v-if="post.comments.length"
      >
        <CommentComponent
          v-for="comment in post.comments"
          :key="comment.id"
          :comment="comment"
          @comment_deleted="getComments"
        />
      </section>
      <article
        v-else
      >
        <h3 v-if="$store.state.username">No Comments, write the first!</h3>
        <h3 v-else>No Comments. <router-link to="/login">Sign in</router-link> to write one!</h3>
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
import Vue from 'vue'
import Buefy from 'buefy'
import Dropdown from 'buefy'
import 'buefy/dist/buefy.css'
import { Carousel3d, Slide } from 'vue-carousel-3d';
import TagsComponent from '@/components/Post/TagsComponent.vue';
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';
Vue.use(Dropdown)

export default {
  name: 'PostComponent',
  props: {
    // Data from the stored post
    post: {
      type: Object,
      required: true
    },
    searchText: {
      type: String,
      required: false
    },
    getDigitalArt: {
      type: Function, 
      required: false
    },
    getMusic: {
      type: Function, 
      required: false
    },
    getDance: {
      type: Function, 
      required: false
    },
    get3DModeling: {
      type: Function, 
      required: false
    },
    getDrawingPainting: {
      type: Function, 
      required: false
    },
    getTheater: {
      type: Function, 
      required: false
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  components: {
    TagsComponent,
    Dropdown,
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
      draftCategory: '',
      showRemixes: false,
      viewPost: false,
    };
  },
  methods: {
    view() {
      this.viewPost = true;
    },
    handleSearch(value) {
      this.$emit('searchFor', value);
    },
    getCategoryPosts() {
      switch (this.post.category.name) {
        case 'Digital Art':
          this.getDigitalArt();
          break;
        case 'Music': 
          this.getMusic();
          break;
        case 'Dance':
          this.getDance();
          break;
        case '3D Modeling':
          this.get3DModeling();
          break;
        case 'Drawing Painting':
          this.getDrawingPainting();
          break;
        case 'Theater':
          this.getTheater();
          break;
      }
    },
    startEditing() {
      /**
       * Enables edit mode on this post.
       */
      this.editing = true; // Keeps track of if a post is being edited
      this.draftTitle = this.post.title;
      this.draftDesc = this.post.description; // The content of our current "draft" while being edited
      this.draftFiles = this.post.files.slice();
      this.draftImages = this.post.images.slice();
      this.$refs.tagsChildRef.draftTags = this.post.tags.slice();
      this.draftCategory = this.post.category ? this.post.category.name : '';
    },
    editDance() {
      this.draftCategory = "Dance";
      return;
    },
    editDigitalArt() {
      this.draftCategory = "Digital Art";
      return;
    },
    editDrawingPainting() {
      this.draftCategory = "Drawing Painting";
      return;
    },
    edit3DModeling() {
      this.draftCategory = "3D Modeling";
      return;
    },
    editMusic() {
      this.draftCategory = "Music";
      return;
    },
    editTheater() {
      this.draftCategory = "Theater";
      return;
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
        callback: (res) => {
          this.liking = false;
          this.post.likes.push(res.like);
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
          // TODO: make unlike faster ??
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
    reportPost(reportType) {
      const params = {
        method: 'POST',
        message: 'Successfully reported post!',
        body: JSON.stringify({postId: this.post._id, reportType: reportType}),
        callback: (res) => {
          this.post.reports.push(res.report)
        }
      }
      this.request(`reports/`, params);
    },
    submitEdit() {
      /**
       * Updates post to have the submitted draft content.
       */
      // Check if description, title, or number of files/images was edited
      var postEdited = this.post.description !== this.draftDesc || this.post.title !== this.draftTitle || this.post.images.length != this.draftImages.length || this.post.files.length != this.draftFiles.length || this.draftCategory != (this.post.category && this.post.category.name);

      if (!postEdited) {
        // Check if images, files, or tags were edited
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
        const draftTagNames = this.$refs.tagsChildRef.draftTags.map(tag => { return tag.name });
        const postTagNames = this.post.tags.map(tag => { return tag.name });
        draftTagNames.forEach(tag => {
          if (!postTagNames.includes(tag)) {
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

      if (this.post.category.name !== this.draftCategory) {
        this.post.category.name = this.draftCategory;
        const params = {
          method: 'PATCH',
          message: 'Successfully edited category!',
          body: JSON.stringify({ 
            name: this.draftCategory, 
          }),
          callback: () => {}
        };
        this.request(`categories/${this.post.category._id}`, params);
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

      this.$refs.tagsChildRef.saveTags(this.post._id);
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
          this.post.comments = res;
        }

        params.callback(res);
      } catch (e) {
        this.liking = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
  computed: {
    postDate() {
      return this.post.dateModified != this.post.dateCreated ? this.post.dateModified : this.post.dateCreated;
    },
    isLiked() {
      return this.postLikedBy.includes(this.$store.state.username);
    },
    postLikedBy() {
      return this.post.likes.map(like => { return like.userId.username });
    },
    postFilesToDisplay() {
      return this.editing ? this.draftFiles : this.post.files.concat(this.post.images);
    },
    postImagesToDisplay() {
      return this.editing ? this.draftImages : this.post.images;
    },
    postIsReported() {
      return this.post.reports ? this.post.reports.length > 0 : false;
    }
  },
};
</script>

<style scoped>
.blur {
  position:relative;
  height: 300px;
  padding: 20px;
  position: relative;
  margin: 10px 0px;
  border-radius: 12px;
  border: 2px solid #EAEAEA;
  width:100%;
}

.blur:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e8e8e8cd;
  filter: blur(20px);
  z-index:0;
}
.blur span {
  position:relative;
  display: table;
  text-align: center;
  margin: 80px auto;
  z-index:1;
}

h3 {
  border-radius: 20px;
  font-size: 24px;
  font-weight: bold;
}
.posted-by{
  font-size: 20px;
}

.description{
  font-size: 18px;
}
.top-buttons button{
  border-width: 0px; 
  border-radius: 10px;
  font-size: 16px;
  padding: 5px 20px 5px 10px;
}

.top-buttons button:hover{
  opacity: 0.8;
}
.category-btn-edit{
  background-color: #923edcab;
  border: none; 
  color: white; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-right: auto;
}

.category-btn-edit :hover{
  background-color: #923edc;
}

.category-btn button {
  background-color: #923edcab;
  border: none; 
  color: white;
  margin-top: 100px; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 20px;
}

.category-btn button:hover {
  background-color: #923edc;
}


.post {
  border: 2px solid #EAEAEA;
  padding: 30px;
  padding-bottom: 10px;
  position: relative;
  margin: 10px 0px;
  border-radius: 12px;
  width:100%;
}

.author {
  font-size: 20px;
  margin: 0px;
  padding-right: 15px;
}

.columns {
  display: flex;
  margin-left: 0px;
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

/* .overlay-reported{
  background-color: rgba(0,0,0.5);
  padding: 20px;
  margin: 10px 0px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  position:relative;
  
} */

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
  font-size: 20px;
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
  padding-left: 0px;
}

.files-btn:hover {
  opacity: 0.8;
}

.description {
  width: 100%;
  resize: vertical;
}

.section-label {
  margin: 0px;
  margin-top: 10px;
}

.description p {
  margin-top: 5px;
  margin-bottom: 0px;
}

.icon-btn {
  border: none;
  background-color: transparent;
  margin-block-start: 1em;
  margin-block-end: 1em;
  font-size: 14px;
}

.author-link {
  font-size: 20px;
  color: #904D29;
}

.author-link:hover {
  font-size: 20px;
  opacity: 0.6;
}

.remixes-link {
  color: black;
  font-size: 14px;
  text-decoration: none;
}

.disabled {
  pointer-events:none; 
 }
</style>