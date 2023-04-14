// 导入axios实例
import httpRequest from "@/request";

// 获取中间件页面rpc数据
export function apiGetMiddleWareRpc() {
  return httpRequest({
      url: '/api/middleware/rpc',
      method: "get",
  });
}

// 判断用户是否开通了服务
export function apiGetIfOpenService(serverName:string) {
  return httpRequest({
      url: `/api/middleware/is-active/${serverName}`,
      method: "get",
  });
}

// 为用户开通服务
export function apiPostCustomerOpenService(serverName:string) {
  return httpRequest({
      url: `/api/middleware/active/${serverName}`,
      method: "post",
  });
}