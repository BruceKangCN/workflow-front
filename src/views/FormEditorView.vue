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
  beforeRouteLeave(to, from, next) {
    const msg = 'Do you really want to leave? you may have unsaved changes!';
    if (window.confirm(msg)) {
      next();
    } else {
      next(false);
    }
  },
})
export default class FormEditorView extends Vue {}
</script>
