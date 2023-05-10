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

//  /api/github/install
export function apiInstall(code:string) {
  return httpRequest({
    url: "/api/github/install",
    method: "post",
    data: {code: code},
  });
}

// /api/user/wallet
export function saveWallet(address:string) {
  return httpRequest({
    url: "/api/user/wallet",
    method: "post",
    data: {address: address},
  });
}
