<template>
  <div class="dashboard dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
    <div class="font-bold text-[24px] mb-[24px]">My Middleware</div>
    <div class="grid grid-cols-3 gap-4 ">
      <div v-for="item in dashboardList" :key="item"
        class="border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] p-[24px]">
        <div class="font-bold">{{ item }}</div>

        <div v-if="item === 'RPC'">
          <div v-for="val in RPCList" :key="val.id" class="grid grid-cols-3 gap-1 pt-[6px]">
            <div>{{ val.name }}</div>
            <div class="text-left">{{ val.network }}</div>
            <div class="cursor-pointer text-[#E2B578] text-right">View</div>
          </div>
        </div>
        <div v-else-if="item === 'Oracle'">
          <div class="flex justify-between pt-[6px]">
            <div>Chainlink Functios</div>
            <div class="cursor-pointer text-[#E2B578]">View</div>
          </div>
        </div>
        <div v-else>
          <div class="text-center mt-[32px]">The service has not been opened yet</div>
          <div class="text-center mt-[16px] cursor-pointer text-[#E2B578]">Get service now</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="Dashboard">
import { ref } from "vue";
const dashboardList = ref(['RPC', 'Oracle', 'Storage', 'Graph', 'ZKP', 'Others'])
const RPCList = ref([{ name: 'Ethereum', network: 'Mainnet', id: 1 }, { name: 'Ethereum', network: 'Testnet', id: 2 }, { name: 'BSC', network: 'Mainnet', id: 3 }, { name: 'BSC', network: 'Testnet', id: 4 }]);
</script>
<style scoped lang="less"></style>