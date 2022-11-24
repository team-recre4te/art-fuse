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
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
        <ul v-if="field.id === 'files' && fileNames.length" >
          <li
            v-for="name in fileNames"
            :key="name"
          >
            {{name}}
          </li>
          <button type="button" @click="clearFiles()">Clear Files</button>
        </ul>
        <div v-if="field.id === 'images' && images.length">
          <img 
            v-for="image in images"
            :key="image"
            :src="image"
            height=200
            alt=""
          > 
          <button type="button" @click="clearImages()">Clear Images</button>
        </div>
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
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

export default {
  name: 'BlockForm',
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
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      images: [],
      files: [],
      fileNames: []
    };
  },
  methods: {
    clearImages() {
      this.images = [];
      this.$refs["images"].value = '';
    },
    clearFiles() {
      this.files = [];
      this.fileNames = [];
      this.$refs["files"].value = null;
    },
    uploadImages(e){
      Array.from(e.target.files).forEach(image => { 
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
          this.images.push(e.target.result);
        };
      });
    },
    uploadFiles(e) {
      Array.from(e.target.files).forEach(file => { 
        const reader = new FileReader();
        reader.readAsDataURL(file);
        this.fileNames.push(file.name);
        reader.onload = e =>{
          this.files.push(e.target.result);
        };
      });
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

          const inputFields = Object.fromEntries(
            this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            })
          );

          const idField = {images: this.images}
          const fileField = {files: this.files}

          options.body = JSON.stringify(Object.assign({}, inputFields, idField, fileField));

          console.log('options', options.body);

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
</style>
