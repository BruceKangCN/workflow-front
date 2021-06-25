<template>
  <h2>Process Modeler</h2>
  <ProcessModeler />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProcessModeler from '../components/ProcessModeler.vue';

@Options({
  components: {
    ProcessModeler,
  },
})
export default class ModelerView extends Vue {}
</script>
