// 导入axios实例
import httpRequest from "@/request";

//获取聊天记录
export function apiChatHistory(id: string) {
    return httpRequest({
      url: `/aiAgent/user/${id}/chat`,
      method: "get",
    });
  }

//获取聊天详情
export function apiChatDetail(id: string) {
  return httpRequest({
    url: `/aiAgent/chat/${id}/detail`,
    method: "get",
  });
}

//聊天接口
export function apiChat(id: string) {
  return httpRequest({
    url: `/aiAgent/chat`,
    method: "get",
  });
}

//创建保存recode
export function apiCreateChat(params: createChatParams) {
  return httpRequest({
    url: `/aiAgent/chat`,
    method: "post",
    data: params
  });
}

interface createChatParams {
  chatId: string,
  userId: number,
  nickname: string,
  position: string,
  description: string,
  recordType: number, // 0:NFT；1:Developer
  logo: string,
}

//获取合约信息
export function apiContractInfo(id: string) {
  return httpRequest({
    url: `/aiAgent/contract/info`,
    method: "get",
  });
}