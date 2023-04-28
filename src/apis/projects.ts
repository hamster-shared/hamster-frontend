// 导入axios实例
import httpRequest from "@/request";

interface AddProjectsParams {
  name: string;
  type: number;
  templateOwner: string;
  frameType: string;
  repoOwner: string;
  templateRepo: string;
  userId: number;
}

interface GetProjectsParams {
  // user: string;
  query: string;
  page: number;
  size: number;
  type: string;
}

interface GetWorkflowsParams {
  type: string;
  page: number;
  size: number;
}

interface GetContractParams {
  query: string;
  version: string;
  network: string;
  page: number;
  size: number;
}

interface GetProjectsContractDeployParams {
  id: string,
  contractId: number,
  projectId: number,
  version: string,
  network: string,
  address: string,
}

interface apiProjectsWorkflowsDetailStopParams {
  id: string,
  workflowsId: string,
  workflowDetailId: string,
}

interface updateProjectparams {
  name: string,
  userId: number,
}

interface apiDupProjectNameParams {
  owner: string;
  name: string;
}
interface GetWorkflowsParams {
  type: string;
  page: number;
  size: number;
}

interface GetPackageParams {
  page: number;
  size: number;
}
interface apiProjectsDeployParams {
  id: string,
  workflowsId: string,
  workflowDetailId: string,
}

interface apiProjectsCodeParams {
  name: string,
  type: number,
  frameType: number,
  fileName: string,
  content: string,
}

interface apiContainerDeployParams {
  containerPort?: number,
  serviceProtocol?: string,
  servicePort?: number,
  serviceTargetPort?: number,
}

//获取Report列表
interface apiReportsParams{
  type:string,
  reportType:string,
}

//获取Report列表
export function apiAddReport(id:string,params:apiReportsParams){
  return httpRequest({
    url:`/api/projects/${id}/reports`,
    method:'get',
    params:params
  })
}

//创建项目
export function apiAddProjects(params: AddProjectsParams) {
  return httpRequest({
    url: "/api/projects",
    method: "post",
    data: params,
  });
}
// 查询项目列表
export function apiGetProjects(params: GetProjectsParams) {
  return httpRequest({
    url: "/api/projects",
    method: "get",
    params: params,
  });
}
// 查询项目详情
export function apiGetProjectsDetail(id: String) {
  return httpRequest({
    url: `/api/projects/${id}`,
    method: "get",
  });
}
// 获取项目workflow列表
export function apiGetProjectsWorkflows(id: String, params: GetWorkflowsParams) {
  return httpRequest({
    url: `/api/projects/${id}/workflows`,
    method: "get",
    params: params,
  });
}
//获取项目合约列表
export function apiGetProjectsContract(id: String, params: GetContractParams) {
  return httpRequest({
    url: `/api/projects/${id}/contract`,
    method: "get",
    params: params,
  });
}
// 获取项目报告列表
export function apiGetProjectsReports(id: String, params: GetWorkflowsParams) {
  return httpRequest({
    url: `/api/projects/${id}/reports`,
    method: "get",
    params: params,
  });
}

//修改项目信息
export function apiUpdateProjectsName(id: String, params: updateProjectparams) {
  return httpRequest({
    url: `/api/projects/${id}`,
    method: "put",
    data: params,
  });
}


//项目check
export function apiProjectsCheck(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/check`,
    method: "post",
  });
}
//项目build
export function apiProjectsBuild(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/build`,
    method: "post",
  });
}

//根据版本查询合约信息
export function apiProjectsContractVersion(id: String, version: String) {
  return httpRequest({
    url: `/api/projects/${id}/contract/${version}`,
    method: "get",
  });
}

//  保存部署信息
export function apiProjectsContractDeploy(params: GetProjectsContractDeployParams) {
  return httpRequest({
    url: `/api/projects/${params.id}/contract/deploy`,
    method: "post",
    data: params,
  });
}

// 停止workflows
export function apiProjectsWorkflowsStop(params: apiProjectsWorkflowsDetailStopParams) {
  return httpRequest({
    url: `/api/projects/${params.id}/workflows/${params.workflowsId}/detail/${params.workflowDetailId}/stop`,
    method: "post",
    data: params,
  });
}

