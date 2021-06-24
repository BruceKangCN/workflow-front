<template>
  <h2>Modeler</h2>
  <modeler />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Modeler from '../components/Modeler.vue';

@Options({
  components: {
    Modeler,
  },
})
export default class ModelerView extends Vue {}
</script>
