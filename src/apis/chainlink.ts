import httpRequest from "@/request";
import type {sublistParams,createSubParams,payFundParams,consumerAddParams,expenseListParams,depositListParams,consumerListParams}  from './utils/chainlinkInterface'

//订阅列表
export function apiSublist(params: sublistParams) {
    return httpRequest({
        url: "/api/chainlink/subscriptions",
        method: "get",
        params: params,
    });
}
// 测试订阅
export function apiExecSub(params: any) {
    return httpRequest({
        url: "/api/chainlink/request/exec",
        method: "post",
        data: params,
    });
}
// 给订阅号添加消费者
export function apiCreateSub(params: createSubParams) {
    return httpRequest({
        url: "/api/chainlink/subscription/subscription",
        method: "post",
        data: params,
    });
}
// 创建订阅
export function apiConsumerAdd(params: consumerAddParams) {
    return httpRequest({
        url: "/api/chainlink/consumer",
        method: "post",
        data: params,
    });
}
// funds充值
export function apiPayFund(id:string,params: payFundParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/found`,
        method: "post",
        data: params,
    });
}
// 订阅详情
export function apiSublistDetail(id:string) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}`,
        method: "get",
    });
}
// expense 列表
export function apiExpenseList(id:string,params:expenseListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/expenses`,
        method: "get",
        params:params
    });
}
// deposit 列表
export function apiDepositList(id:string,params:depositListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/deposits`,
        method: "get",
        params:params
    });
}
// consumer 列表
export function apiConsumerList(id:string,params:consumerListParams) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/consumers`,
        method: "get",
        params:params
    });
}
// 删除consumer
export function apiDelConsumer(id:string,consumerId:string) {
    return httpRequest({
        url: `/api/chainlink/subscription/${id}/consumer/${consumerId}`,
        method: "delete"
    });
}