<template>
    <div>
        <header>
            <h2>Recommendations</h2>
            <h4>The ArtFuse team has selected the following projects as a suggestion for you to work on.These
                suggestions
                were selected as the most liked by the community from the categories you have selected.</h4>
        </header>
        <PreferencesSelection />
        <section v-if="$store.state.recommendations.length">
            <RecommendationComponent v-for="rec in $store.state.recommendations" :key="rec.id" :rec="rec" />
        </section>
        <article v-else>
            <p>No Recommendations</p>
        </article>
    </div>
</template>

<script>
import PreferencesSelection from '@/components/Recommendations/preferencesSelection.vue';
import RecommendationComponent from '@/components/Recommendations/recommendationComponent.vue';
export default {
    name: 'RecommendationsPage',
    components: {
        RecommendationComponent,
        PreferencesSelection
    }
}
</script>

<style>

</style>