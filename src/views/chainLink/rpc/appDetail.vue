<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">AIShow</div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Get Started">
        <div class="border mb-[30px] border-solid border-[#EBEBEB] dark:border-[#434343] rounded-[12px] p-[30px]">
          <div class="text-[21px] font-bold">API Key</div>
          <div class="mt-[20px] p-[16px] rounded-[8px] bg-[#F5F5F5] dark:bg-[#323232] flex justify-between items-center w-1/2">
            <label class="text-[#73706E] dark:text-[#FFFFFF]">309xekoijx909hie892309023d47191co3i1ce</label>
            <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard('')" />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-[#F3F3F3] dark:bg-[#10100F] p-[20px] rounded-[12px] hover:border hover:border-solid hover:border-[#E2B578]">
            
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Stats" force-render>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="Security" disabled>Content of Tab Pane 3</a-tab-pane>
      <a-tab-pane key="4" tab="Teamwork" disabled>Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
  </template>
<script setup lang="ts">
import { ref } from 'vue';
import { copyToClipboard } from "@/utils/tool";

const activeKey = ref('1');
</script>
<style scoped lang="less">
:deep(.ant-tabs .ant-tabs-tab){
  padding: 12px 30px;
}
:deep(.ant-tabs-top>.ant-tabs-nav:before){
  border-color: #434343;
}
// :deep(.ant-tabs-ink-bar){
//   width: 32px;
// }
</style>