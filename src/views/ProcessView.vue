<template>
  <div id="container">
    <ProcessList id="process-list" @processSelected="handleSelected" />
    <ProcessDetail :process="currentProcess" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { IProcessDefinitionDto } from '@/lib/CamundaDto';
import ProcessList from '@/components/ProcessList.vue';
import ProcessDetail from '@/components/ProcessDetail.vue';

/**
 * 流程定义列表及详情展示视图
 */
@Options({
  components: {
    ProcessList,
    ProcessDetail,
  },
})
export default class ProcessView extends Vue {
  /**
   * 当前展示的流程
   */
  private currentProcess: IProcessDefinitionDto | null = null;

  /**
   * 处理流程选择事件
   *
   * @param {IProcessDefinitionDto} process 被选择的流程
   */
  public handleSelected(process: IProcessDefinitionDto): void {
    this.currentProcess = process;
  }
}
</script>

<style>
#container {
  display: flex;
  height: 100%;
}
#process-list {
  width: 25%;
  background-color: #fafafa;
}
#process-detail {
  flex-grow: 1;
}
</style>
