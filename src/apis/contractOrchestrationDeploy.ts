import httpRequest from "@/request";

interface projectParmams {
    projectId: string,
    version: string,
}

interface orchestrationParams extends projectParmams {
    originalArrange: string
}

interface executeParams extends projectParmams {
    fkArrangeId: string,
    network: string,
    arrangeProcessData: string
}

interface updateExecuteParams {
    id: string, //执行id
    arrangeProcessData: string, //执行数据json
}

interface deployInfoParams extends projectParmams{
    contractId: number,
    network: string,
    address: string,
    declareTxHash: string,
    deployTxHash: string,
    status: string,
    abiInfo: string,
}

// interface pageList {
//     page:number;
//     size:number;
// }

// 保存编排信息
export function apiSaveOrchestrationInfo(id:string,params:orchestrationParams) {
    return httpRequest({
        url: `/api/projects/${id}/arrange`,
        data: params,
        method: "post",
    })
}

// 更新编排信息
export function apiUpdateOrchestrationInfo(id:string,params:orchestrationParams) {
    return httpRequest({
        url: `/api/projects/${id}/arrange`,
        data: params,
        method: "put",
    })
}

// 保存编排执行信息
export function apiSaveExecuteInfo(id:string,params:executeParams) {
    return httpRequest({
        url: `/api/projects/${id}/arrange/execute`,
        data: params,
        method: "post",
    })
}

// 更新执行信息
export function apiUpdateExecuteInfo(id:string,params:updateExecuteParams) {
    return httpRequest({
        url: `/api/projects/${id}/arrange/execute`,
        data: params,
        method: "put",
    })
}

// 根据执行id获取执行信息
export function apiGetExecuteInfoById(id:string,executeId:string) {
    return httpRequest({
        url: `/api/projects/${id}/arrange/execute/${executeId}`,
        method: "get",
    })
}

// 根据项目ID和版本获取部署的合约列表 ----> 产品说暂不支持分页
export function apiGetExecuteInfoList(id:string,version:string) {
    return httpRequest({
        url: `/api/projects/${id}/arrange/contract/${version}`,
        method: "get",
    })
}

// 保存部署成功的合约信息 ----> 后端说不用调？待核实
export function apiSaveContractDeployInfo(id:string,params:deployInfoParams) {
    return httpRequest({
        url: `/api/projects/${id}/contract/deploy`,
        data: params,
        method: "post",
    })
}

// 通过项目id和版本获取合约构建物列表
export function apiListByIdAndVersion(id:string,version:string) {
    return httpRequest({
        url: `/api/projects/${id}/contract/${version}`,
        method: "get",
    })
}