//获取已部署的版本列表
export function apiProjectsVersion(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/versions`,
    method: "get",
  });
}

//查询合约名字列表
export function apiProjectsContractName(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/contract/name`,
    method: "get",
  });
}

//查询network列表
export function apiProjectsContractNetwork(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/contract/network`,
    method: "get",
  });
}

//查询check-tools列表
export function apiProjectsCheckTools(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/check-tools`,
    method: "get",
  });
}

//删除项目
export function apiDeleteProjects(id: String) {
  return httpRequest({
    url: `/api/projects/${id}`,
    method: "delete",
  });
}

//删除workflows 
export function apiDeleteWorkflows(workflowId: String, workflowDetailId: String) {
  return httpRequest({
    // url: `/api/projects/${id}/workflows/${workflowId}`,
    url: `/api/workflows/${workflowId}/detail/${workflowDetailId}`,
    method: "delete",
  });
}

//校验仓库名称是否存在
export function apiDupProjectName(params: apiDupProjectNameParams) {
  return httpRequest({
    url: "/api/projects/check-name",
    method: "post",
    data: params,
  });
}

// 获取 package 列表
export function apiGetProjectsPackages(id: String, params: GetPackageParams) {
  return httpRequest({
    url: `/api/projects/${id}/packages`,
    method: "get",
    params: params,
  });
}

// package里得deploy 操作 
export function apiProjectsDeploy(params: apiProjectsDeployParams) {
  return httpRequest({
    url: `/api/projects/${params.id}/workflows/${params.workflowsId}/detail/${params.workflowDetailId}/deploy`,
    method: "post",
  });
}

// create project by code
export function apiProjectsCode(params: apiProjectsCodeParams) {
  return httpRequest({
    url: `/api/projects/code`,
    method: "post",
    data: params,
  });
}

// 删除部署
export function apiDeleteDeployInfo(packageId: string) {
  return httpRequest({
    // url: `/api/projects/${id}/workflows/${workflowId}`,
    url: `/api/package/${packageId}/deploy-info`,
    method: "delete",
  });
}

// 根据id查询deployHash /projects/:id/contract/deploy/:contractDeployId
export function apiContractDeployId(id: String, contractDeployId: String) {
  return httpRequest({
    url: `/api/projects/${id}/contract/deploy/${contractDeployId}`,
    method: "get",
  });
}

// 容器部署接口
export function apiProjectsContainerDeploy(params: apiProjectsDeployParams, dataParam?: apiContainerDeployParams) {
  return httpRequest({
    url: `/api/projects/${params.id}/workflows/${params.workflowsId}/detail/${params.workflowDetailId}/container/deploy`,
    method: "post",
    data: dataParam,
  });
}
// 判断是否进行容器配置
export function apiContainerCheck(id: String, workflowId: String) {
  return httpRequest({
    url: `/api/projects/${id}/workflows/${workflowId}/container/check`,
    method: "get",
  });
}

// 获取container
export function apiGetContainer(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/container/deploy`,
    method: "get",
  });
}
//  更新配置
export function apiPostContainer(id: String, dataParam?: apiContainerDeployParams) {
  return httpRequest({
    url: `/api/projects/${id}/container/deploy`,
    method: "post",
    data: dataParam,
  });
}

// 查询aptos是否已设置过参数（build按钮）
export function apiCheckSetAptosBuildParams(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/is-needs-params/aptos`,
    method: "get",
  });
}
// aptos build
export function apiAptosBuild(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/aptos-build`,
    method: "get",
  });
}
// 获取aptos参数
export function apiGetAptosBuildParams(id: String) {
  return httpRequest({
    url: `/api/projects/${id}/params/aptos`,
    method: "get",
  });
}
//  更新aptos参数
export function apiPostAptosBuild(id: String, dataParam:{}[]) {
  return httpRequest({
    url: `/api/projects/${id}/params/aptos`,
    method: "post",
    data: dataParam,
  });
}