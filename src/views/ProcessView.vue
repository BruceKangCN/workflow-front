<template>
  <div id="container">
    <ProcessList id="process-list" @processSelected="handleSelected" />
    <div id="process-detail">
      <pre>{{ currentProcess }}</pre>
      <div v-html="diagram"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Axios from 'axios';
import ProcessList from '@/components/ProcessList.vue';
import { IProcessDefinitionDto } from '@/lib/IProcessDefinitionDto';

@Options({
  components: {
    ProcessList,
  },
})
export default class ProcessView extends Vue {
  /**
   * 当前展示的流程
   */
  private currentProcess: IProcessDefinitionDto | null = null;

  private apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * 当前流程对应的 `SVG` 图表
   */
  private diagram = '';

  public async handleSelected(process: IProcessDefinitionDto): Promise<void> {
    this.currentProcess = process;
    this.diagram = (await Axios.get(this.apiUrl + '/process-definition/' + this.currentProcess.id + '/diagram')).data;
    console.log(this.diagram);
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
