<template>
  <!-- eslint-disable max-len -->
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
    >
      <!-- 部署 -->
      <input
        type="button"
        value="deploy"
        title="deploy the process"
        @click="showForm = true"
      >
    </ToolBar>
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
          Drop BPMN diagram from your desktop or <input type="button" @click="createNewDiagram" value="create a new diagram"> to get started.
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
    <!-- 部署表单 -->
    <div v-show="showForm" class="mask">
      <div class="form">
        <h1>Deployment</h1>
        <hr>
        <label>
          name:
          <input type="text" v-model="form.name">
        </label>
        <label>
          tenant id:
          <input type="text" v-model="form.tenantId">
        </label>
        <label>
          deployment source:
          <input type="text" v-model="form.source">
        </label>
        <label>
          enable duplicate filtering:
          <input type="checkbox" v-model="form.filtering">
        </label>
        <label>
          deploy changed only:
          <input type="checkbox" v-model="form.changedOnly">
        </label>
        <input type="button" value="attach file" @click="openFormFileDialog">
        <input type="file" id="form-file" style="display: none;" @change="attachFile">
        <div class="file-list">
          <ul>
            <li v-for="(file, index) in form.files" :key="file.name">
              {{ file.name }}
              <input type="button" value="-" @click="removeFormFile(index)">
            </li>
          </ul>
        </div>
        <hr>
        <footer>
          <input type="button" value="cancel" @click="cancel">
          <input type="button" value="submit" @click="deploy">
        </footer>
      </div>
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
import Axios from 'axios';

import BaseModeler from './common/BaseModeler.vue';

/**
 * 流程编辑器
 *
 * @augments BaseModeler
 */
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
    // 指令栈，用于撤销/重做
    this.commandStack = this.modeler.get('commandStack');
  },
})
export default class ProcessModeler extends BaseModeler {
  /**
   * @private
   * @readonly
   * @type {string}
   * @default 'application/bpmn20-xml'
   */
  mimeType = 'application/bpmn20-xml';

  /**
   * @private
   * @readonly
   * @type {string}
   * @default 'bpmn'
   */
  fileExtension = 'bpmn';

  /**
   * 是否展示部署表单
   */
  showForm = false;

  /**
   * 部署表单
   */
  form = { files: [] };

  /**
   * REST API URL
   */
  apiUrl = process.env.VUE_APP_REST_API_URL;

  /**
   * @private
   * @readonly
   * @type {string}
   */
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

  /**
   * 获取流程定义
   *
   * @returns {any} 流程定义
   */
  getProcessDefinitions() {
    return this.modeler.getDefinitions().rootElements[0];
  }

  /**
   * 部署流程到工作流引擎
   *
   * @async
   * @returns {any} 服务器返回的信息
   */
  async deploy() {
    // 获取流程的定义以及图表
    const {xml} = await this.modeler.saveXML({format: false});
    const {svg} = await this.modeler.saveSVG();

    // 转换为 `File`
    const key = this.getProcessDefinitions().id;
    const process = new File([xml], key + '.' + this.fileExtension);
    const diagram = new File([svg], key + '.svg');

    // 构造表单
    let formData = new FormData();
    formData.append('definition', process, key + '.' + this.fileExtension);
    formData.append('diagram', diagram, key + '.svg');
    for (let i = 0; i < this.form.files.length; i++) {
      formData.append('file' + i, this.form.files[i], this.form.files[i].name);
    }

    if (this.form.name !== undefined) {
      formData.set('deployment-name', this.form.name);
    }
    if (this.form.tenantId !== undefined) {
      formData.set('tenant-id', this.form.tenantId);
    }
    if (this.form.source !== undefined) {
      formData.set('deployment-source', this.form.source);
    }
    if (this.form.filtering !== undefined) {
      formData.set(
        'enable-duplicate-filtering',
        this.form.filtering ? 'true' : 'false',
      );
    }
    if (this.form.changedOnly !== undefined) {
      formData.set(
        'deploy-changed-only',
        this.form.changedOnly ? 'true' : 'false',
      );
    }

    // 发起请求并捕获异常
    try {
      const url = this.apiUrl + '/deployment/create';
      const response = await Axios.post(url, formData);
      switch (response.status) {
        case 200:
          this.form = { files: [] };
          this.showForm = false;
          return response.data;
        case 400:
          console.err('parse exception!', response.data);
          break;
        default: break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * 取消部署
   */
  cancel() {
    this.form = { files: [] };
    this.showForm = false;
  }

  /**
   * 打开表单文件对话框
   */
  openFormFileDialog() {
    document.querySelector('#form-file').click();
  }

  /**
   * 添加表单文件
   *
   * @param {Event} event 触发的事件
   */
  attachFile(event) {
    this.form.files.push(event.target.files[0]);
  }

  /**
   * 移除表单文件
   *
   * @param {number} index 待删除文件的索引
   */
  removeFormFile(index) {
    this.form.files.splice(index, 1);
  }
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
  position: relative;
}

/* 以下复制自bpmn-js-examples/properties-panel */
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
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #212121;
  opacity: 0.8;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.form {
  display: flex;
  flex-flow: column;
  width: 40em;
  height: 20em;
  background-color: #ffffff;
}
.form h1 {
  text-align: center;
}
.form label {
  height: 1.25em;
}
.form input[type=button] {
  width: 6em;
}
.form .file-list {
  flex-grow: 1;
  overflow: auto;
}
.form .file-list input[type=button] {
  width: 1em;
}
.form footer {
  display: flex;
  height: 1.25em;
  justify-content: flex-end;
}
</style>
