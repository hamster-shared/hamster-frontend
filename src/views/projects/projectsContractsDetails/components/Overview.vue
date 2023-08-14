<template>
  <div class="my-[32px]">
    <div class="text-[24px] font-bold mb-[32px]">Overview</div>
    <div class="box-css grid grid-cols-4 gap-4 p-[32px]">
      <div class="border-r">
        <div class="box-title">Canister ID</div>
        <div class="box-sub">r3dpl-2yaaa-aaaam-abpsa-cai
          <svg-icon name="copy" size="18" class="ml-[10px]" @click="copyToClipboard('')"/>
        </div>
      </div>
      <div class="border-r">
        <div class="box-title">Canister Name</div>
        <div class="box-sub">DemoContract
          <svg-icon name="copy" size="18" class="ml-[10px]" @click="copyToClipboard('')"/>
        </div>
      </div>
      <div class="border-r">
        <div class="box-title">Version</div>
        <div class="box-sub">#2</div>
      </div>
      <div>
        <div class="box-title">Status</div>
        <div class="box-sub">
          <img :src="getImageUrl(1)" class="h-[16px] mr-1" /> 
          {{ RecentStatusEnums[1] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { copyToClipboard } from "@/utils/tool";
import { RecentStatusEnums, SvgStatusEnums } from "../../projectsList/enums/RecentEnums";



const getImageUrl = (status: any) => {
  let iconName = `${SvgStatusEnums[status]}`;
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
};
</script>
<style scoped >
.box-css{
  @apply bg-[#FFFFFF] dark:bg-[#36322D] dark:border-[#434343];
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  border: 1px solid #EBEBEB;
}
.border-r{
  @apply dark:border-[#3E3A3A];
  border-right: 1px solid #F4F4F4;
}
.box-title{
  @apply font-bold mb-[15px] text-[#383B46] dark:text-[#FFFFFF];
}
.box-sub{
  @apply text-[#151210] dark:text-[#FFFFFF] flex items-center;
}
.svg-icon{
  color: #E2B578;
}
</style>