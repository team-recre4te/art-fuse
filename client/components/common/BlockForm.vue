<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        class="field"
        v-for="field in fields"
        :key="field.id"
      >
        <textarea
          v-if="field.id === 'description'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
          :placeholder="field.placeholder"
        />
        <div v-else-if="field.id === 'files-and-images'">
          <div class="files-and-images">
            <input 
              type="file"
              id="files"
              name="files"
              accept="image/png, image/jpeg, image/webp, audio/mp3, audio/wav, audio/ogg, .pdf"
              @change="uploadFiles($event);"
              ref="files"
              style="display: none"
              multiple
            >
            <div class="upload-section">
              <button class="icon-btn" type="button" @click="$refs['files'][0].click()">
                <img src="../../public/assets/file-upload.png" alt="">
                <p>Supporting Files</p> 
              </button>
              <ul v-if="field.id === 'files-and-images' && files.length" >
                <li style="opacity: 0;">placeholder</li>
                <li v-for="file in files" :key="file.name">
                  {{file.name}}
                </li>
                <button type="button" @click="clearFiles()">Clear Files</button>
              </ul>
            </div>

            <span>/</span>

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
            <div class="upload-section">
              <button class="icon-btn" type="button" @click="$refs['images'][0].click()">
                <img src="../../public/assets/image-icon.png" alt="">
                <p>Displayed Images</p> 
              </button>
              <ul v-if="field.id === 'files-and-images' && images.length">
                <li style="opacity: 0;">placeholder</li>
                <li v-for="image in images" :key="image.name">
                  {{image.name}}
                </li>
                <button type="button" @click="clearImages()">Clear Images</button>
              </ul>
            </div>
          </div>
        </div>
        <div v-else-if="field.id === 'tags'" style="margin-top: -5px;">
          <TagsComponent 
            ref="tagsChildRef"
            :editing="true"
            :displayInline="true"
            :clickable="false"
          />
        </div>
        <div v-else-if="field.id === 'category'" class="category-btn columns">          
          <button v-if="category === 'Digital Art'" type="button" style="background-color: #923edc;">Digital Art</button>
          <button v-else @click="addDigitalArt" type="button">Digital Art</button>
              
          <button v-if="category === 'Music'" type="button" style="background-color: #923edc;">Music</button>
          <button v-else @click="addMusic" type="button">Music</button>

          <button v-if="category === 'Dance'" type="button" style="background-color: #923edc;">Dance</button>
          <button v-else @click="addDance" type="button">Dance</button>
          
          <button v-if="category === '3D Modeling'" type="button" style="background-color: #923edc;">3D Modeling</button>
          <button v-else @click="add3DModeling" type="button">3D Modeling</button>
          
          <button v-if="category === 'Drawing Painting'" type="button" style="background-color: #923edc;">Drawing & Painting</button>
          <button v-else @click="addDrawingPainting" type="button">Drawing & Painting</button>
          
          <button v-if="category === 'Theater'" type="button" style="background-color: #923edc;">Theater</button>
          <button v-else @click="addTheater" type="button">Theater</button>
        </div>
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
          :placeholder="field.placeholder"
        >
      </div>

    </article>

    <article v-else>
      <p>{{ content }}</p>
    </article>

    <button
      class="submit-btn"
      type="submit"
    >
      {{ buttonText ? buttonText : title }}
    </button>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
import TagsComponent from '@/components/Post/TagsComponent.vue';

