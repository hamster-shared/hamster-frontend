<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] text-[16px] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <div class="flex items-center mb-[32px]">
      <img src="@/assets/icons/gas-usage.svg" class="mr-[8px]" />
      <span class="text-[24px] font-bold">Gas Usage Report</span>
    </div>
    <div class="flex justify-between">
      <div class="font-bold">Unit Test Result</div>
      <div>2 issues</div>
    </div>
    <div class="mt-[24px]">Contract：MyToken</div>
    <div class="mt-[10px] flex items-center">
      <img src="@/assets/icons/gas-y.svg" class="w-[30px] h-[30px]" />
      <div class="dark:text-[#E0DBD2] text-[#73706E]">can mint tokens（68288 gas）</div>
    </div>
    <div class="mt-[10px] flex items-center">
      <img src="@/assets/icons/gas-n.svg" class="w-[30px] h-[30px]" />
      <div class="dark:text-[#E0DBD2] text-[#73706E]">can mint tokens（68288 gas）</div>
    </div>
    <div class="font-bold mt-[24px]">Issues  Info</div>
    <div class="mt-[24px]">1）Contract：MyERC721</div>
    <div class="text-[#73706E] dark:text-[#E0DBD2] pt-[16px] px-[16px]">
      <div class="mb-[16px]">Should have the correct name and symbol：</div>
      <div class="whitespace-pre-wrap">{{  htmlText  }}</div>
    </div>
    <div class="font-bold mt-[24px] mb-[20px]">Gas Usage for Methods</div>
    <a-table :dataSource="methodsData" :columns="methodsColumns" :pagination="false" style="width:100%">
    </a-table>
    <div class="font-bold mt-[24px] mb-[20px]">Gas Usage for Deployments</div>
    <a-table :dataSource="deploymentsData" :columns="deploymentsColumns" :pagination="false" style="width:100%">
    </a-table>
    <div class="dark:text-[#6B6B6B] text-[#73706E] mt-2 text-[14px]">Support by eth-gas-reporter（0.8.9+commit.e5eed63a）</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const htmlText = ref("Token name is incorrect\n+ expected - actual\n- MyERC721\n+ MyERC7210\nat Context.<anonymous>(test/ERC721.test.js:15:16)\nat runMictotasks(<anonymous>)\nat processTicksAndRejections(node:internal/process/task_quequs:96:5)");
const deploymentsData = ref([]);
const methodsData = ref([]);
const methodsColumns = [
  {
    title: 'Contract',
    dataIndex: 'name',
    align: "center",
    ellipsis: true,
    key: 'name',
  },
  {
    title: 'Method',
    dataIndex: 'Method',
    align: "center",
    key: 'Method',
  },
  {
    title: 'Min',
    dataIndex: 'Min',
    align: "center",
    key: 'Min',
  },
  {
    title: 'Max',
    dataIndex: 'Max',
    align: "center",
    ellipsis: true,
    key: 'Max',
  },
  {
    title: 'Avg',
    dataIndex: 'Avg',
    align: "center",
    key: 'Avg',
  },
  {
    title: '#calls',
    dataIndex: 'calls',
    align: "center",
    key: 'calls',
  },
];

const deploymentsColumns = [
  {
    title: 'Contract',
    dataIndex: 'name',
    align: "center",
    ellipsis: true,
    key: 'name',
  },
  {
    title: 'Method',
    dataIndex: 'Method',
    align: "center",
    key: 'Method',
  },
  {
    title: 'Min',
    dataIndex: 'Min',
    align: "center",
    key: 'Min',
  },
  {
    title: 'Max',
    dataIndex: 'Max',
    align: "center",
    ellipsis: true,
    key: 'Max',
  },
  {
    title: 'Avg',
    dataIndex: 'Avg',
    align: "center",
    key: 'Avg',
  },
  {
    title: '#calls',
    dataIndex: 'calls',
    align: "center",
    key: 'calls',
  },
];

</script>
<style lang='less' scoped>

</style>