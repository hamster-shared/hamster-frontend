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

export function addController (params:any) {
    return httpRequest({
        url: `/api/icp/canister/add-controller`,
        method: "post",
        data:params,
    });

}
export function addCycles (params:any) {
    return httpRequest({
        url: `/api/icp/canister/add-cycles`,
        method: "post",
        data:params,
    });

}

export function postInstall (params:any) {
    return httpRequest({
        url: `/api/icp/canister/install`,
        method: "post",
        data:params,
    });

}

export function uploadWasm (file:any,id:string) {
    return httpRequest({
        url: `/api/icp/canister/${id}/upload`,
        method: "post",
        data:file,
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function deleteController (params:any) {
    return httpRequest({
        url: `/api/icp/canister/del-controller`,
        method: "post",
        data:params,
    });

}
