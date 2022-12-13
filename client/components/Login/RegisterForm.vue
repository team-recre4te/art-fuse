<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: '', placeholder: 'Username'},
        {id: 'password', label: 'Password', value: '', placeholder: 'Password'},
        {id: 'bio', label: 'Bio', value: '', placeholder: 'Bio'}
      ],
      title: 'Create account',
      buttonText: 'Register',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Home'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>

<style scoped>


</style>
