<template>
  <!-- TODO 添加快捷键 -->
  <!-- 组件根节点 -->
  <div
    id="root"
  >
    <!-- 工具栏 -->
    <div v-show="withDiagram" class="tool-bar">
      <!-- 打开文件 -->
      <input
        type="button"
        value="open diagram"
        title="open BPMN diagram"
        @click="openFileDialog"
      />
      <input
        type="file"
        id="file-input"
        @change="openDiagramFile"
        v-show="false"
      />
      <span class="v-splitter"></span>
      <!-- 保存 -->
      <span>save</span>
      <!-- 保存为XML图表 -->
      <input
        type="button"
        value="BPMN diagram"
        title="save BPMN diagram"
        @click="saveXML"
      />
      <!-- 保存为SVG图片 -->
      <input
        type="button"
        value="SVG image"
        title="save as SVG image"
        @click="saveSVG"
      />
      <span class="v-splitter"></span>
      <input type="button" value="<-" title="undo" @click="undo" />
      <input type="button" value="->" title="redo" @click="redo" />
      <span class="v-splitter"></span>
      <!-- TODO 实现部署功能 -->
      <!-- 部署 -->
      <input
        type="button"
        value="deploy"
        title="deploy the process"
        @click="deploy"
      />
    </div>
    <!-- Modeler根节点 -->
    <div
      id="modeler-drop-zone"
      :class="state"
      @dragover.capture="handelDragOver"
      @drop.capture="handleFileSelect"
    >
      <!-- 欢迎界面 -->
      <div class="message intro">
        <div class="note">
          Drop BPMN diagram from your desktop or <input type="button" @click="openFileDialog" value="open a diagram" /><input type="button" @click="createNewDiagram" value="create a new diagram" /> to get started.
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
    </div>
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

import FileSaver from 'file-saver';

@Options({
  computed: {
    // 判断当前是否存在图表
    withDiagram() {
      return this.state.includes('with-diagram');
    },
  },
  setup() {
    // 检测是否支持拖拽，若不支持则弹出信息
    if (!window.FileList || !window.FileReader) {
      const msg =[
        'Looks like you use an older browser ',
        'that does not support drag and drop.',
        'Try using Chrome, Firefox or the Internet Explorer > 10.',
      ].join('');
      console.error(msg);
      window.alert(msg);
    }
  },
  // 在实例挂载时初始化container, canvas, bpmnModeler字段，否则无法获取到DOM
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
    // 指令栈，用于撤销/重做
    this.commandStack = this.bpmnModeler.get('commandStack');
  },
})
export default class ProcessModeler extends Vue {
  container;
  canvas;
  bpmnModeler;
  commandStack;

  // 获取流程定义
  getProcessDefinitions() {
    return this.bpmnModeler.getDefinitions().rootElements[0];
  }

  // openDiagram捕获到的错误信息，初始为空
  errMsg = '';
  // 拖拽区域状态，初始值为显示提示信息
  state = 'content';

  // 打开新图表，使用异步方式读取内容
  async openDiagram(xml) {
    try {
      await this.bpmnModeler.importXML(xml);
      this.state = 'content with-diagram';
    } catch (err) {
      this.state = 'content with-error';
      this.errMsg = err.message;
      console.error(err);
    }
  }

  // 打开文件对话框
  openFileDialog() {
    document.querySelector('#file-input').click();
  }

  // 打开图表文件
  openDiagramFile(event) {
    // 只获取第一个文件
    const file = event.target.files[0];
    this.importFile(file);
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
    this.importFile(file);
  }

  // 将文件导入Modeler
  importFile(file) {
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

  // 新建图表功能
  createNewDiagram() {
    // 定义一个最基本的图表
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0g4n8qy" targetNamespace="http://bpmn.io/schema/bpmn" xmlns:modeler="http://camunda.org/schema/modeler/1.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">',
      '  <bpmn:process id="Process_1gid784" isExecutable="true">',
      '    <bpmn:startEvent id="StartEvent_1" />',
      '  </bpmn:process>',
      '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">',
      '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1gid784">',
      '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">',
      '        <dc:Bounds x="179" y="159" width="36" height="36" />',
      '      </bpmndi:BPMNShape>',
      '    </bpmndi:BPMNPlane>',
      '  </bpmndi:BPMNDiagram>',
      '</bpmn:definitions>',
    ].join('\n');
    // 打开该图表
    this.openDiagram(xml);
  }

  // 将流程保存为XML格式的定义，异步执行
  async saveXML() {
    try {
      // 获取XML文本，不执行格式化
      const {xml} = await this.bpmnModeler.saveXML({format: false});
      // 将文本存入BLOB对象，MIME-TYPE为application/bpmn20-xml，编码为UTF-8
      const blob = new Blob([xml], {type: 'application/bpmn20-xml;charset=utf-8'});
      // 保存该对象
      FileSaver.saveAs(blob, this.getProcessDefinitions().id + '.bpmn');
    } catch(err) {
      console.error('Error occured while saving XML: ', err);
    }
  }

  // 将流程保存为SVG格式的图片，异步执行
  async saveSVG() {
    try {
      // 获取SVG文本
      const {svg} = await this.bpmnModeler.saveSVG();
      // 将文本存入BLOB对象，MIME-TYPE为application/bpmn20-xml，编码为UTF-8
      const blob = new Blob([svg], {type: 'application/bpmn20-xml;charset=utf-8'});
      // 保存该对象
      FileSaver.saveAs(blob, this.getProcessDefinitions().id + '.svg');
    } catch(err) {
      console.error('Error occured while saving SVG: ', err);
    }
  }

  // TODO 实现部署功能
  // 部署流程到工作流引擎
  async deploy() {
    const {xml} = await this.bpmnModeler.saveXML({format: false});
    console.log('prepare to deploy: ' + xml);
    console.warn('but this method is not implemented yet!');
    alert('not implement yet!');
  }

  // 撤销
  undo() {
    this.commandStack.undo();
  }

  // 重做
  redo() {
    this.commandStack.redo();
  }
}
</script>

<style scoped>
/* bpmnjs内置样式 */
@import '../assets/vendor/bpmn-js/assets/diagram-js.css';
@import '../assets/vendor/bpmn-js/assets/bpmn-font/css/bpmn-embedded.css';
@import '../assets/vendor/bpmn-js-properties-panel/assets/bpmn-js-properties-panel.css';

/* 自定义样式 */
#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}
.tool-bar {
  width: 100%;
  border: 1px solid #ccc;
}
.v-splitter {
  /* display: inline-block; */
  border-left: 3px solid #ccc;
  margin: 0px 5px;
}

/* 以下复制自 bpmn-js-examples/properties-panel */
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
