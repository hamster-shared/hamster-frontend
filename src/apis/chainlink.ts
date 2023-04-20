import httpRequest from "@/request";

import type { 
    sublistParams,
    createSubParams,
    payFundParams,
    consumerAddParams,
    expenseListParams,
    depositListParams,
    consumerListParams,
    consumerInTableParams,
    oracleTableParams,
    getSubscriptionParams,
    createRequestParams,
    updateSubParams,
    updateConsumerParams,
    ExecSubParams,
    updateTestSubParams,
    projectsParams
}  from './utils/chainlinkInterface'

//订阅列表
export function apiSublist(params: sublistParams) {
    return httpRequest({
        url: "/api/chainlink/subscriptions",
        method: "get",
        params: params,
    });
}

// 获取Chainlink oracle页面table数据
export function apiGetOracleTableParams(params: oracleTableParams) {
    return httpRequest({
        url: "/api/chainlink/requests",
        method: "get",
        params: params,
    });
}

// 获取Chainlink oracle页面echart数据 //testnet-mumbai
export function apiGetOracleEchartParams(network: string) {
    return httpRequest({
        url: `/api/chainlink/request/overview/${network}`,
        method: "get",
    });
}

// 获取Chainlink rpc页面echart数据
export function apiGetRpcEchartParams(network: string) {
    return httpRequest({
        url: `/api/rpc/overview/${network}`,
        method: "get",
    });
}

export function apiGetSubscriptionParams(params: getSubscriptionParams) {
    return httpRequest({
        url: '/api/chainlink/subscription/overview',
        method: "get",
        params: params
    });
}

// 获取createRequest页面的template列表
export function apiGetRequestTemplate() {
    return httpRequest({
        url: '/api/chainlink/request/templates',
        method: "get",
    });
}

// 根据request template id查询脚本信息
export function apiGetShowRequestTemplateScript(id:string|number) {
    return httpRequest({
        url: `/api/chainlink/request/templates/${id}`,
        method: "get",
    });
}

// 创建chainlink request
export function apiPostCreateRequest(params: createRequestParams) {
    return httpRequest({
        url: '/api/chainlink/request',
        method: "post",
        data: params
    })
}

// 测试订阅
export function apiExecSub(params: ExecSubParams) {
    return httpRequest({
        url: "/api/chainlink/request/exec",
        method: "post",
        data: params,
    });
}
// 创建订阅
export function apiCreateSub(params: createSubParams) {
    return httpRequest({
        url: "/api/chainlink/subscription/subscription",
        method: "post",
        data: params,
    });
}
// 给订阅号添加消费者
export function apiConsumerAdd(params: consumerAddParams) {
    return httpRequest({
        url: "/api/chainlink/consumer",
        method: "post",
        data: params,
    });
}
// funds充值
export function apiPayFund(id:number,params: payFundParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/fund`,
        method: "post",
        data: params,
    });
}
// 订阅详情
export function apiSublistDetail(id:string|number) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}`,
        method: "get",
    });
}
// expense 列表
export function apiExpenseList(id:number,params:expenseListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/expenses`,
        method: "get",
        params:params
    });
}
// deposit 列表
export function apiDepositList(id:number,params:depositListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/deposits`,
        method: "get",
        params:params
    });
}
// consumer 列表
export function apiConsumerList(id:number,params:consumerListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/consumers`,
        method: "get",
        params:params
    });
}
// 删除consumer
export function apiDelConsumer(id:number,consumerId:number) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/consumer/${consumerId}`,
        method: "delete"
    });
}
// 添加消费者弹框里面的table
export function consumerTable(id:string,params:consumerInTableParams) {
    return httpRequest({
        url: `/api/chainlink/consumer/${id}/hamster-consumer`,
        method: "get",
        params:params
    });
}
// 添加消费者弹框里面的下拉框可选项目
export function consumerProjects(params:projectsParams) {
    return httpRequest({
        url: `/api/chainlink/consumer/projects`,
        method: "get",
        params:params
    });
}
// 添加消费者弹框里面的下拉框可选订阅
export function consumerSublist() {
    return httpRequest({
        url: `/api/chainlink/subscription/valid-subscription`,
        method: "get",
    });
}
// 修改订阅状态
export function updateSub(params:updateSubParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/subscription-status`,
        method: "put",
        data:params
    });
}
// 修改消费者状态
export function updateConsumer(params:updateConsumerParams) {
    return httpRequest({
        url: `/api/chainlink/consumer/consumer-status`,
        method: "put",
        data:params
    });
}
// 修改金额状态
export function updateFund(params:updateConsumerParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/fund-status`,
        method: "put",
        data:params
    });
}
// 更新测试订阅
export function updateTestSub(id:number,params:updateTestSubParams) {
    return httpRequest({
        url: `/api/chainlink/request/exec/${id}`,
        method: "put",
        data:params
    });
}
// 测试订阅的consumer下拉列表
export function testConsumerSub(id:string|number) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/consumer-address`,
        method: "get",
    });
}
// dashboard概览即获取可用链
export function apiChains() {
    return httpRequest({
        url: `/api/rpc/chains`,
        method: "get",
    });
}

// 获取用户所有订阅金额
export function getCustomerBalance() {
    return httpRequest({
        url: `/api/chainlink/subscription/balance`,
        method: "get",
    });
}

// 创建chainlink request
export function apiPostUpdateRequest(id:string,params: createRequestParams) {
    return httpRequest({
        url: `/api/chainlink/request/${id}`,
        method: "put",
        data: params
    })
}

// 根据id去查询请求详情
export function apiDetailRequest(id:string) {
    return httpRequest({
        url: `/api/chainlink/request/${id}`,
        method: "get",
    })
}
