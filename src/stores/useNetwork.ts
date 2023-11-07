import { ref } from "vue";
import { defineStore } from "pinia";

export const useNetwork = defineStore("network", () => {
  const network = ref('');
  network.value = localStorage.getItem('network') || ''
  const setNetwork = (val: string) => {
    network.value = val
  };

  return { network, setNetwork };
});