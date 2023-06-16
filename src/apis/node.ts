// 导入axios实例
import httpRequest from "@/request";

interface AddParams {
  protocol: string;
  region: string;
  resourceType: string;
  nodeResource: string;
  buyTime: number;
  nodeName: string;
  amount: number;
}

interface GetNodeParams {
  page: number;
  size: number;
}

interface GetOrderParams {
  page: number;
  size: number;
  query: string;
  'X-Start': string;
  'X-End': string;
}
//创建
export function apiAddProjects(params: AddParams) {
  return httpRequest({
    url: "/api/node/order/launch",
    method: "post",
    data: params,
  });
}
// 查询node列表
export function apiGetNodeList(params: GetNodeParams) {
  return httpRequest({
    url: "/api/node/list",
    method: "get",
    params: params,
  });
}
// 查询order列表
export function apiGetOrderList(params: GetOrderParams) {
  return httpRequest({
    url: "/api/node/order/list",
    method: "get",
    params: params,
    headers: {
      'X-Start': params["X-Start"],
      'X-End': params["X-End"]
    }
  });
}
// node统计信息
export function apiGetNodeStatistics() {
  return httpRequest({
    url: "/api/node/statistics-info",
    method: "get",
  });
}
// 资源规格信息
export function apiGetNodeResource(protocol: string) {
  return httpRequest({
    url: `/api/node/resource-standard/${protocol}`,
    method: "get",
  });
}
// 关闭订单
export function apiOrderCancel(id: number) {
  return httpRequest({
    url: `/api/node/order/${id}/cancel`,
    method: "put",
  });
}