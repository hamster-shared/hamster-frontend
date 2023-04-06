import httpRequest from "@/request";
interface sublistParams {
    page:number;
    size:number;
    network:string
}
//订阅列表
export function apiSublist(params: sublistParams) {
    return httpRequest({
        url: "/api/chainlink/subscriptions",
        method: "get",
        params: params,
    });
}

// 获取subscription概览
interface getSubscriptionParams {
    network: string;
    token: string
}

//创建request
interface createRequestParams {
    name: string;
    script: string
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
    });
}