// 导入axios实例
import httpRequest from "@/request";

interface BaseParams {
  page: string | number,
  size: string | number,
}

// 获取链列表
export function apiGetChains() {
  return httpRequest({
    url: "/nodeService/chains",
    method: "get",
  });
}
//获取网络列表
export function apiGetNetworks(chain: String) {
  return httpRequest({
    url: `/nodeService/networks/${chain}`,
    method: "get",
  });
}

// rpc概览
export function apiGetOverview() {
  return httpRequest({
    url: `/api/rpc/overview`,
    method: "get",
  });
}

// 获取某条链具体信息
export function apiGetRPCChain(chain:string) {
  return httpRequest({
    url: `/api/rpc/chain/${chain}`,
    method: "get",
  });
}

// 获取 my network
export function apiGetMynetwork(params:BaseParams) {
  return httpRequest({
    url: `/api/rpc/mynetwork`,
    method: "get",
    params: params,
  });
}

// 获取网络上的请求日志信息
export function apiGetrequestLog(appKey:string, params:BaseParams) {
  return httpRequest({
    url: `/api/rpc/request-log/${appKey}`,
    method: "get",
    params: params,
  });
}

// 查询rpc dashboard数据
export function apiGetRpc() {
  return httpRequest({
      url: `/api/rpc/subscribe`,
      method: "get",
  })
}