export default {
  name: 'BlockForm',
  props: {
    postId: {
      type: String,
      required: false,
    }
  },
  components: {
    TagsComponent,
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshPosts: false, // Whether or not stored posts should be updated after form submission
      refreshBio: false,
      makeRemix:false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      newTitle: '',
      description: '', 
      images: [],
      files: [],
      category: '',
    };
  },
  methods: {
    clearImages() {
      this.images = [];
      this.$refs["images"].value = '';
    },
    clearFiles() {
      this.files = [];
      this.$refs["files"].value = null;
    },
    uploadImages(e){
      Array.from(e.target.files).forEach(image => { 
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
          this.images.push({ name: image.name, file: e.target.result });
        };
      });
    },
    uploadFiles(e) {
      Array.from(e.target.files).forEach(file => { 
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e =>{
          this.files.push({ name: file.name, file: e.target.result });
        };
      });
    },
    addDance() {
      this.category = "Dance";
      return;
    },
    addDigitalArt() {
      this.category = "Digital Art";
      return;
    },
    addDrawingPainting() {
      this.category = "Drawing Painting";
      return;
    },
    add3DModeling() {
      this.category = "3D Modeling";
      return;
    },
    addMusic() {
      this.category = "Music";
      return;
    },
    addTheater() {
      this.category = "Theater";
      return;
    },
    async saveCategory(newPostRes) {
      const postId = newPostRes["post"]["id"];
      const params = {
        method: 'POST',
        message: 'added category successfully!',
        body: JSON.stringify({name: this.category, postId: postId})
      }; 

      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'},
        body: params.body
      };

      try {
        const r = await fetch(`/api/categories`, options);
        const res = await r.json();
        
        if (!r.ok) {
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */

      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      if (this.hasBody) {
        if (this.url === '/api/posts') {
          this.title = this.title ? this.title.trim() : null;
          this.description = this.description ? this.description.trim() : null;

          var e = null;
          var errorFound = false;
          this.fields.forEach(field => {
            const {id, value} = field;
            if (errorFound) {
              return;
            }
            
            if (id == 'title') {
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please insert a title')
                errorFound = true;
              }
            } else if (id == 'description'){
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please add a description')
                errorFound = true;
              }
            } else if (id == 'category') {
              console.log(this.category)
              if (this.category === '') {
                e = Error('Please select a category')
                errorFound = true;
              }
            } else if (!this.isValidImagesOrFiles) {
              e = Error('A post must contain either images or files')
              errorFound = true;
            }
          })

          if (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            return;
          }

          const inputFields = Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          );

          const imagesField = {images: this.images}
          const fileField = {files: this.files}

          options.body = JSON.stringify(Object.assign({}, inputFields, imagesField, fileField));          
        } else if (this.url === '/api/comments' && this.method == 'POST') {
          const inputFields = Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          );

          const idField = {postId: this.postId}

          options.body = JSON.stringify(Object.assign({}, inputFields, idField));
        } else if ( (this.url === '/api/users' && this.method === 'POST') || (this.url === '/api/users/session' && this.method === 'POST') ) {
          this.username = this.username ? this.username.trim() : null;
          this.password = this.password ? this.password.trim() : null;

          var e = null;
          var errorFound = false;
          this.fields.forEach(field => {
            const {id, value} = field;
            if (errorFound) {
              return;
            }
            
            if (id == 'username') {
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please insert a username')
                errorFound = true;
              }
            } else if (id == 'password'){
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please add a password')
                errorFound = true;
              }
            }
          })
          if (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            return;
          }

          options.body = JSON.stringify(Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          ));
        } else if (this.url === '/api/users' && this.method === 'PATCH') {
          this.username = this.username ? this.username.trim() : null;
          this.password = this.password ? this.password.trim() : null;
          var e = null;
          var errorFound = false;
          this.fields.forEach(field => {
            const {id, value} = field;
            if (errorFound) {
              return;
            }
            
            if (id == 'username') {
              console.log("hey");
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please insert a username')
                errorFound = true;
              }
            } else if (id == 'password'){
              if (value === undefined || value.trim().length == 0) {
                e = Error('Please add a password')
                errorFound = true;
              }
            } else if (id == 'bio') {
              this.fields['bio'] = this.fields['bio'] ?? ' ';
            }
          })
          if (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            return;
          }
          options.body = JSON.stringify(Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          ));
        } else {
          options.body = JSON.stringify(Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          ));
        }
      }

      try {
        const r = await fetch(this.url, options);

        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setBio', res.user ? res.user.bio : null);
        }

        var newPostRes;
        const tagsCompRef = this.$refs.tagsChildRef !== undefined && this.$refs.tagsChildRef.length > 0 ? this.$refs.tagsChildRef[0] : this.$refs.tagsChildRef;
        if (this.makeRemix || this.category !== '' || (this.$refs.tagsChildRef !== undefined && tagsCompRef.draftTags.length > 0)) {
          newPostRes = await r.json();

          newPostRes.post.category = { name: this.category };
          newPostRes.post.comments = [];
          newPostRes.post.tags = tagsCompRef.draftTags;
          newPostRes.post.likes = [];
          newPostRes.post.reports = [];
          newPostRes.post.remixes = [];

          this.$store.state.posts.push(newPostRes.post);

          console.log(this.$store.state.posts);
        }

        if (this.category !== '') {
          await this.saveCategory(newPostRes);
        }

        // save tags
        if (this.$refs.tagsChildRef !== undefined && tagsCompRef.draftTags.length > 0) {
          const postId = newPostRes["post"]["id"];
          tagsCompRef.saveTags(postId);
        }
        
        if (this.makeRemix) {
          const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({parentId: this.parentId , postId: newPostRes.post._id })
          };

          try {
            const r2 = await fetch("/api/remix", options);
            if (!r2.ok) {
              // If response is not okay, we throw an error and enter the catch block
              const res2 = await r2.json();
              throw new Error(res2.error);
            }
            const message = 'Successfully created a remix!';
            this.$router.push({name: 'Home'}); // Goes to Home page after creating a post
            this.$set(this.alerts, message, 'success');
            setTimeout(() => this.$delete(this.alerts, message), 3000);
          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        }

        if (this.refreshPosts) {
          this.$store.commit('refreshPosts');
        }

        if (this.refreshBio) {
          this.$store.commit('refreshBio');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        console.log(e)
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  computed: {
    isValidImagesOrFiles() {
      return (this.images ? this.images.length > 0 : true) || (this.files ? this.files.length > 0 : true);
    }
  }
};
</script>

