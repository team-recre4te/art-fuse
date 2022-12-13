<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'description'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <div v-else-if="field.id === 'images' || field.id === 'files'">
          <input 
            type="file"
            :id="field.id"
            :name="field.id"
            :accept="field.accept"
            @change="field.id === 'images' ? uploadImages($event) : uploadFiles($event);"
            :ref="field.id"
            style="display: none"
            multiple
          >
          <input type="button" :value="'Choose ' + field.id" @click="$refs[field.id][0].click()" />
        </div>
        <div v-else-if="field.id === 'tags'">
          <TagsComponent 
            ref="tagsChildRef"
            :editing="true"
            :displayInline="true"
          />
        </div>
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
        <ul v-if="field.id === 'files' && files.length" >
          <li
            v-for="file in files"
            :key="file.name"
          >
            {{file.name}}
          </li>
          <button type="button" @click="clearFiles()">Clear Files</button>
        </ul>
        <div v-if="field.id === 'images' && images.length">
          <img 
            v-for="image in images"
            :key="image.name"
            :src="image.file"
            height=200
            alt=""
          > 
          <button type="button" @click="clearImages()">Clear Images</button>
        </div>
      </div>

      <div v-if="(fields.length === 5)" class="columns">
      
        <div class="category-btn" v-if="category === 'Digital Art'" style="background-color: #3E7DDC;">Digital Art</div>
        <div class="category-btn" v-else @click="addDigitalArt">Digital Art</div>
            
        <div class="category-btn" v-if="category === 'Music'" style="background-color: #3E7DDC;">Music</div>
        <div class="category-btn" v-else @click="addMusic">Music</div>

        <div class="category-btn" v-if="category === 'Dance'" style="background-color: #3E7DDC;">Dance</div>
        <div class="category-btn" v-else @click="addDance">Dance</div>
        
        <div class="category-btn" v-if="category === '3D Modeling'" style="background-color: #3E7DDC;">3D Modeling</div>
        <div class="category-btn" v-else @click="add3DModeling">3D Modeling</div>
        
        <div class="category-btn" v-if="category === 'Drawing Painting'" style="background-color: #3E7DDC;">Drawing & Painting</div>
        <div class="category-btn" v-else @click="addDrawingPainting">Drawing & Painting</div>
        
        <div class="category-btn" v-if="category === 'Theater'" style="background-color: #3E7DDC;">Theater</div>
        <div class="category-btn" v-else @click="addTheater">Theater</div>
    </div>
    
    </article>

    <article v-else>
      <p>{{ content }}</p>
    </article>

    <button
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

      // // temporary solution for checking if it's the create post form, will add an input variable later to specify
      // if (this.category === '' && this.fields === 4) {
      //   this.$set(this.alerts, Error('Please select a category'), 'error');
      //   return;
      // }

      if (this.hasBody) {
        if (this.url === '/api/posts') {
          this.title = this.title ? this.title.trim() : null;
          this.description = this.description ? this.description.trim() : null;
          
          if (this.title === ''){
            this.$set(this.alerts, Error('Please insert a title'), 'error');
            return;
          }
          if (this.description === ''){
            this.$set(this.alerts, Error('Please add a description'), 'error');
            return;
          }
          if (this.images.length === 0 && this.files.length === 0){
            this.$set(this.alerts, Error('A post must contain either images or files'), 'error');
            return;
          }
          if (this.category === ''){
            this.$set(this.alerts, Error('Please select a category'), 'error');
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
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

.category-btn {
  background-color: #3e7ddc4e;
  border: none; 
  color: white; 
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 10px;
  display: table-cell;
}

.category-btn:hover {
  background-color: #3E7DDC;
}

.columns {
  display: table;
  width: 100%; /*Optional*/
  table-layout: fixed; /*Optional*/
  border-spacing: 10px; /*Optional*/
}
</style>
