<template>
  <div class="fjs-container">
    <!-- TODO 增加 method，action属性 -->
    <form class="fjs-form">
      <div
        v-for="component in schema.components"
        :key="component.key"
        :class="fieldDivClass(component.type)"
      >
        <!-- 用于无选项字段的字段标签 -->
        <label
          v-if="!hasOptions(component.type)"
          :for="component.key"
          class="fjs-form-field-label"
        >
          {{ component.label }}<span v-if="required(component)">*</span>
        </label>
        <!-- TODO 增加长度，模式，数值校验 -->
        <!-- 用于无选项字段的输入框 -->
        <input
          v-if="!hasOptions(component.type)"
          class="fjs-input"
          :type="getType(component.type)"
          :name="component.key"
          :id="component.key"
          :required="required(component)"
        >
        <!-- 用于有选项字段的字段标签 -->
        <label v-if="hasOptions(component.type)" class="fjs-form-field-label">
          {{ component.label }}<span v-if="required(component)">*</span>
        </label>
        <!-- 用于单选框字段的选项标签 -->
        <div v-if="component.type === 'radio'">
          <label
            v-for="option in component.values"
            :key="option.value"
            class="fjs-form-field-label"
          >
            <input
              type="radio"
              class="fjs-input"
              :name="component.key"
              :value="option.value"
              :required="required(component)"
            >
            {{ option.label }}
          </label>
        </div>
        <!-- 用于下拉框字段的选项标签 -->
        <select
          v-if="component.type === 'select'"
          class="fjs-select"
          :name="component.key"
          :required="required(component)"
        >
          <option value=""></option>
          <option
            v-for="option in component.values"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    <div class="fjs-form-field fjs-form-field-button">
      <button class="fjs-button" type="reset">Reset</button>
      <button class="fjs-button" type="submit">Submit</button>
    </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { IComponent } from '@/lib/ISchema';

/**
 * 用户表单展示组件
 */
@Options({
  props: ['schema'],
})
export default class TaskForm extends Vue {
  /**
   * 计算字段 `div` 的 `class` 属性
   *
   * @param {string} type 字段类型
   * @returns {string} `class` 属性的计算结果
   */
  protected fieldDivClass(type: string): string {
    return 'fjs-form-field fjs-form-field-' + type;
  }

  /**
   * 计算该类型是否有选项
   *
   * @param {string} type 字段类型
   * @returns {boolean} 该类型是否有选项
   */
  protected hasOptions(type: string): boolean {
    return type === 'radio' || type === 'select';
  }

  /**
   * 字段是否为必需
   *
   * @param {IComponent} component 字段
   * @returns {boolean} 字段是否为必需
   */
  protected required(component: IComponent): boolean {
    return component.validate?.required || false;
  }

  /**
   * 获取 `type` 属性对应的 `input[type]`
   *
   * @param {string} type `type` 属性值
   * @returns {string} `input[type]` 值
   */
  protected getType(type: string): string {
    switch (type) {
      case 'textfield': return 'text';
      case 'number': return 'number';
      case 'checkbox': return 'checkbox';
      case 'radio': return 'radio';
      case 'select': return 'select';
      case 'button': return 'button';
      default: return 'text';
    }
  }
}
</script>

<style scoped>
/* @bpmn-io/form-js内置样式 */
@import '~@bpmn-io/form-js/dist/assets/form-js.css';
@import '~@bpmn-io/form-js/dist/assets/dragula.css';

/* 自定义样式 */
form {
  max-width: 800px;
  background-color: #ccc;
}
.fjs-container div.fjs-form-field-button {
  display: flex;
  justify-content: end;
}
.fjs-container .fjs-button[type=reset],
.fjs-container .fjs-button[type=reset] {
  margin-left: auto;
}
</style>
