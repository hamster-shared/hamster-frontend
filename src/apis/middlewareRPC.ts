import httpRequest from "@/request";

// 获取是否zan授权数据
export function apiGetZanUserAuthed() {
    return httpRequest({
        url: '/api/v2/zan/account/authed',
        method: "get",
    });
}

// 获取zan授权登录地址
export function apiGetZanAuthUrl() {
    return httpRequest({
        url: '/api/v2/zan/account/auth_url',
        method: "get",
    });
}

export function apiZanExchangeAccessToken(autoCode: string){
    return httpRequest({
        url: '/api/v2/zan/account/access_token',
        method: "post",
        data: {
            authCode: autoCode
        }
    });
}

export function apiZanPlan() {
    return httpRequest({
        url: '/api/v2/zan/node-service/plan',
        method: "get"
    });
}

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


export function apiZanApiKeyCreditCost(apiKey: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/credit-cost?apiKeyId=${apiKey}`,
        method: "get"
    });
}

export function apiZanApiKeyRequestStats(apiKey: string,timeInterval: string, ecosystem: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests?apiKeyId=${apiKey}&timeInterval=${timeInterval}&ecosystem=${ecosystem}`,
        method: "get"
    });
}


export function apiZanCreateApiKey(name: string){
    return httpRequest({
        url: '/api/v2/zan/node-service/api-keys',
        method: "post",
        data: {
            name: name
        }
    });
}


export function apiZanApiKeyDetail(apiKeyId: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/detail?apiKeyId=${apiKeyId}`,
        method: "get"
    });
}

export function apiZanApiKeyRequestActivityStats(apiKeyId: string,timeInterval: string, ecosystem: string) {
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/requests-activity?apiKeyId=${apiKeyId}&timeInterval=${timeInterval}&ecosystem=${ecosystem}`,
        method: "get"
    });
}

export function apiZanApiKeyRequestOriginStats(apiKeyId: string,timeInterval: string){
    return httpRequest({
        url: `/api/v2/zan/node-service/api-keys/stats/request-origin?apiKeyId=${apiKeyId}&timeInterval=${timeInterval}`,
        method: "get"
    });
}

export function apiZanEcosystemsDigest(){
    return httpRequest({
        url: `/api/v2/zan/node-service/ecosystems/digest`,
        method: "get"
    });
}
