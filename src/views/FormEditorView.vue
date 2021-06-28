<template>
  <h2>Form Editor</h2>
  <FormEditor />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FormEditor from '@/components/FormEditor.vue';

@Options({
  components: {
    FormEditor,
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
export default class FormEditorView extends Vue {}
</script>
