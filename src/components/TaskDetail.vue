<template>
  <!-- 当任务不为空时渲染，否则会报错找不到属性 -->
  <div class="root" v-if="task">
    <h1>{{ task.name }}</h1>
    <hr>
    <h2>Form</h2>
    <TaskForm :schema="schema" />
    <h2>Details</h2>
    <pre>{{ task }}</pre>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TaskForm from '@/components/common/TaskForm.vue';
import { ISchema } from '@/lib/ISchema';
import Axios from 'axios';

@Options({
  props: ['task'],
  components: {
    TaskForm,
  },
  watch: {
    task(value): void {
      // 通过调用来执行异步方法
      this.getSchema(value.id);
    },
  },
})
export default class TaskDetail extends Vue {
  /**
   * 任务对应的表单
   */
  private schema: ISchema = { type: 'default', components: [] };

  /**
   * REST API URL
   */
  private apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * 获取任务对应的表单
   *
   * @param {string} formKey 表单对应的键
   */
  public async getSchema(formKey: string): Promise<void> {
    const url = [
      this.apiUrl,
      '/task/',
      formKey,
      '/deployed-form',
    ].join('');

    try {
      const response = await Axios.get(url);
      switch (response.status) {
        case 200:
          this.schema = response.data;
          break;
        case 400:
          console.error('Invalid value!', response.data);
          break;
        case 403:
          console.error('Forbiden!', response.data);
          break;
        case 404:
          console.error('No deployed form for a given task exists!', response.data);
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
  width: 75%;
  overflow: auto;
}
</style>
