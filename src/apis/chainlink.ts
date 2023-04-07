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