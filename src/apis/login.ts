import httpRequest from "@/request";

interface AddLoginParams {
  code: string,
  // clientId: string,
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


// 获取安装install的信息
export function getInstallations() {
  return httpRequest({
    url: "/api/github/users/installations",
    method: "get",
  });
}

// 获取github仓库列表
// export function getInstallationsRepositories(id:string) {
//   return httpRequest({
//     url: `/api/github/installations/${id}/repositories`,
//     method: "get",
//     data: {id: id}
//   });
// }

// 获取github仓库的权限 all --->不展示调整权限
//                      selected ------>展示调整权限字样
export function getGithubSelection(id:string) {
  return httpRequest({
    url: `/api/repository/selection`,
    method: "get",
    data: {id: id}
  });
}

// install github app
export function installGithubApp() {
  return httpRequest({
    url: `/api/repository/selection`,
    method: "post",
  });
}

// 钱包登录下需要install情况下github auth
export function githubInstallAuth(params:any) {
  return httpRequest({
    url: `/api/github/install/auth`,
    method: "post",
    data: params,
  });
}

// 获取用户是否install GitHub app  github/install
export function githubInstallCheck() {
  return httpRequest({
    url: `/api/github/install/check`,
    method: "get",
  });
}

// 获取用户信息
export function getUserInfo() {
  return httpRequest({
    url: `/api/v2/user`,
    method: "get",
  });
}


// metaMask登录用户信息  /api/github/user/:id
export function getUserInfoById(id:string) {
  return httpRequest({
    url: `/api/v2/user/${id}`,
    method: "get",
  });
}

// metamask钱包登录
export function metamaskLogin(data:any) {
  return httpRequest({
    url: `/api/metamask/login`,
    method: "post",
    data:{address:data.address}
  });
}

// github登录
export function login(params: AddLoginParams) {
  return httpRequest({
    url: `/api/v2/login`,
    method: "post",
    data: params,
  });
}
