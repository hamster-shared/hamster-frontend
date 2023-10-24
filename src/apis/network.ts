// 此文件用来管理生态网络
import httpRequest from "@/request";

// 获取网络列表
export function apiEvmNetwork() {
    return httpRequest({
      url: `/api/projects/chain/network/list`,
      method: "get",
    })
  }