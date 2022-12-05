<template>
    <article class="recommendation">
        <header class="recommendation-header">
            <h3>
                Recommended projects to Remix
            </h3>
            <p>
                From ArtFuse
            </p>
        </header>
        <button style="background-color: white; border: 0px;" @click="changeState" ref="btnToggle">
            View recommended posts
        </button>
        <div v-if="showRecommendations">
            <section v-if="$store.state.posts.length">
                <PostComponent v-for="post in rec.recommendations" :key="post.id" :post="post" />
            </section>
            <article v-else>
                <p>No recommendations can be generated!</p>
            </article>
        </div>
        <button @click="deleteRecommendation">
            🗑️ Delete
        </button>
        <p>
            recommendation created at: {{ rec.dateCreated }}
        </p>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>   

<script>
export default {
    name: 'RecommendationComponent',
    props: {
        // Data from the stored post
        rec: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showRecommendations: False,
            alerts: {}
        }
    },
    methods: {
        changeState: function () {
            this.showRecommendations = !this.showRecommendations;
            this.$refs.btnToggle.innerText = this.showRecommendations ? 'Hide recommended posts' : 'View recommended posts';
        },
        deleteRecommendation: async function () {
            /**
             * Deletes this recommendation.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('refreshRecommendations');
                    this.$store.commit('alert', {
                        message: 'Successfully deleted recommendation!', status: 'success'
                    });
                }
            };
            this.request(`recommendation/${this.post._id}`, params);
        }
    },
}
</script>

<style>

</style>