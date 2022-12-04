<!-- Form for changing bio (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeBioForm',
  mixins: [BlockForm],

  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'bio', label: 'Bio', value: ''}
      ],
      title: 'Change bio',
      buttonText: 'Update bio',
      callback: () => {
        const message = 'Successfully changed bio!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
