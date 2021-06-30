/**
 * 该文件包含使用 `@bpmn-io/form-js` 生成的 `JSON` 对象的模式定义
 *
 * @author Bruce Kang
 * @version 0.2.4
 */

/**
 * 字段类型定义
 */
enum fieldType {
  textfieldField = 'textfield',
  numberField = 'number',
  checkboxField = 'checkbox',
  radioField = 'radio',
  selectField = 'select',
  textField = 'text',
  buttonField = 'button',
}

/**
 * 按钮行为定义
 */
enum action {
  resetAction = 'reset',
  submitAction = 'submit',
}

/**
 * 单选框/下拉框选项定义
 *
 * @memberof IComponent
 */
export interface IValue {
  /**
   * 选项对应的标签
   */
  label: string;

  /**
   * 选项对应的值
   */
  value: string;
}

/**
 * 验证参数定义，可用于单选框、下拉框
 * - 文本字段请使用 `ITextFieldValidation`
 * - 数字字段请使用 `INumberValidation`
 *
 * @memberof IComponent
 */
export interface IValidation {
  /**
   * 是否为必需
   */
  required?: boolean;
}

/**
 * 文本字段验证参数定义
 */
export interface ITextFieldValidation extends IValidation {
  /**
   * 最小长度
   */
  minLength?: number;

  /**
   * 最大长度
   */
  maxLength?: number;

  /**
   * `Regex` 表达式
   */
  regularExpressionPattern?: string;
}

/**
 * 数字字段验证参数定义
 */
export interface INumberValidation extends IValidation {
  /**
   * 最小值
   */
  minimum?: number;

  /**
   * 最大值
   */
  maximum?: number;
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
  key: string;

  /**
   * 组件对应的标签
   */
  label: string;

  /**
   * 组件类型
   */
  type: fieldType;

  /**
   * 组件类型为单选框/下拉框时对应的选项
   */
  values?: IValue[];

  /**
   * 验证设置
   */
  validate?: IValidation;

  /**
   * 按钮对应的行为
   */
  action?: action;
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
  name: string;

  /**
   * 导出工具版本
   */
  version?: string;
}

/**
 * 模式定义
 */
export interface ISchema {
  /**
   * 表单类型
   */
  type: string;

  /**
   * 表单组件
   */
  components: IComponent[];

  /**
   * 模式版本
   */
  schemaVersion?: number;

  /**
   * 导出工具
   */
  exporter?: IExporter;
}
