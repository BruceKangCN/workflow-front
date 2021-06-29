<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// **NOTE.en-US**: this is a **JS module**,
//                 because bpmn-js, dmn-js is written in js
// **NOTE.zh-CN**: 这是一个 **JS模块**，因为 bpmn-js，dmn-js 是使用 js 编写的
import { Vue, Options } from 'vue-class-component';
import FileSaver from 'file-saver';
import ToolBar from './ToolBar.vue';

/**
 * 基础模型编辑器
 *
 * @property {any} modeler 内置的 Camunda Modeler
 * @property {any} commandStack 指令栈，用于撤销/重做
 * @property {string} initialDiagram 初始图表
 * @property {string} mimeType MIME-TYPE
 * @property {string} fileExtension 文件扩展名，不包含`.`
 * @property {string} errMsg `openDiagram` 捕获到的错误信息，初始为空
 * @property {string} state 拖拽区域状态，初始值为显示提示信息
 */
@Options({
  components: {
    ToolBar,
  },
  computed: {
    /**
     * 判断当前是否存在图表
     *
     * @public
     * @returns {boolean} 存在图表为true，反之为false
     */
    withDiagram() {
      return this.state.includes('with-diagram');
    },
  },
})
export default class BaseModeler extends Vue {
  /** @member */
  modeler;
  /** @member */
  commandStack;
  /**
   * @readonly
   * @member {string}
   */
  initialDiagram;
  /**
   * @readonly
   * @member {string}
   */
  mimeType;
  /**
   * @readonly
   * @member {string}
   */
  fileExtension;
  /**
   * @member {string}
   * @default ''
   */
  errMsg = '';
  /**
   * @member {string}
   * @default 'content'
   */
  state = 'content';

  /**
   * 打开新图表，使用异步方式读取内容
   *
   * @protected
   * @async
   * @param {string} xml `XML` 格式的初始图表
   */
  async openDiagram(xml) {
    try {
      await this.modeler.importXML(xml);
      this.state = 'content with-diagram';
    } catch (err) {
      this.state = 'content with-error';
      this.errMsg = err.message;
      console.error(err);
    }
  }

  /**
   * 打开图表文件
   *
   * @param {File} file 待导入文件
   */
  openDiagramFile(file) {
    this.importFile(file);
  }

  /**
   * 处理拖拽事件
   *
   * @param {DragEvent} event 拖拽事件
   */
  handelDragOver(event) {
    // 阻止事件进一步传播和默认行为
    event.stopPropagation();
    event.preventDefault();

    // 显式显示这是一次复制
    event.dataTransfer.dropEffect = 'copy';
  }

  /**
   * 处理释放事件
   *
   * @param {DragEvent} event 释放事件
   */
  handleFileSelect(event) {
    // 阻止事件进一步传播和默认行为
    event.stopPropagation();
    event.preventDefault();

    // 只获取第一个文件
    const file = event.dataTransfer.files[0];
    this.importFile(file);
  }

  /**
   * 将文件导入Modeler
   *
   * @param {File} file 待导入文件
   */
  importFile(file) {
    const reader = new FileReader();

    // 设定阅读器加载文件时触发的操作
    reader.onload = (event) => {
      // 获取文件的内容（若非xml，下一步会报错并在模板中显示错误信息）
      const xml = event.target.result;
      // 以图表方式打开xml
      this.openDiagram(xml);
    };

    // 以文本形式读取file
    reader.readAsText(file);
  }

  /**
   * 新建图表功能
   */
  createNewDiagram() {
    // 打开初始图表
    this.openDiagram(this.initialDiagram);
  }

  /**
   * 将流程保存为XML格式的定义，异步执行
   *
   * @async
   */
  async saveXML() {
    try {
      // 获取XML文本，不执行格式化
      const {xml} = await this.modeler.saveXML({format: false});
      // 将文本存入BLOB对象
      const blob = new Blob([xml], {type: this.mimeType + ';charset=utf-8'});
      // 保存该对象
      FileSaver.saveAs(blob, 'diagram.' + this.fileExtension);
    } catch(err) {
      console.error('Error occured while saving XML: ', err);
    }
  }

  /**
   * 将流程保存为SVG格式的图片，异步执行
   *
   * @async
   */
  async saveSVG() {
    try {
      // 获取SVG文本
      const {svg} = await this.modeler.saveSVG();
      // 将文本存入BLOB对象
      const blob = new Blob([svg], {type: this.mimeType + ';charset=utf-8'});
      // 保存该对象
      FileSaver.saveAs(blob, 'diagram.svg');
    } catch(err) {
      console.error('Error occured while saving SVG: ', err);
    }
  }

  /**
   * 撤销
   */
  undo() {
    this.commandStack.undo();
  }

  /**
   * 重做
   */
  redo() {
    this.commandStack.redo();
  }
}

</script>
