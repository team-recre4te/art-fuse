<template>
    <main>
        <div class="parent">
            <h3>Parent Post</h3>
            <div v-if="loading">
                Loading post information...
            </div>
            <PostComponent v-else :key="parentPost.id" :post="parentPost" />
        </div>
        <section v-if="childPosts.length && !loadingRemixes">
            <h2>Remixes of Parent Post</h2>
            <PostComponent v-for="remix in childPosts" :key="remix.id" :post="remix" />
        </section>
        <section v-else-if="loadingRemixes">
            <p>Loading Remixes for this post...</p>
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
            childPostIds: [],
            loading: true,
            loadingRemixes: true,
            alerts: {}
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
                this.loading = false;

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
                this.childPostIds = res.map(remix => { 
                    return remix.childId ? remix.childId.id : null 
                }).filter(remix => { 
                    return remix != null;
                });

                this.childPostIds.forEach(async id => {
                    const post = await this.getPost(id, false);
                    this.childPosts.push(post);
                    this.loadingRemixes = false;
                })

                if (!r.ok) {
                    throw new Error(res.error);
                }

                params.callback();
            } catch (e) {
                console.log(e)
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    },
    mounted() {
        this.loading = true;
        this.loadingRemixes = true;
        this.getPost(this.$route.query.postId, true);
        this.getChildPosts();
        this.$store.commit('loadRemixes', this.$route.query.postId);
    }

}
</script>

<style>
h3 {
    font-size: 24px;
    font-weight: bold;
    margin: 30px 0px;
}

h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 30px 0px;
}
</style>