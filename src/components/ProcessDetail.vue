<template>
  <!-- 当流程不为空时渲染，否则会报错找不到属性 -->
  <div class="root" v-if="process">
    <div v-html="diagram" class="diagram-area"></div>
    <h1>{{ process.key }}@{{ process.version }}</h1>
    <hr/>
    <h2>Description</h2>
    <div>{{ process.description }}</div>
    <h2>Sumary</h2>
    <table>
      <tr>
        <th>field</th>
        <th>type</th>
        <th class="value">value</th>
      </tr>
      <tr>
        <td>name</td>
        <td>String</td>
        <td class="value">{{ process.name }}</td>
      </tr>
      <tr>
        <td>key</td>
        <td>String</td>
        <td class="value">{{ process.key }}</td>
      </tr>
      <tr>
        <td>version</td>
        <td>int</td>
        <td class="value">{{ process.version }}</td>
      </tr>
      <tr>
        <td>deployment id</td>
        <td>UUID</td>
        <td class="value">{{ process.deploymentId }}</td>
      </tr>
      <tr>
        <td>suspended</td>
        <td>boolean</td>
        <td class="value">{{ process.suspended }}</td>
      </tr>
    </table>
    <h2>Details</h2>
    <pre>{{ process }}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Axios from 'axios';
import { IProcessDefinitionDto } from '@/lib/IProcessDefinitionDto';

/**
 * 流程定义详情
 */
@Options({
  props: [
    'process',
  ],
  watch: {
    process(value): void {
      // 通过调用来执行异步方法
      this.updateDiagram(value);
    },
  },
})
export default class ProcessView extends Vue {
  /**
   * 当前流程对应的图表
   */
  private diagram = '';

  /**
   * REST API URL
   */
  private apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * 更新图表
   *
   * @async
   * @param {IProcessDefinitionDto} process 更新后的流程
   */
  public async updateDiagram(process: IProcessDefinitionDto): Promise<void> {
    const url = [
      this.apiUrl,
      '/process-definition/',
      process.id,
      '/diagram',
    ].join('');
    console.warn(url);
    const response = await Axios.get(url);
    console.warn(1);
    this.diagram = response.data;
  }
}
</script>

<style scoped>
.root {
  width: 100%;
}
.diagram-area {
  display: flex;
}
table,
th,
td {
  border: solid 1px;
  border-spacing: 0;
}
th,
td {
  padding: 2px;
  width: 10em;
}
th.value,
td.value {
  width: 20em;
}
</style>
