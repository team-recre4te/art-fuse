<template>
    <section v-if="$store.state.posts.length">
        <PostComponent v-for="post in " :key="post.id" :post="post" />
    </section>

</template>

<script>

</script>

<style>

</style>