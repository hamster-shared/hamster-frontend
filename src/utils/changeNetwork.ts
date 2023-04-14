import { message } from 'ant-design-vue'
export const addToChain = (chainId: string,chainName:string,rpcUrl:string) => {
    window.ethereum && window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
        {
            chainId: chainId,
            chainName: chainName,
            rpcUrls: [rpcUrl],
            /*
              name：本地货币名称；
              symbol：本地货币符号；
              decimals：本地货币精度；
            */
            // nativeCurrency: {
            //   name: 'Hm',
            //   symbol: 'M',
            //   decimals: 18,
            // },
        },
    ],
    }).then((res: any) => {
    message.info('successfully added')
    // console.log(res)
    }).catch((err: any) => {
    console.log(err.code, 'code')
    if (err.code === 4001) {
        message.info('Cancel adding a network')
    } else {
        message.info('faild')
    }
    }).finally(() => {
    message.success('success')
    }).catch((err: any) => {
    message.success('faild')
    })
}
export const switchToChain = async (chainId: string,chainName:string,rpcUrl:string) => {
    window.ethereum && window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    }).then((res: any) => {
      message.success('success');
      // console.info(res, '成功')
    }).catch((err: any) => {
      if (err.code === 4902) {
        message.info('Please add the network first');
        addToChain(chainId,chainName,rpcUrl)
      } else {
        message.error('faild')
      }
    })
  }