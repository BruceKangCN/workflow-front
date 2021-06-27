<template>
  <!-- 组件根节点 -->
  <div
    id="root"
  >
    <!-- 工具栏 -->
    <ToolBar
      v-show="withDiagram"
      file-type="DMN"
      @openDiagramFile="openDiagramFile($event)"
      @saveXML="saveXML"
      @saveSVG="saveSVG"
      @undo="undo"
      @redo="redo"
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
          Drop DMN diagram from your desktop or <input type="button" @click="createNewDiagram" value="create a new diagram" /> to get started.
        </div>
      </div>
      <!-- 错误信息界面 -->
      <div class="message error">
        <div class="note">
          <p>Oops, we could not display the DMN 1.3 diagram!</p>
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
// **NOTE.en-US**: this is a **JS module**, because dmn-js is written in js
// **NOTE.zh-CN**: 这是一个 **JS模块**，因为 dmn-js 是使用 js 编写的
import { Options } from 'vue-class-component';

import DmnModeler from 'dmn-js/lib/Modeler';
import propertiesPanelModule from 'dmn-js-properties-panel';
import drdAeapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import propertiesProviderModule from 'dmn-js-properties-panel/lib/provider/dmn';
import camundaModdleDescriptor from 'camunda-dmn-moddle/resources/camunda';

import BaseModeler from './common/BaseModeler.vue';

@Options({
  mounted() {
    this.modeler = new DmnModeler({
      // 容器画布
      container: document.querySelector('#modeler-canvas'),
      // Decision Requirements Diagram，决策需求图表
      drd: {
        // 属性面板
        propertiesPanel: {
          parent: document.querySelector('#modeler-properties-panel'),
        },
        // 附加模组
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          drdAeapterModule,
        ],
      },
      // moddle扩展
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
      // 通用设置
      common: {
        keyboard: {
          bindTo: document,
        },
      },
    });
    console.log(this.modeler);
    // 指令栈，用于撤销/重做
    // this.commandStack = this.modeler.get('commandStack');
    console.warn('DMN modeler has no get method and commandStack property.');
  },
})
export default class DecisionModeler extends BaseModeler {
  mimeType = 'application/dmn13-xml';
  fileExtension = 'dmn';
  initialDiagram = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="Definitions_15pefcj" name="DRD" namespace="http://camunda.org/schema/1.0/dmn">',
    '  <decision id="Decision_0ctef5z" name="Decision 1">',
    '    <decisionTable id="DecisionTable_12kxuk1">',
    '      <input id="Input_1">',
    '        <inputExpression id="InputExpression_1" typeRef="string">',
    '          <text></text>',
    '        </inputExpression>',
    '      </input>',
    '      <output id="Output_1" typeRef="string" />',
    '    </decisionTable>',
    '  </decision>',
    '  <dmndi:DMNDI>',
    '    <dmndi:DMNDiagram>',
    '      <dmndi:DMNShape dmnElementRef="Decision_0ctef5z">',
    '        <dc:Bounds height="80" width="180" x="160" y="100" />',
    '      </dmndi:DMNShape>',
    '    </dmndi:DMNDiagram>',
    '  </dmndi:DMNDI>',
    '</definitions>',
  ].join('\n');

  undo() {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 'z',
    });
    document.querySelector('#root').dispatchEvent(event);
  }

  redo() {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 'y',
    });
    document.querySelector('#root').dispatchEvent(event);
  }
}

</script>

<style scoped>
/* dmn-js内置样式 */
@import '~dmn-js/dist/assets/diagram-js.css';
@import '~dmn-js/dist/assets/dmn-js-shared.css';
@import '~dmn-js/dist/assets/dmn-js-drd.css';
@import '~dmn-js/dist/assets/dmn-js-decision-table.css';
@import '~dmn-js/dist/assets/dmn-js-decision-table-controls.css';
@import '~dmn-js/dist/assets/dmn-js-literal-expression.css';
@import '~dmn-js/dist/assets/dmn-font/css/dmn.css';
@import '~dmn-js-properties-panel/dist/assets/dmn-js-properties-panel.css';

/* 自定义样式 */
#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}

/* 以下样式复制自bpmn-js */
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

/* 以下样式复制自dmn-js-examples/modeler */
.dmn-js-parent {
  border: solid 1px #ccc;
}

</style>
