<template>
  <div id="container">
    <TaskList id="task-list" @taskSelected="handleSelected" />
    <TaskDetail :task="currentTask" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TaskList from '@/components/TaskList.vue';
import TaskDetail from '@/components/TaskDetail.vue';
import { ITaskDto } from '@/lib/CamundaDto';

/**
 * 任务列表及详情展示视图
 */
@Options({
  components: {
    TaskList,
    TaskDetail,
  },
})
export default class TaskView extends Vue {
  /**
   * 当前展示的任务
   */
  private currentTask: ITaskDto | null = null;

  /**
   * 处理任务选择事件
   *
   * @param {ITaskDto} task 被选择的流程
   */
  public handleSelected(task: ITaskDto): void {
    this.currentTask = task;
  }
}
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