<style scoped>
form {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  position: relative;
  border-radius: 10px;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

h3 {
  margin: 20px 0px;
}

article {
  margin: 0.3em 20px;
}

form h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
}

input {
  font-size: 1em;
}

textarea {
  font-family: inherit;
  font-size: 1em;
  height: 80px;
  padding-left: 3px;
  padding-top: 3px;
}

.category-btn button {
  background-color: #923edcab;
  border: none; 
  color: white; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-right: 10px;
}

.category-btn button:hover {
  background-color: #923edc;
}

.columns {
  display: table;
  width: 100%; /*Optional*/
  table-layout: fixed; /*Optional*/
  border-spacing: 10px; /*Optional*/
}

.submit-btn {
  font-weight: bold;
  padding: 8px 50px;
  border: none;
  border-radius: 16px;
  color: white;
  background-color: #EDBD48;
  transition: .2s ease-in-out 0s;
  margin: 15px 0px;
}

.submit-btn:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.disabled-btn {
  opacity: 0.7;
}

.files-and-images {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.files-and-images span {
  font-size: 64px;
  margin: 20px 20px;
  color: #ccc;
}

.files-and-images p {
  font-size: 20px;
}

.icon-btn {
  border: none;
  background: transparent;
  color: rgb(74,74,74);
  transition: .2s ease-in-out 0s;
}

.icon-btn:hover {
  opacity: 0.3;
}

.icon-btn img {
  width: 120px;
  height: 120px;
  opacity: 0.7;
  padding: 10px;
}

.two-columns {
  max-width: 1000px;
  display: flex;
  text-align: center;
}

.two-columns > * {
  flex: 1;
  width: 50%;
}

.upload-section {
  min-width: 250px;
  text-align: center;
}
</style>
