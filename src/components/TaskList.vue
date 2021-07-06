<template>
  <div class="root">
    <header>
      <input
        type="text"
        placeholder="filter"
        @input="filter"
        v-model="pattern"
      >
      <hr>
    </header>
    <div class="list">
      <ul>
        <!-- `v-for` 遍历 `Map` 的结果为一个含有2个元素的数组，0为键， 1为值 -->
        <li
          v-for="entry in filteredTaskMap"
          :key="entry[0]"
          class="id-list collapsed"
        >
          <p @click="toggleCollapsed">{{ entry[0] }}</p>
          <ol>
            <li
              v-for="task in entry[1]"
              :key="task.id"
              @click="$emit('taskSelected', task)"
            >
              {{ task.suspended ? '❌' : '✔' }} {{ task.name }}
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <footer>
      <hr>
      <div class="button-area">
        <input type="button" value="🔄 refresh" @click="refresh">
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Axios from 'axios';
import Lodash from 'lodash';
import { ITaskDto } from '@/lib/CamundaDto';

@Options({
  created() {
    this.refresh();
  },
  emits: ['taskSelected'],
})
export default class TaskList extends Vue {
  /**
   * 过滤模式，用于过滤出所需流程
   */
  private pattern = '';

  /**
   * 任务map，键名对应流程定义ID，值为数组，对应该流程定义下所有的任务
   */
  private taskMap = new Map<string, ITaskDto[]>();

  /**
   * 过滤出的任务map
   */
  private filteredTaskMap = new Map<string, ITaskDto[]>();

  /**
   * REST API URL
   */
  private apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * 过滤器
   */
  public filter(): void {
    // 若模式为空，直接返回 `taskMap` 的深拷贝
    if (this.pattern === '') {
      this.filteredTaskMap = Lodash.cloneDeep(this.taskMap);
      return;
    }
    // 将过滤出的 `Map` 清空
    this.filteredTaskMap = new Map<string, ITaskDto[]>();
    // 遍历 `Map`，将符合模式的键存入过滤出的 `Map`
    this.taskMap.forEach((v, k) => {
      if (k.match(this.pattern)) {
        this.taskMap.set(k, v);
      }
    });
  }

  /**
   * 刷新任务map
   *
   * @async
   */
  public async refresh(): Promise<void> {
    // 重置过滤模式及任务Map
    this.pattern = '';
    this.taskMap = new Map<string, ITaskDto[]>();

    try {
      const response = await Axios.get(this.apiUrl + '/task');

      const data: ITaskDto[] = response.data;
      switch (response.status) {
        case 200:
          for (let i = 0; i < data.length; i++) {
            // 获取任务及其对应的流程
            const task = data[i];
            const process: string = task.processDefinitionId;

            // 若map中不存在相应键，则创建新数组
            if (!this.taskMap.has(process)) {
              this.taskMap.set(process, []);
            }

            // 将任务存入map
            this.taskMap.get(process)!.push(task);
          }

          // 刷新后默认显示所有任务
          this.filteredTaskMap = Lodash.cloneDeep(this.taskMap);

          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 切换列表的折叠状态
   *
   * @param {event} event 触发方法的事件
   */
  public toggleCollapsed(event: Event): void {
    const el = (event.target as Element).parentNode as Element;
    if (el?.classList.value.includes('collapsed')) {
      el.classList.value = 'id-list';
    } else {
      el.classList.value = 'id-list collapsed';
    }
  }
}
</script>

<style scoped>
.root {
  display: flex;
  flex-flow: column;
}
header,
footer,
.list {
  width: 100%;
}
input[type=text] {
  width: 100%;
}
.button-area {
  display: flex;
  justify-content: flex-end;
}
footer input[type=button] {
  width: 8em;
}
hr {
  margin: 5px 0px;
}
.list {
  overflow: auto;
  flex-grow: 1;
}
.id-list p::before {
  margin: 0.5em;
  content: "➖";
}
.id-list ol li:hover {
  background-color: #eaeaea;
}
.id-list.collapsed p::before {
  content: "➕";
}
.id-list.collapsed ol {
  display: none;
}
</style>
