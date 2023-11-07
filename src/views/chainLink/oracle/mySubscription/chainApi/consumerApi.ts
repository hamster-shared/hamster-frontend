import { createContractApi } from './contractApi'
import { abis } from './contractConfig';
import { ethers } from 'ethers';
import type { EIP1193Provider } from '@web3-onboard/core';

export class ConsumerApi {
  private contractApi;
  public contract;
  private provider;

  constructor(walletProvider: EIP1193Provider, contractAddress: string) {

    this.provider = new ethers.providers.Web3Provider(walletProvider)

    const contractABI = abis.consumer;

    this.contractApi = createContractApi(contractAddress, contractABI, this.provider);

    this.contract = this.contractApi.getContract();
  }


  async executeRequest(
    source: string,
    secrets: string,
    args: string[],
    subscriptionId: number,
    gasLimit: number): Promise<any> {
    return this.contractApi.sendTransaction(
      'executeRequest',
      source, secrets,
      args,
      subscriptionId,
      gasLimit,
      {
        gasLimit: 1000000,
      });
  }

  async getDONPublicKey(): Promise<any> {
    return this.contractApi.query('getDONPublicKey');
  }
  async latestRequestId(): Promise<any> {
    return this.contractApi.query('latestRequestId');
  }

  async eventOCRResponse(execId: string, fromBlock?: number) {
    let toBlock = undefined;
    const blockNumber = await this.provider.blockNumber;
    if (fromBlock) {
      toBlock = (fromBlock + 1000) > blockNumber ? blockNumber : fromBlock + 1000;
    }
    console.log(fromBlock)
    return this.contractApi.events('OCRResponse', fromBlock, toBlock, execId);
  }

}
