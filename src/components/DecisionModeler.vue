<template>
  <!-- TODO 添加快捷键 -->
  <!-- 组件根节点 -->
  <div id="root">
    <!-- 工具栏 -->
    <ToolBar
      v-show="withDiagram"
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
    ></div>
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

import BaseModeler from './common/BaseModeler.vue';

@Options({
  mounted() {
    this.modeler = new DmnModeler({
      drd: {
        propertiesPanel: {
          parent: document.querySelector('#properties'),
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          drdAeapterModule,
        ],
      },
    });
  },
})
export default class DecisionModeler extends BaseModeler {
}
</script>

<style scoped>
/* dmn-js内置样式 */
@import '~dmn-js/dist/assets/diagram-js.css';
@import '/dmn-js/dist/assets/dmn-js-shared.css"';
@import '/dmn-js/dist/assets/dmn-js-drd.css"';
@import '/dmn-js/dist/assets/dmn-js-decision-table.css"';
@import '/dmn-js/dist/assets/dmn-js-decision-table-controls.css"';
@import '/dmn-js/dist/assets/dmn-js-literal-expression.css"';
@import '/dmn-js/dist/assets/dmn-font/css/dmn.css"';

/* 以下样式复制自dmn-js-examples/modeler */
#save-button {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: white;
  padding: 5px;
  border: solid 1px #CCC;
  border-radius: 2px;
  padding: 8px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  cursor: default;
  font-size: 14px;
  color: #444;
}
.dmn-js-parent {
  border: solid 1px #ccc;
}
.editor-tabs .tab {
  display: block;
  white-space: nowrap;
  background: white;
  padding: 5px;
  margin: -1px 2px 2px 2px;
  border: solid 1px #CCC;
  border-radius: 0 0 2px 2px;
  padding: 8px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  cursor: default;
  font-size: 14px;
  color: #444;
  flex: 0 0 1%;
}
.editor-tabs {
  display: flex;
  flex-direction: row;
  position: relative;
}
.editor-tabs .tab:first-child {
  margin-left: 5px;
}
.editor-tabs .tab.active {
  border-top-color: white;
}
.editor-tabs .tab.active,
.editor-tabs .tab:hover {
  border-bottom: solid 3px #52b415;
  margin-bottom: 0;
}
</style>
