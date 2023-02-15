import httpRequest from "@/request";

interface AddLoginParams {
  code: string,
  clientId: string,
}

// login
export function apiLogin(params: AddLoginParams) {
  return httpRequest({
    url: "/api/login",
    method: "post",
    data: params,
  });
}

//修改首次登录状态
export function apiUpdateFristState() {
  return httpRequest({
    url: "/api/user/first/state",
    method: "PUT",
  });
}

//获取用户信息
export function apiGetUser() {
  return httpRequest({
    url: "/api/user",
    method: "get",
  });
}