<template>
    <div class="stack container">
        <div class="stack item">
            <p>Color de radio:</p>
            <h2>rojo</h2>
        </div>
        <div class="item">
            <p>puto</p> 
        </div>
        <div class="item"><p>aasa</p> </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
export const ComponentName = 'Options';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon:  defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {};
    },
    methods: {
    },
    computed: {
    },
    mounted() {
        if ('alt' in window) {
            alt.emit(`${ComponentName}:Ready`);
        }
    },
    unmounted() {},
});
</script>

<style scoped>


.container {
    background: black;
    min-width: 400px;
    max-width: 400px;
    align-items: center;
}

.item {
    min-height: 100px;
    max-height: 100px;
    width: 90%;
    border: 3px solid white;
    margin: 3% 0;
}

p {
    color: white;
    
}
</style>