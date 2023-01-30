// 导入axios实例
import httpRequest from "@/request";

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
