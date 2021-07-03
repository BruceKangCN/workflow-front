<template>
  <div class="root">
    <header>
      <input
        type="text"
        placeholder="filter"
        @input="filter"
        v-model="pattern"
      />
      <hr/>
    </header>
    <div class="list">
      <ul>
        <!-- `v-for` 遍历 `Map` 的结果为一个含有2个元素的数组，0为键， 1为值 -->
        <li
          v-for="entry in filteredProcessMap"
          :key="entry[0]"
          class="key-list collapsed"
        >
          <p @click.capture="toggleCollapsed">{{ entry[0] }}</p>
          <ol>
            <li
              v-for="process in entry[1]"
              :key="process.id"
              @click="$emit('processSelected', process)"
            >
              {{ process.suspended ? '❌' : '✔' }} {{ process.version }}
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <footer>
      <hr/>
      <div class="button-area">
        <input type="button" value="🔄 refresh" @click="refresh" />
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Axios from 'axios';
import Lodash from 'lodash';
import { IProcessDefinitionDto } from '@/lib/IProcessDefinitionDto';

/**
 * 流程定义列表
 */
@Options({
  created() {
    this.refresh();
  },
  emits: [
    'processSelected',
  ],
})
export default class ProcessList extends Vue {
  /**
   * 过滤模式，用于过滤出所需流程
   */
  private pattern = '';

  /**
   * 流程map，键名对应流程定义key，值为数组，对应该流程所有的版本
   */
  private processMap = new Map<string, IProcessDefinitionDto[]>();

  /**
   * 过滤出的流程map
   */
  private filteredProcessMap = new Map<string, IProcessDefinitionDto[]>();

  /**
   * 当前被激活的元素
   */
  private currentElement: HTMLElement | null = null;

  /**
   * REST API URL
   */
  private apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * 过滤器
   */
  public filter(): void {
    // 若模式为空，直接返回 `processMap` 的深拷贝
    if (this.pattern === '') {
      this.filteredProcessMap = Lodash.cloneDeep(this.processMap);
      return;
    }
    // 将过滤出的 `Map` 清空
    this.filteredProcessMap = new Map<string, IProcessDefinitionDto[]>();
    // 遍历 `Map`，将符合模式的键存入过滤出的 `Map`
    this.processMap.forEach((v, k) => {
      if (k.match(this.pattern)) {
        this.filteredProcessMap.set(k, v);
      }
    });
  }

  /**
   * 刷新流程map
   *
   * @async
   */
  public async refresh(): Promise<void> {
    // 重置过滤模式及流程Map
    this.pattern = '';
    this.processMap = new Map<string, IProcessDefinitionDto[]>();

    const response = await Axios.get(this.apiUrl + '/process-definition');
    const data: IProcessDefinitionDto[] = response.data;

    for (let i = 0; i < data.length; i++) {
      // 获取流程及其定义的key
      const process = data[i];
      const key: string = process.key;

      // 若map中不存在相应键，则创建新数组
      if (!this.processMap.has(key)) {
        this.processMap.set(key, []);
      }

      // 将流程存入map
      this.processMap.get(key)!.push(process);
    }

    // 刷新后默认显示所有流程
    this.filteredProcessMap = Lodash.cloneDeep(this.processMap);
  }

  /**
   * 切换列表的折叠状态
   *
   * @param {event} event 触发方法的事件
   */
  public toggleCollapsed(event: Event): void {
    const el = (event.target as Element).parentNode as Element;
    if (el?.classList.value.includes('collapsed')) {
      el.classList.value = 'key-list';
    } else {
      el.classList.value = 'key-list collapsed';
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
.key-list p::before {
  margin: 0.5em;
  content: "➖";
}
.key-list ol li:hover {
  background-color: #eaeaea;
}
.key-list.collapsed p::before {
  content: "➕";
}
.key-list.collapsed ol {
  display: none;
}
</style>
