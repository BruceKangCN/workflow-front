<template>
  <!-- 组件根节点 -->
  <div
    id="root"
  >
    <!-- 工具栏 -->
    <ToolBar
      v-show="withDiagram"
      file-type="BPMN"
      @openDiagramFile="openDiagramFile($event)"
      @saveXML="saveXML"
      @saveSVG="saveSVG"
      @undo="undo"
      @redo="redo"
      @deploy="deploy"
    />
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
          Drop BPMN diagram from your desktop or <input type="button" @click="createNewDiagram" value="create a new diagram" /> to get started.
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
import { Options } from 'vue-class-component';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';


import BaseModeler from './common/BaseModeler.vue';

@Options({
  // 在实例挂载时初始化modeler字段，否则无法获取到DOM
  mounted() {
    // Modeler对象，使用构造函数初始化
    this.modeler = new BpmnModeler({
      // 容器画布
      container: document.querySelector('#modeler-canvas'),
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
      // 通用设置
      common: {
        keyboard: {
          bindTo: document,
        },
      },
    });
    // 指令栈，用于撤销/重做
    this.commandStack = this.modeler.get('commandStack');
  },
})
export default class ProcessModeler extends BaseModeler {
  mimeType = 'application/bpmn20-xml';
  fileExtension = 'bpmn';
  // 定义初始图表
  initialDiagram = [
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
}

</script>

<style scoped>
/* bpmn-js内置样式 */
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
@import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

/* 自定义样式 */
#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
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
