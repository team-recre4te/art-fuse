<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h1>Account Settings for @{{ $store.state.username }}</h1>
      </header>
      <div class="two-column">
        <ChangeUsernameForm style="margin-right: 10px;"/>
        <ChangePasswordForm style="margin-left: 10px;"/>
      </div>
      <ChangeBioForm />
    </section>
    <section>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeBioForm from '@/components/Account/ChangeBioForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeBioForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bolder;
  margin: 30px 0px;
}

.two-column {
  display: flex;
}

.two-column > * {
  flex: 1;
}
</style>
