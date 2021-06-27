<template>
  <!-- 组件根节点 -->
  <div id="root">
    <!-- 工具栏 -->
    <div v-show="withSchema">
      <!-- 打开表单 -->
      <input
        type="button"
        value="open form"
        title="open form"
        @click="openFileDialog"
      />
      <input
        type="file"
        id="file-input"
        @change="importFile($event.target.files[0])"
        v-show="false"
      />
      <!-- 保存表单 -->
      <input
        type="button"
        value="save form"
        @click="saveSchema"
      />
    </div>
    <!-- Editor根节点 -->
    <div
      id="modeler-drop-zone"
      :class="state"
      @dragover.capture="handelDragOver"
      @drop.capture="handleFileSelect"
    >
      <!-- 欢迎界面 -->
      <div class="message intro">
        <div class="note">
          Drop form from your desktop or <input type="button" @click="createNewForm" value="create a new form" /> to get started.
        </div>
      </div>
      <!-- 错误信息界面 -->
      <div class="message error">
        <div class="note">
          <p>Oops, we could not display the form!</p>
          <div class="detarls">
            <span>Import Error Details</span>
            <pre>{{ errMsg }}</pre>
          </div>
        </div>
      </div>
      <!-- 编辑器 -->
      <div id="form-editor" class="canvas"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// **NOTE.en-US**: this is a **JS module**, because @bpmn-io/form-js is written in js
// **NOTE.zh-CN**: 这是一个 **JS模块**，因为 @bpmn-io/form-js 是使用 js 编写的
import { Vue, Options } from 'vue-class-component';
import FileSaver from 'file-saver';
import { FormEditor } from '@bpmn-io/form-js-editor';

@Options({
  computed: {
    // 判断当前是否存在表单
    withSchema() {
      return this.state.includes('with-schema');
    },
  },
  mounted() {
    this.formEditor = new FormEditor({
      container: document.querySelector('#form-editor'),
    });
  },
})
export default class CustomFormEditor extends Vue {
  formEditor;
  initialSchema = { type: 'default', components: [] };

  // openDiagram捕获到的错误信息，初始为空
  errMsg = '';
  // 拖拽区域状态，初始值为显示提示信息
  state = 'content';

  async createNewForm() {
    await this.openSchema(this.initialSchema);
  }

  // 打开新表单，使用异步方式读取内容
  async openSchema(schema) {
    try {
      await this.formEditor.importSchema(schema);
      this.state = 'content with-schema';
    } catch (err) {
      this.state = 'content with-error';
      this.errMsg = err.message;
      console.error(err);
    }
  }

  // 处理拖拽事件
  handelDragOver(event) {
    // 阻止事件进一步传播和默认行为
    event.stopPropagation();
    event.preventDefault();

    // 显式显示这是一次复制
    event.dataTransfer.dropEffect = 'copy';
  }

  // 处理释放事件
  handleFileSelect(event) {
    // 阻止事件进一步传播和默认行为
    event.stopPropagation();
    event.preventDefault();

    // 只获取第一个文件
    const file = event.dataTransfer.files[0];
    this.importFile(file);
  }

  // 将文件导入Editor
  importFile(file) {
    const reader = new FileReader();

    // 设定阅读器加载文件时触发的操作
    reader.onload = (event) => {
      // 获取文件的内容（若非schema，下一步会报错并在模板中显示错误信息）
      const schema = JSON.parse(event.target.result);
      // 导入schema
      this.openSchema(schema);
    };

    // 以文本形式读取file
    reader.readAsText(file);
  }

  saveSchema() {
    try {
      // 获取JSON文本
      const json = JSON.stringify(this.formEditor.saveSchema());
      // 将文本存入BLOB对象
      const blob = new Blob([json], {type: 'application/form-schema;charset=utf-8'});
      // 保存该对象
      FileSaver.saveAs(blob, 'form.form');
    } catch(err) {
      console.error('Error occured while saving form: ', err);
    }
  }

  // 打开文件对话框
  openFileDialog() {
    document.querySelector('#file-input').click();
  }
}
</script>

<style scoped>
/* @bpmn-io/form-js内置样式 */
@import '~@bpmn-io/form-js/dist/assets/form-js.css';
@import '~@bpmn-io/form-js/dist/assets/form-js-editor.css';
@import '~@bpmn-io/form-js/dist/assets/dragula.css';

/* 自定义样式 */
#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}

/* 以下样式复制自bpmn-js-examples/properties-panel */
* {
  box-sizing: border-box;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
}
.content > .message {
  width: 100%;
  height: 100%;
  text-align: center;
  display: table;
  font-size: 16px;
  color: #111;
}
.content > .message .note {
  vertical-align: middle;
  text-align: center;
  display: table-cell;
}
.content > .message.error .details {
  max-width: 500px;
  font-size: 12px;
  margin: 20px auto;
  text-align: left;
  color: #BD2828;
}
.content > .message.error pre {
  border: solid 1px #BD2828;
  background: #fefafa;
  padding: 10px;
  color: #BD2828;
}
.content:not(.with-error) .error,
.content.with-error .intro,
.content.with-schema .intro {
  display: none;
}
.content .canvas {
  width: 100%;
}
.content .canvas,
.content .properties-panel-parent {
  display: none;
}
.content.with-schema .canvas,
.content.with-schema .properties-panel-parent {
  display: block;
}

</style>
