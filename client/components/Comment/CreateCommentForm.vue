<script>
import BlockForm from '@/components/common/BlockForm.vue';
export default {
  name: 'CreateCommentForm',
  mixins: [BlockForm],
  props: {
    postId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      url: '/api/comments',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
      ],
      title: 'Create a comment',
      refreshFreets: true,
      buttonText: "Submit Comment",
      callback: () => {
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);

        this.$emit('comments_added');
      }
    };
  }
};
</script>