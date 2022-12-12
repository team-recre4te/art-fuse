

<!-- Form for creating posts (block style) -->
<script>
import BlockForm from '@/components/common/BlockForm.vue';
export default {
  name: 'CreatePostForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/posts',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Title', value: '', placeholder: 'Title'},
        {id: 'description', label: 'Description', value: '', placeholder: 'Describe your project...'},
        {id: 'files', label: 'Attach Supporting Files', accept: 'image/png, image/jpeg, image/webp, audio/mp3, audio/wav, audio/ogg, .pdf'},
        {id: 'images', label: 'Add displayed Images', accept: 'image/png, image/jpeg, image/webp'},
      ],
      title: 'Create a New Post',
      buttonText: 'Submit Post',
      refreshPosts: true,
      callback: () => {
        const message = 'Successfully created a post!';
        this.$router.push({name: 'Home'}); // Goes to Home page after creating a post
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>