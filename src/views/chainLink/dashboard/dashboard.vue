<template>
  <div class="dashboard dark:bg-[#1D1C1A] bg-[#FFFFFF]">
    <div class="font-bold text-[24px] mb-[8px]">My Middleware</div>
    <div class="text-[16px] dark:text-[#E0DBD2] text-[#73706E] mb-[16px]">Something like that…</div>
    <div class="grid grid-cols-3 gap-4 ">
      <div v-for="item in dashboardList" :key="item"
        class="border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] p-[24px] dark:bg-[#36322D] bg-[#ffffff]">
        <div class="text-[16px] font-bold mb-[16px]">{{ item }}</div>

        <div v-if="item === 'RPC'">
          <div v-for="val in RPCList" :key="val.id"
            class="grid grid-cols-3 gap-1 border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6] pb-[14px] mt-[14px]">
            <div class="mr-[8px]">{{ val.name }}</div>
            <div class="text-left">{{ val.network }}</div>
            <div class="cursor-pointer text-[#E2B578] text-right" @click="networkClick(val)">View</div>
          </div>
          <div class="text-center mt-[18px] cursor-pointer text-[#E2B578]">More</div>
        </div>
        <div v-else-if="item === 'Oracle'">
          <div
            class="flex justify-between pt-[6px] border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6] pb-[14px]">
            <div>Chainlink Functios</div>
            <div class="cursor-pointer text-[#E2B578]" @click="oracleClick">View</div>
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
          </div>

          <div class="text-center mt-[12px] dark:text-[#8A8A8A] text-[#73706E]">The service has not been opened yet</div>
          <div class="text-center mt-[10px] cursor-pointer text-[#E2B578]">Get service now</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="Dashboard">
import { ref } from "vue";
import { useRouter } from "vue-router";
const dashboardList = ref(['RPC', 'Oracle', 'Storage', 'Graph', 'ZKP', 'Others'])
const RPCList = ref([{ name: 'Ethereum', network: 'Mainnet', id: 1 }, { name: 'Ethereum', network: 'Testnet', id: 2 }, { name: 'BSC', network: 'Mainnet', id: 3 }, { name: 'BSC', network: 'Testnet', id: 4 }]);
const router = useRouter();
const networkClick = (val: any) => {
  router.push('/chainlink/RPC')
}

const oracleClick = () => {
  router.push('/chainlink/Oracle')
}
</script>
<style scoped lang="less"></style>