<template>
  <div id="container">
    <TaskList id="task-list" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TaskList from '@/components/TaskList.vue';

@Options({
  components: {
    TaskList,
  },
})
export default class TaskView extends Vue {}
</script>

<style scoped>
#container {
  display: flex;
  height: 100%;
}
#task-list {
  width: 25%;
  background-color: #fafafa;
}
</style>
