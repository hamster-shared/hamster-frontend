import type { MockMethod } from 'vite-plugin-mock'
import marketplaceList from './json/marketplaceList.json'
export default [
  {
    url: '/api/getMarketplaceList',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 200,
        data: marketplaceList,
        message: 'success'
      }
    },
  }
] as MockMethod[]
