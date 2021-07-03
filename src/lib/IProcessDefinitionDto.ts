/**
 * 该文件包含后端响应的 `ProcessDefinitionDto` 对象的定义
 *
 * @author Bruce Kang
 * @version 7.15.0
 */

/**
 * `ProcessDefinitionDto` 的定义
 */
export interface IProcessDefinitionDto {
  id: string;
  key: string;
  category: string;
  description: string | null;
  name: string | null;
  version: number;
  resource: string;
  deploymentId: string;
  diagram: string | null;
  suspended: boolean;
  tenantId: string | null;
  versionTag: string | null;
  historyTimeToLive: number | null;
  startableInTasklist: boolean;
}

/**
 * `Start Instance` 接口返回的结果定义
 */
export interface IStartInstanceDto {
  definitionId: string,
  id: string,
  ended: boolean,
  suspended: boolean,
  links: ILink[],
  businessKey: string | null,
  caseInstanceId: string | null,
  tenantId: string | null,
}

/**
 * 流程实例链接定义
 */
export interface ILink {
  href: string,
  method: string,
  rel: string,
}
