import { message } from 'ant-design-vue'
export const addToChain = (chainId: string,chainName:string,rpcUrl:string,symbol?:string,decimals?:any) => {
    console.log('chainId,chainName,rpcUrl',chainId,chainName,rpcUrl,symbol,decimals)
    window.ethereum && window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
        {
            chainId: chainId,
            chainName: chainName,
            rpcUrls: [rpcUrl],
            /*
              symbol：本地货币符号；
              decimals：本地货币精度；
            */
            nativeCurrency: {
              symbol: symbol,
              decimals: decimals,
            },
        },
    ],
    }).then((res: any) => {
      message.info('operate successfully')
      // console.log(res)
    }).catch((err: any) => {
    console.log(err.code, 'code')
    if (err.code === 4001) {
        message.info('Cancel adding a network')
    } else {
        message.info('Faild '+err.message)
    }
    }).finally(() => {
    // message.success('success')
    }).catch((err: any) => {
    message.success('faild')
    })
}
export const switchToChain = async (chainId: string,chainName:string,rpcUrl:string) => {
  console.log('~~~~~~',chainId,chainName,rpcUrl)
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
        message.error('Faild '+err.message)
      }
    })
  }