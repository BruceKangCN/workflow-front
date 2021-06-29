<template>
  <div class="tool-bar">
    <!-- 打开文件 -->
    <input
      type="button"
      :value="'open ' + fileType + ' diagram'"
      :title="'open ' + fileType + ' diagram'"
      @click="openFileDialog"
    />
    <input
      type="file"
      id="file-input"
      @change="$emit('openDiagramFile', $event.target.files[0])"
      v-show="false"
    />
    <span class="v-splitter"></span>
    <!-- 保存 -->
    <span>save</span>
    <!-- 保存为XML图表 -->
    <input
      type="button"
      :value="fileType + ' diagram'"
      :title="'save ' + fileType + ' diagram'"
      @click="$emit('saveXML')"
    />
    <!-- 保存为SVG图片 -->
    <input
      type="button"
      value="SVG image"
      title="save as SVG image"
      @click="$emit('saveSVG')"
    />
    <span class="v-splitter"></span>
    <input type="button" value="<-" title="undo" @click="$emit('undo')" />
    <input type="button" value="->" title="redo" @click="$emit('redo')" />
    <span class="v-splitter"></span>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: [
    'fileType',
  ],
  emits: [
    'openDiagramFile',
    'saveXML',
    'saveSVG',
    'undo',
    'redo',
  ],
})
export default class ToolBar extends Vue {
  /**
   * 打开文件对话框
   *
   * @public
   */
  public openFileDialog(): void {
    document.querySelector<HTMLElement>('#file-input')?.click();
  }
}
</script>


<style scoped>
.tool-bar {
  width: 100%;
  border: 1px solid #ccc;
}
.v-splitter {
  /* display: inline-block; */
  border-left: 3px solid #ccc;
  margin: 0px 5px;
}

</style>
