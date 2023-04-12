// 导入axios实例
import httpRequest from "@/request";

// 获取中间件页面rpc数据
export function apiGetMiddleWareRpc() {
  return httpRequest({
      url: '/api/middleware/rpc',
      method: "get",
  });
}