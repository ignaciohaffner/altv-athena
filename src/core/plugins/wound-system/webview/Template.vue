<template>
    <div class="test">
        <h2>Heridas</h2>
        <table>
            <tr>
                <th>Parte</th>
                <th>Herida</th>
                <th>Informacion</th>
            </tr>
            <tr>
                <td>Cabeza</td>
                <td>Herida de bala</td>
                <td>3 x 9mm</td>
            </tr>
            <tr>
                <td>Cuello</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Pecho</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Cadera</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Hombro izquierdo</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Brazo izquierdo</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Mano izquierda</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Hombro derecho</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Brazo derecho</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Mano derecha</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Pierna izquierda</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Pie izquierdo</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Pierna derecha</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Pie derecho</td>
                <td>Corte y/o apuñalada</td>
                <td>3</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
export const ComponentName = 'ExamplePlugin';
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
.test {
    background: black;
    min-width: 600px;
    max-width: 800px;
    margin: 1px solid white;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid white;

}

th {
  height: 30px;
}

td {
    padding: 7px 0;
    padding-left: 4px;
}

table, th, td {
  border: 1px solid;
}

h2 {
    text-align: center;
}

</style>