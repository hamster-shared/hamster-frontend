import type { MockMethod, MockConfig } from 'vite-plugin-mock'
export default [
  {
    url: '/api/getMarketplaceList',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 200,
        data: {
          name: 'vben',
        },
        message:'success'
      }
    },
  },
  {
    url: '/api/getMarketDetail',
    method: 'post',
    timeout: 2000,
    response: {
      code: 200,
      data: {
        name: 'vben',
      },
      message:'success'
    },
  },
] as MockMethod[]
