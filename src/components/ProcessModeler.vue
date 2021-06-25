<template>
  <div
    id="modeler-drop-zone"
    class="content"
    @dragover.capture="handelDragOver"
    @drop.capture="handleFileSelect"
  >
    <!-- 欢迎界面 -->
    <div class="message intro">
      <div class="note">
        Drop BPMN diagram from your desktop or <span @click="createDiagram">create a new diagram</span> to get started.
      </div>
    </div>
    <!-- 错误信息界面 -->
    <div class="message error">
      <div class="note">
        <p>Oops, we could not display the BPMN 2.0 diagram!</p>
        <div class="detarls">
          <span>Import Error Details</span>
          <pre>{{ errMsg }}</pre>
        </div>
      </div>
    </div>
    <!-- 画布 -->
    <div id="modeler-canvas" class="canvas"></div>
    <!-- 属性面板 -->
    <div id="modeler-properties-panel" class="properties-panel-parent"></div>
    <!-- 下载按钮列表 -->
    <ul class="buttons">
      <li>download</li>
      <li>
        <input
          value="BPMN diagram"
          id="modeler-download-diagram"
          title="download BPMN diagram"
          type="button"
        />
      </li>
      <li>
        <input
          value="SVG image"
          id="modeler-download-svg"
          title="download as SVG image"
          type="button"
        />
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// **NOTE.en-US**: this is a **JS module**, because bpmn-js is written in js
// **NOTE.zh-CN**: 这是一个 **JS模块**，因为 bpmn-js 是使用 js 编写的
import { Vue, Options } from 'vue-class-component';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

@Options({
  mounted() {
    // 容器元素
    this.container = document.querySelector('#modeler-drop-zone');
    // 画布元素
    this.canvas = document.querySelector('#modeler-canvas');
    // Modeler对象，使用构造函数初始化
    this.bpmnModeler = new BpmnModeler({
      // 容器画布
      container: this.canvas,
      // 属性面板
      propertiesPanel: {
        parent: document.querySelector('#modeler-properties-panel'),
      },
      // 附加模块
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
      ],
      // moddle扩展
      moddelExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });
    console.log(this.bpmnModeler);
  },
})
export default class ProcessModeler extends Vue {

  container;
  canvas;
  bpmnModeler;

  // openDiagram捕获到的错误信息，初始为空
  errMsg = '';

  // 打开新图表，使用异步方式读取文件
  async openDiagram(xml) {
    let classes = this.container.classList;
    try {
      await this.bpmnModeler.importXML(xml);
      classes.remove('with-error');
      classes.add('with-diagram');
    } catch (err) {
      classes.remove('with-diagram');
      classes.add('with-error');
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
    let file = event.dataTransfer.files[0];
    let reader = new FileReader();

    // 设定阅读器加载文件时触发的操作
    reader.onload = (event) => {
      // 获取文件的内容（若非xml，下一步会报错并在模板中显示错误信息）
      let xml = event.target.result;
      // 以图表方式打开xml
      this.openDiagram(xml);
    };

    // 以文本形式读取file
    reader.readAsText(file);
  }
}
</script>

<style scoped>
/* 复制自 bpmn-js-examples/properties-panel */

* {
  box-sizing: border-box;
}
body,
html {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  height: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
}
a:link {
  text-decoration: none;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
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
.content.with-diagram .intro {
  display: none;
}
.content .canvas {
  width: 100%;
}
.content .canvas,
.content .properties-panel-parent {
  display: none;
}
.content.with-diagram .canvas,
.content.with-diagram .properties-panel-parent {
  display: block;
}
.buttons {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.buttons > li {
  display: inline-block;
  margin-right: 10px;
}
.buttons > li > a {
  background: #DDD;
  border: solid 1px #666;
  display: inline-block;
  padding: 5px;
}
.buttons a {
  opacity: 0.3;
}
.buttons a.active {
  opacity: 1;
}
.properties-panel-parent {
  border-left: 1px solid #ccc;
  overflow: auto;
}
.properties-panel-parent:empty {
  display: none;
}
.properties-panel-parent > .djs-properties-panel {
  padding-bottom: 70px;
  min-height: 100%;
}

</style>
