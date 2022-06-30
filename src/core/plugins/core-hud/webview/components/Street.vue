<template>
    <div class="under-map">
        <span class="street">{{ value.toLocaleString() }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Street';
export default defineComponent({
    name: ComponentName,
    props: {
        value: {
            type: String,
            default: 'String',
        },
    },
});
</script>

<style scoped>
.under-map {
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    position: relative;
}

.street {
    font-family: 'Roboto';
    font-size: 14px;
    font-weight: 500;
    text-shadow: 1px 1px black;
}
</style>
