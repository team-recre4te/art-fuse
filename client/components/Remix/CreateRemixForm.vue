<!-- Form for creating posts (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';
export default {
  name: 'CreateRemixForm',
  mixins: [BlockForm],
  props:{
    parentId:{
      type: String,
      required: true,
    }
  },
  data() {
    return {
      url: '/api/posts',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Title', value: '', placeholder: 'Title'},
        {id: 'description', label: 'Description', value: '', placeholder: 'Describe your project...'},
        {id: 'tags', label: 'Tags'},
        {id: 'files', label: 'Files', accept: ''},
        {id: 'images', label: 'Images', accept: 'image/png, image/jpeg, image/webp'}
      ],
      title: 'Create a Remix ',
      buttonText: 'Submit Remix',
      refreshPosts: true,
      makeRemix: true,
      callback: () => {
        // const message = 'Successfully created a remix!';
        // this.$router.push({name: 'Home'}); // Goes to Home page after creating a remix
        // this.$set(this.alerts, message, 'success');
        // setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>