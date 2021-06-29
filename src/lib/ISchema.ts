/**
 * 该文件包含使用 `@bpmn-io/form-js` 生成的 `JSON` 对象的模式定义
 *
 * @author Bruce Kang
 * @version 0.2.4
 */

/**
 * 单选框/下拉框选项定义
 *
 * @memberof IComponent
 */
export interface IValue {
  /**
   * 选项对应的标签
   */
  label: string,

  /**
   * 选项对应的值
   */
  value: string,
}

/**
 * 表单组件定义
 *
 * @memberof ISchema
 */
export interface IComponent {
  /**
   * 组件对应的字段
   */
  key: string,

  /**
   * 组件对应的标签
   */
  label: string,

  /**
   * 组件类型
   */
  type: string,

  /**
   * 组件类型为单选框/下拉框时对应的选项
   */
  values?: IValue[]
}

/**
 * 导出工具定义
 *
 * @memberof ISchema
 */
export interface IExporter {
  /**
   * 导出工具名称
   */
  name: string,

  /**
   * 导出工具版本
   */
  version?: string,
}

/**
 * 模式定义
 */
export interface ISchema {
  /**
   * 表单类型
   */
  type: string,

  /**
   * 表单组件
   */
  components: IComponent[],

  /**
   * 模式版本
   */
  schemaVersion?: number,

  /**
   * 导出工具
   */
  exporter?: IExporter,
}
