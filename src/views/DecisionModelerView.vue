<template>
  <h2>Decision Modeler</h2>
  <DecisionModeler />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DecisionModeler from '../components/DecisionModeler.vue';

@Options({
  components: {
    DecisionModeler,
  },
  // 导航守卫，当用户切换界面时弹窗确认
  beforeRouteLeave(to, from, next) {
    if (window.confirm('Do you really want to leave? you may have unsaved changes!')) {
      next();
    } else {
      next(false);
    }
  },
})
export default class DecisionModelerView extends Vue {}
</script>
