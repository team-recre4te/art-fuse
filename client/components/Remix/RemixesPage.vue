<template>
    <div class="parent">
        <h3>ParentPost</h3>
        <PostComponent :key="post.id" :post="post" />
    </div>
    <section v-if="$store.state.posts.length">
        <PostComponent v-for="post in remixes" :key="post.id" :post="post" />
    </section>
</template>

<script>
import PostComponent from '@/components/Post/PostComponent.vue';

export default {
    name: 'RemixPage',
    components: { PostComponent },
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            post: this.post
            remixes: this.$store.state.posts,
        }
    },
    mounted() {
        this.$store.commit('loadRemixes', this.post._id);
    }

}
</script>

<style>

</style>