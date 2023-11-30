import type { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'
const dataGoods = mock({
  'list|10': [
   {
   goods: () => Random.name(),
   price: 3000,
   },
  ],
})
export default [
  {
   url: '/api/getList',
   method: 'get',
   response: (res: any) => {
   return {
   code: 0,
   dataGoods,
   }
   },
  },
  {
    url: '/api/getMarketplaceList',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 200,
        data: {},
        message: 'success'
      }
    },
  }
] as MockMethod[]
