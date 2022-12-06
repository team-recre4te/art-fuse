<template>
    <main v-if="parentPost">
        <div class="parent">
            <h3>Parent Post</h3>
            <PostComponent :key="parentPost.id" :post="parentPost" />
        </div>
        <section v-if="childPosts.length">
            <h3>Remixes of Parent Post</h3>
            <PostComponent v-for="remix in childPosts" :key="remix.id" :post="remix" />
        </section>
        <section v-else>
            <p>No Remixes for this post</p>
        </section>
    </main>
</template>

<script>
import PostComponent from '@/components/Post/PostComponent.vue';

export default {
    name: 'RemixesPage',
    components: { PostComponent },
    data() {
        return {
            parentPost: null,
            childPosts: [],
            childPostIds: []
        }
    },
    methods: {
        async getPost(id, isParent) {
            /**
             * Submits a request to the post's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const params = {
                method: 'GET',
                callback: () => {}
            };

            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/posts/id/${id}`, options);
                const res = await r.json();

                if (!r.ok) {
                throw new Error(res.error);
                }

                params.callback();
                if (isParent) {
                    this.parentPost = res;
                } else {
                    return res;
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async getChildPosts() {
            /**
             * Submits a request to the post's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const params = {
                method: 'GET',
                callback: () => {}
            };

            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/remix?postId=${this.$route.query.postId}`, options);
                const res = await r.json();
                this.childPostIds = res.map(remix => { return remix.childId.id });

                this.childPostIds.forEach(async id => {
                    const post = await this.getPost(id, false);
                    this.childPosts.push(post);
                })

                // console.log('child posts', this.childPosts)

                if (!r.ok) {
                throw new Error(res.error);
                }

                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    },
    mounted() {
        this.getPost(this.$route.query.postId, true);
        this.getChildPosts();
        this.$store.commit('loadRemixes', this.$route.query.postId);
    }

}
</script>

<style>

</style>