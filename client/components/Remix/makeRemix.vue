<template>
    <main>
      <CreateRemixForm :parentId=this.$route.params.postId />
    </main>
  </template>

  <script>
  import CreateRemixForm from '@/components/Remix/remixBlockForm.vue';
  
  export default {
    name: 'CreateRemixPage',
    components: {CreateRemixForm},
    props:{
    postId:{
      type: String,
      required: true,
    }
  },
  };
  </script>
  
  <style scoped>
  main {
    margin-top: 40px;
  }
  </style>