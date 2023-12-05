// 导入axios实例
import httpRequest from "@/request";

//获取聊天记录
export function apiChatHistory(id: string) {
    return httpRequest({
      url: `/api/user/${id}/chat`,
      method: "get",
    });
  }

//获取聊天详情
export function apiChatDetail(id: string) {
  return httpRequest({
    url: `/api/chat/${id}/detail`,
    method: "get",
  });
}

//聊天接口
export function apiChat(id: string) {
    return httpRequest({
      url: `/api/chat`,
      method: "get",
    });
  }