import axios from "axios";

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

export interface RequestOptions {
    /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
    permCode?: string;
    /** 是否直接获取data，而忽略message等 */
    isGetDataDirectly?: boolean;
    /** 请求成功是提示信息 */
    successMsg?: string;
    /** 请求失败是提示信息 */
    errorMsg?: string;
    /** 是否mock数据请求 */
    isMock?: boolean;
}

// 创建一个 axios 实例
const service = axios.create({
  // baseURL: "/api", // 所有的请求地址前缀部分
  baseURL: "/mock-api",
  timeout: 180000, // 请求超时时间毫秒
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem("token") || '';
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers['Authorization'] = 'Bearer '+ token;
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    // console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response: any) {
    // console.log(response);
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data;
    // 这个状态码是和后端约定的
    const code = dataAxios.reset;
    return dataAxios;
  },
  function (error: any) {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo')
      window.location.href = '/login';
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.log(error);
    return Promise.reject(error);
  }
);
export default service;