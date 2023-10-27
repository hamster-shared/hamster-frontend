<template>
  <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] mt-[32px] p-[32px]">
    <div class="flex mb-[20px]">
      <div class="text-[24px] font-bold">{{baseInfo.contractName}}</div>
      <div class="ml-[10px] border border-solid border-[#EBEBEB] dark:border-[#434343] rounded-[32px] text-[14px] py-[6px] px-[16px]">{{baseInfo.network}}</div>
    </div>
    <div class="flex">
      <div>{{getPonitStr(baseInfo.address,6,4)}}
        <svg-icon name="copy" size="18" class="svg-color ml-2" @click="copyToClipboard(baseInfo.address)" />
      </div>
      <div class="ml-[30px]">
        <label class="text-[#383B46] dark:text-[#E0DBD2] mr-[10px]">Version:</label>
        <label>#{{baseInfo.version}}</label>
      </div>
    </div>
    <div class="mt-[30px]">
      <div class="font-bold mb-[20px]">Source Info</div>
      <div class="text-[14px]">
        <img src="@/assets/images/link.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
        <img src="@/assets/images/link-white.png" class="h-[17px] mr-[10px] dark:hidden" />
        {{baseInfo.url}}
      </div>
      <div class="mt-[10px] text-[14px]">
        <img src="@/assets/images/info.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
        <img src="@/assets/images/info-white.png" class="h-[17px] mr-[10px] dark:hidden" />
        {{baseInfo.codeInfo}}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import{ copyToClipboard, getPonitStr } from "@/utils/tool";

const props = defineProps({
  baseInfo:{
    type:Object,
    default:()=>{}
  }
})

const { baseInfo } = toRefs(props)

</script>
<style scoped lang="less">
.svg-color{
  color: #E2B578;
}
</style>