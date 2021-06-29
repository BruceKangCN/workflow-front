/**
 * 该文件包含使用 `@bpmn-io/form-js` 生成的 `JSON` 对象的模式定义
 *
 * @author Bruce Kang
 * @version 0.2.4
 */

/**
 * 单选框/下拉框选项定义
 *
 * @property {string} label 选项对应的标签
 * @property {string} value 选项对应的值
 * @memberof IComponent
 */
export interface IValue {
  label: string,
  value: string,
}

/**
 * 表单组件定义
 *
 * @property {string} key 组件对应的字段
 * @property {string} label 组件对应的标签
 * @property {string} type 组件类型
 * @property {IValue[]} [values] 组件类型为单选框/下拉框时对应的选项
 * @memberof ISchema
 */
export interface IComponent {
  key: string,
  label: string,
  type: string,
  values?: IValue[]
}

/**
 * 导出工具定义
 *
 * @property {string} name 导出工具名称
 * @property {string} [version] 导出工具版本
 * @memberof ISchema
 */
export interface IExporter {
  name: string,
  version?: string,
}

/**
 * 模式定义
 *
 * @property {string} type 表单类型
 * @property {IComponent[]} components 表单组件
 * @property {number} [schemaVersion] 模式版本
 * @property {IExporter} [exporter] 导出工具
 */
export interface ISchema {
  schemaVersion?: number,
  exporter?: IExporter,
  type: string,
  components: IComponent[],
}
