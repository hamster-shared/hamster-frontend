<template>
  <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] mt-[32px] p-[32px]">
    <div class="flex mb-[20px]">
      <div class="text-[24px] font-bold">Contract A</div>
      <div class="ml-[10px] border border-solid border-[#EBEBEB] dark:border-[#434343] rounded-[32px] text-[14px] py-[6px] px-[16px]">Ethereum/Goerli</div>
    </div>
    <div class="flex">
      <div>0x5Baf…3400
        <svg-icon name="copy" size="18" class="svg-color ml-2" @click="copyToClipboard('')" />
      </div>
      <div class="ml-[30px]">
        <label class="text-[#383B46] dark:text-[#E0DBD2] mr-[10px]">Version:</label>
        <label>#1</label>
      </div>
    </div>
    <div class="mt-[30px]">
      <div class="font-bold mb-[20px]">Source Info</div>
      <div class="text-[14px]">
        <img src="@/assets/images/link.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
        <img src="@/assets/images/link-white.png" class="h-[17px] mr-[10px] dark:hidden" />
        https://github.com/hamster-shared/hamster.git/main
      </div>
      <div class="mt-[10px] text-[14px]">
        <img src="@/assets/images/info.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
        <img src="@/assets/images/info-white.png" class="h-[17px] mr-[10px] dark:hidden" />
        3f433f6 | commit on Nov 3, 2022 | upgrade go version
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import{ copyToClipboard } from "@/utils/tool";

</script>
<style scoped lang="less">
.svg-color{
  color: #E2B578;
}
</style>