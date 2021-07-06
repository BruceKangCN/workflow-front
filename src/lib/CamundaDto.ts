/**
 * 该文件包含后端响应的各种 `DTO` 对象的定义
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
 * `ProcessInstanceDto` 的定义
 */
export interface IProcessInstanceDto {
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

/**
 * `TaskDto` 的定义
 */
export interface ITaskDto {
  id: string,
  executionId: string,
  processDefinitionId: string,
  processInstanceId: string,
  taskDefinitionKey: string,
  name: string,
  priority: number,
  suspended: boolean,
  formKey: string,
  created: string,
  due: string | null,
  followUp: string | null,
  owner: string | null,
  assignee: string | null,
  tenantId: string | null,
  parentTaskId: string | null,
  delegationState: string | null,
  description: string | null,
  caseDefinitionId: string | null,
  caseInstanceId: string | null,
  caseExecutionId: string | null,
}
