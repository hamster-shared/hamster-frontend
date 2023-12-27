import httpRequest from "@/request";


export function getCanisterList(params:any) {
    return httpRequest({
        url: "/api/icp/account/canisters",
        method: "get",
        params: params,
    });
}

export function getCanisterOverview() {
    return httpRequest({
        url: "/api/icp/account/overview",
        method: "get",
    });
}
export function getIcpDetail(id:string) {
    return httpRequest({
        url: `/api/icp/canister/${id}/overview`,
        method: "get",
    });
}
export function getICpStatistics() {
    return httpRequest({
        url: `/api/icp/account/brief`,
        method: "get",
    });
}
export function addCanister(params:any) {
    return httpRequest({
        url: `/api/icp/account/add-canister`,
        method: "post",
        data: params,
    });
}
export function getControllers (params:any,id:string){

    return httpRequest({
        url: `/api/icp/canister/${id}/controllers`,
        method: "get",
        params,
    });
}
export function getCs (params:any,id:string){

    return httpRequest({
        url: `/api/icp/canister/${id}/consumption`,
        method: "get",
        params,
    });
}

export function handleStatus (params:any){

    return httpRequest({
        url: `/api/icp/canister/change-status`,
        method: "post",
        data:params,
    });
}
