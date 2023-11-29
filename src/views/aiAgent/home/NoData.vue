<template>
  <div
    class="bg-[#F3F3F3] dark:bg-[#0E0E0E] rounded-[12px] h-[836px] flex justify-center items-center py-[100px] px-[30px]">
    <div class="text-center">
      <img src="@/assets/images/rpc-nodata.png" class="h-[150px]" />
      <div class="text-[21px] font-medium text-[#656D7A] mt-[30px]">You don`t have any Agent yet, hurry up and go to the
        market to hire one!</div>
      <div class="mt-[60px] flex justify-center items-center">
        <div @click="hireMarketplace"
          class="h-[65px] leading-[65px] w-[360px] cursor-pointer flex justify-center items-center border border-solid border-[#6C6C6C] bg-[#000000] rounded-[10px] text-[16px] text-[#FFFFFF]">
          <svg-icon name="add-white" size="26" class="mr-[10px]" />
          Hire Agent from marketplace
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const hireMarketplace = () => {
  router.push('/aiAgent/marketplace')
}
</script>