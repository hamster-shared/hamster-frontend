import httpAgentRequest from "@/request/agent";

// ai聊天
export function apiAgentChat(params: any) {
    return httpAgentRequest({
      url: "/agent",
      method: "post",
      data: params,
    });
  }