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
        {id: 'files', label: 'Files', accept: ''},
        {id: 'images', label: 'Images', accept: 'image/png, image/jpeg, image/webp'}
      ],
      title: 'Create a new post',
      buttonText: 'Create Post',
      refreshPosts: true,
      callback: () => {
        const message = 'Successfully created a post!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>