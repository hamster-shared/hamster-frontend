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
        <div>
          <div class="ethereum-container">
            <div class="flex justify-between items-center">
              <div class="flex justify-between items-center">
                <img src="https://g.alpha.hamsternet.io/ipfs/QmQfkngAChGHkdiGMxQVeHmU3p9BqnZxaeRSdWzZtXF3Pf" class="h-[50px]">
                <label class="font-bold text-[21px] ml-[10px]">Ethereum</label>
              </div>
              <a-dropdown>
                <label class="cursor-pointer text-[16px] flex justify-between items-center" @click.prevent>
                  Mainnet
                  <svg-icon name="right" size="17" class="ml-[10px]" style="transform: rotate(90deg);" />
                </label>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a href="javascript:;">Mainnet</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">Mainnet</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div>
              <div class="label-title">HTTPS</div>
              <div class="label-input">
                <div class="label-text text-ellipsis">309xekoijx909hie892309023d47191co3i1ce</div>
                <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard('')" />
              </div>
              <div class="label-title">WSS</div>
              <div class="label-input">
                <div class="label-text text-ellipsis">309xekoijx909hie892309023d47191co3i1ce</div>
                <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard('')" />
              </div>
            </div>
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
<style scoped>
.ethereum-container {
  @apply dark:bg-[#10100F];
  display: inline-block;
  min-width: 350px;
  padding: 20px;
  background: #F3F3F3;
  border-radius: 12px;
  margin: 10px;
}
.ethereum-container:hover{
  border: 1px solid #E2B578;
}
.text-ellipsis {
  text-overflow: ellipsis; 
  white-space: nowrap; 
  overflow: hidden;
}
.label-title{
  @apply text-[16px] font-medium mt-[20px];
}
.label-input{
  @apply mt-[10px] bg-[#FFFFFF] dark:bg-[#242424] rounded-[8px] py-[12px] px-[10px] flex justify-between items-center;
}
.label-text{
  @apply text-[#A0A0A0] dark:text-[#A0A0A0];
  width: 200px;
}
:deep(.ant-tabs .ant-tabs-tab){
  padding: 12px 30px;
}
:deep(.ant-tabs-top>.ant-tabs-nav:before){
  border-color: #434343;
}
/* // :deep(.ant-tabs-ink-bar){
//   width: 32px;
// } */
</style>