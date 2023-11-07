import { reactive } from "vue";
import { defineStore } from "pinia";

export const useDeployAddressStore = defineStore("deployAddress", () => {
  const deployAddressValue = reactive({});
  const setDeployAddress = (val: any) => {
    Object.assign(deployAddressValue,val)
  };

  return { deployAddressValue, setDeployAddress };
});
