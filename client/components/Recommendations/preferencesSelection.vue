<template>
    <div>
        <multiselect v-model="value" :options="options" :multiple="true"></multiselect>
        <button @click="changePrference">Save Preferences</button>
    <section class="alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
            <p>{{ alert }}</p>
        </article>
    </section>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: 'PreferencesSelection',
    // OR register locally
    components: { Multiselect },
    data() {
        return {
            value: [...this.$store.state.preferences],
            options: ['Painting', 'Sculpture', 'Literature', 'Architecture', 'Cinema', 'Music', 'Theater'],
            alerts:{}
        }
    },
    methods: {
        changePrference: async function () {
            const prefEdited = !this.value.sort().join(',') === this.$store.state.preferences.sort().join(',');
            console.log('has been edited');
            if (!prefEdited) {
                const error = 'Error: Edited preferences should be different than original post.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }
            console.log('has been edited');
            console.log('value',this.value);
            console.log('stored',this.$store.state.preferences);
            const params = {
                method: 'PATCH',
                message: 'Successfully changed Preferences!',
                body: JSON.stringify({
                    preferences: this.value
                }),
                callback: () => {
                    this.editing = false;
                    this.$store.commit('refreshPreferences');

                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.$store.commit('setPreferences',this.value);
            console.log('stored',this.$store.state.preferences);
            this.request(`users/`, params);
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>