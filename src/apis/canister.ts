import httpRequest from "@/request";

interface rechargeParmams {
    canisterId: string,
    amount: number,
}

export interface canisterListParams {
    page:number;
    size:number;
}

// 给应用罐罐充值cycles
export function apiRechargeCanister(id:string,params:rechargeParmams) {
    return httpRequest({
        url: `/api/projects/${id}/recharge/canister`,
        data: params,
        method: "post",
    })
}

// 充值钱包
export function apiRechargeWallet(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/recharge/wallet`,
        method: "post",
    })
}

// 获取icp的账户信息,判断是否需要初始化账户
export function apiIcpAccount(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/icp/account`,
        method: "get",
    })
}

// 创建icp身份
export function apiCreateICPIdentity(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/create/identity`,
        method: "post",
    })
}

// 查询钱包罐信息
export function apiWalletInfo(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/wallet/info`,
        method: "get",
    })
}

// 查询dfx-json数据
export function apiDfxInfo(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/dfx-json`,
        method: "get",
    })
}

// 更新dfx json data
export function apiUpdateDfx(id:string,dfxId:number,jsonData:any) {
    return httpRequest({
        url: `/api/projects/${id}/dfx-json/${dfxId}`,
        method: "put",
        data: jsonData
    })
}

// canister列表
export function apiCanisterList(id:string,params:canisterListParams) {
    return httpRequest({
        url: `/api/projects/${id}/canister/list`,
        params: params,
        method: "get",
    })
}

// 查询icp信息accountId和余额
export function apiAccountInfo(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/account/info`,
        method: "get",
    })
}

// 通过优惠卷生成钱包罐
export function apiRedeemCoupon(id:string,params:any) {
    return httpRequest({
        url: `/api/projects/${id}/redeem/coupon`,
        method: "post",
        data:params
    })
}

// 是否配置json data
export function apiCheckDfx(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/dfx-json/check`,
        method: "get",
    })
}

// 保存json data
export function apiSaveDfx(id:string,params:any) {
    return httpRequest({
        url: `/api/projects/${id}/dfx-json`,
        method: "post",
        data:params
    })
}

// 查询canister id
export function apiGetCanisterId(id:string) {
    return httpRequest({
        url: `/api/projects/${id}/canister`,
        method: "get",
    })
}