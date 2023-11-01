import httpRequest from "@/request";

// 用户是否已经进行了zan授权
export function apiGetZanUserAuthed() {
    return httpRequest({
        url: '/api/v2/zan/account/authed',
        method: "get",
    });
}

// 获取zan授权链接接口
export function apiGetZanAuthUrl() {
    return httpRequest({
        url: '/api/v2/zan/account/auth_url',
        method: "get",
    });
}

// 交换zan的 access_token
export function apiZanExchangeAccessToken(autoCode: string){
    return httpRequest({
        url: '/api/v2/zan/account/access_token',
        method: "post",
        data: {
            authCode: autoCode
        }
    });
}

// 套餐信息查询接口
export function apiZanPlan() {
    return httpRequest({
        url: '/api/v2/zan/node-service/plan',
        method: "get"
    });
}

// API KEY 分页查询接口
export function apiZanApiKeyPage(page: number,size: number){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/list?page=${page}&size=${size}`,
        method: "get"
    });
}

export function apiZanApiKeyCreditCostLast24(){
    return apiZanApiKeyPage(1,100).then(resp => {
        // @ts-ignore
        let apiKeys = resp.data.data.map((t:string) => t.apiKeyId)
        return Promise.all( apiKeys.map((t:string) => apiZanApiKeyCreditCost(t)))
    }).then(datas => {
        return datas.map((t:any)=> t.data).reduce((a,b) => a.concat(b), [])
    })
}

// API KEY credit cost 统计查询接口
export function apiZanApiKeyCreditCost(apiKey: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/credit-cost?apiKeyId=${apiKey}`,
        method: "get"
    });
}

// API Key request 统计查询接口
export function apiZanApiKeyRequestStats(apiKey: string,timeInterval: string, ecosystem: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests?apiKeyId=${apiKey}&timeInterval=${timeInterval}&ecosystem=${ecosystem}`,
        method: "get"
    });
}

// 创建API KEY 接口
export function apiZanCreateApiKey(name: string){
    return httpRequest({
        url: '/api/v2/zan/node-service/api-keys',
        method: "post",
        data: {
            name: name
        }
    });
}

// API KEY 接口详情
export function apiZanApiKeyDetail(apiKeyId: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/detail?apiKeyId=${apiKeyId}`,
        method: "get"
    });
}

// API KEY request activity 统计查询接口
export function apiZanApiKeyRequestActivityStats(apiKeyId: string,timeInterval: string, ecosystem: string) {
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests-activity?apiKeyId=${apiKeyId}&timeInterval=${timeInterval}&ecosystem=${ecosystem}`,
        method: "get"
    });
}

export function apiZanApiKeyRequestActivityStatsFail(apiKeyId: string,timeInterval: string, ecosystem: string,method: string) {
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests-activity/failed?apiKeyId=${apiKeyId}&timeInterval=${timeInterval}&ecosystem=${ecosystem}&method=${method}`,
        method: "get"
    });
}

// API KEY request Origin 统计查询接口
export function apiZanApiKeyRequestOriginStats(apiKeyId: string,timeInterval: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests-origin?apiKeyId=${apiKeyId}&timeInterval=${timeInterval}`,
        method: "get"
    });
}



// 链生态摘要信息查询接口
export function apiZanEcosystemsDigest(){
    return httpRequest({
        url: `/api/v2/zan/node-service/ecosystems/digest`,
        method: "get"
    });
}
