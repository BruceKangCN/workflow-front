<template>
  <h2>Decision Modeler</h2>
  <DecisionModeler />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DecisionModeler from '@/components/DecisionModeler.vue';

@Options({
  components: {
    DecisionModeler,
  },
  beforeRouteLeave(to, from, next) {
    const msg = 'Do you really want to leave? you may have unsaved changes!';
    if (window.confirm(msg)) {
      next();
    } else {
      next(false);
    }
  },
})
export default class DecisionModelerView extends Vue {}
</script>
