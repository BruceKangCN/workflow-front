<template>
  <!-- 当流程不为空时渲染，否则会报错找不到属性 -->
  <div class="root" v-if="process">
    <div v-html="diagram" class="diagram-area"></div>
    <h1>{{ process.key }} @ {{ process.version }}</h1>
    <hr>
    <h2>Action</h2>
    <!-- TODO add form and change @click -->
    <input
      type="button"
      value="▶ start"
      @click="startInstance(process)"
    >
    <!-- TODO implement this -->
    <input
      type="button"
      value="↔ toggle status"
      @click="toggleStatus(process)"
    >
    <input
      type="button"
      value="❌ delete"
      @click="deleteProcess(process)"
    >
    <input
      type="button"
      value="❗ force delete"
      @click="deleteProcess(process, true)"
    >
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
    <h2>Instance List</h2>
    <!-- TODO add @click -->
    <span v-show="instanceList.length === 0">empty</span>
    <ul>
      <li
        v-for="instance in instanceList"
        :key="instance.id"
      >
        {{ instance.ended ? '⏹' : '▶' }}
        {{ process.suspended ? '❌' : '✔' }}
        {{ instance.id }}
      </li>
    </ul>
    <ul></ul>
    <h2>Details</h2>
    <pre>{{ process }}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Axios from 'axios';
import { IProcessDefinitionDto, IProcessInstanceDto } from '@/lib/CamundaDto';

/**
 * 流程定义详情
 */
@Options({
  props: ['process'],
  watch: {
    process(value): void {
      // 通过调用来执行异步方法
      this.updateDiagram(value);
      this.getInstanceList(this.process.id);
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

  // TODO 绑定数据，设置类型
  /**
   * 启动表单
   */
  private startForm = {};

  /**
   * 流程实例列表
   */
  private instanceList: IProcessInstanceDto[] = [];

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

    try {
      const response = await Axios.get(url);

      switch (response.status) {
        case 200:
          this.diagram = response.data;
          break;
        case 204:
          this.diagram = '';
          break;
        case 404:
          console.error('ProcessDefinitionId does not exist!', response.data);
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Bruce Kang: 这接口名都好长啊
  /**
   * 启动流程实例
   *
   * @async
   * @param {IProcessDefinitionDto} process 流程定义
   * @returns {IProcessInstanceDto | null} 关于被启动实例的信息
   */
  public async startInstance(process: IProcessDefinitionDto)
    : Promise<IProcessInstanceDto | null> {
    const url = [
      this.apiUrl,
      '/process-definition/',
      process.id,
      '/start',
    ].join('');

    try {
      const response = await Axios.post(url, this.startForm);

      switch (response.status) {
        case 400:
          console.error('Invalid value!', response.data);
          break;
        case 404:
          console.error('ProcessDefinitionId does not exist!', response.data);
          break;
        case 500:
          console.error('The instance could not be created successfully', response.data);
          break;
        default: break;
      }

      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * 删除流程定义
   *
   * @async
   * @param {IProcessDefinitionDto} process 流程定义
   * @param {boolean} [cascade] 是否删除对应的流程实例，若当前存在正在运行的实例，必须设置为 `true` 才能成功删除
   */
  public async deleteProcess(process: IProcessDefinitionDto, cascade?: boolean)
    : Promise<void> {
    const url = [
      this.apiUrl,
      '/process-definition/',
      process.id,
    ].join('');

    try {
      const response = await Axios.delete(url, { params: { cascade } });

      switch (response.status) {
        case 404:
          console.error('ProcessDefinitionId does not exist!', response.data);
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // TODO add more tweaks
  /**
   * 切换流程激活/冻结状态
   *
   * @param {IProcessDefinitionDto} process 流程定义
   */
  public async toggleStatus(process: IProcessDefinitionDto): Promise<void> {
    const url = [
      this.apiUrl,
      '/process-definition/',
      process.id,
      '/suspended',
    ].join('');

    try {
      const response = await Axios.put(url, {
        suspended: !process.suspended,
        includeProcessInstances: false,
        executionDate: null,
      });
      switch (response.status) {
        case 204: break; // success
        case 400:
          console.error('Invalid value!', response.data);
          break;
        case 404:
          console.error('ProcessDefinitionId does not exist!', response.data);
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 获取流程实例列表
   *
   * @param {string} id 流程定义ID
   */
  public async getInstanceList(id: string): Promise<void> {
    const url = this.apiUrl + '/process-instance';

    try {
      const response = await Axios.get(url, {
        params: {
          processDefinitionId: id,
        },
      });
      switch (response.status) {
        case 200:
          this.instanceList = response.data;
          break;
        case 400:
          console.error('Invalid value!', response.data);
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style scoped>
.root {
  width: 100%;
  overflow: auto;
}
.diagram-area {
  display: flex;
  justify-content: center;
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
