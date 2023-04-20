import { defineStore } from "pinia";
import { RegistryApi } from "@/views/chainLink/oracle/mySubscription/chainApi/registryApi"
import type { EIP1193Provider } from "@web3-onboard/core";
import { LinkTokenApi } from "@/views/chainLink/oracle/mySubscription/chainApi/linkTokenApi";
import { ref, shallowRef } from "vue";
export const useContractApi = defineStore("contractApi", () => {
    const registryApi: any = shallowRef();
    const linkTokenApi: any = shallowRef();
    const provider = shallowRef();
    const networkId = ref('');
    const walletAddress = ref('');
    const apiStatus = ref(false);
  
    const initContractApi = (web3Provider: EIP1193Provider, network: string, address: string) => {
      provider.value = web3Provider;
      networkId.value = network;
      walletAddress.value = address.toLowerCase();
      registryApi.value = new RegistryApi(web3Provider, network);
      linkTokenApi.value = new LinkTokenApi(web3Provider, network);
      apiStatus.value = true;
    };
  
    return {
      registryApi,
      linkTokenApi,
      provider,
      networkId,
      walletAddress,
      apiStatus,
      initContractApi
    };
  });