<template>
  <h2>Process Modeler</h2>
  <ProcessModeler />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProcessModeler from '@/components/ProcessModeler.vue';

@Options({
  components: {
    ProcessModeler,
  },
  // 导航守卫，当用户切换界面时弹窗确认
  beforeRouteLeave(to, from, next) {
    const msg = 'Do you really want to leave? you may have unsaved changes!';
    if (window.confirm(msg)) {
      next();
    } else {
      next(false);
    }
  },
})
export default class ProcessModelerView extends Vue {}
</script>
