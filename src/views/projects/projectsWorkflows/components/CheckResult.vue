<template>
  <div class="rounded-[12px] mt-[24px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211]">
    <div class="check-container">
      <span class="check-container-title">Check Result</span>

      <div v-for="(item, index) in resultInfo" :key="index" class="items-center grid grid-cols-4 pl-10 rounded-[5px] my-8 border border-[#B5B5B5] border-solid">
        <span class="text-2xl font-bold">{{ item.title }}</span>
        <div v-for="content in item.content" class="py-8">
          <span class="text-5xl">{{ content.number }}</span>
          <span class="block text-2xl">{{ content.issues }}</span>
          <span class="text-base">{{ content.type }}</span>
        </div>
      </div>

      <div class="grid grid-cols-4 p-10 rounded-[5px] my-8 border border-[#B5B5B5] border-solid">
        <span class="text-2xl font-bold">{{ gasInfo.title }}</span>
        <div>
          <span class="text-5xl">{{ gasInfo.number }}</span>
          <span class="block text-2xl">{{ gasInfo.issues }}</span>
          <span class="text-base">{{ gasInfo.type }}</span>
        </div>
        <div class="flex col-span-2">
          <div class="flex-1">
            <span class="block text-xl font-bold">{{ gasInfo.report }}</span>
            <span class="text-xl">{{ gasInfo.reportInfo }}</span>
          </div>
          <a-button class="view-detail-btn" type="link">View Detail</a-button>
        </div>
      </div>

      <div class="grid grid-cols-4 p-10 rounded-[5px] my-8 border border-[#B5B5B5] border-solid">
        <div>
          <span class="block text-2xl font-bold">{{ AiInfo.title }}</span>
          <span class="text-base">{{ AiInfo.subtitle }}</span>
        </div>
        <span class="col-span-3 text-lg">{{ AiInfo.content }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const resultInfo = ref([
    {
      title: 'Secutity Analysis',
      content: [
        {
          number: '11',
          issues: 'issues',
          type: 'MetaTrust (SA)'
        },
        {
          number: '0',
          issues: 'issues',
          type: 'MetaTrust (SP)'
        },
        {
          number: '3',
          issues: 'issues',
          type: 'Mythril'
        }
      ]
    },
    {
      title: 'Open Source Analysis',
      content: [
        {
          number: '12',
          issues: 'issues',
          type: 'MetaTrust (OSA)'
        }
      ]
    },
    {
      title: 'Code Quality Analysisi',
      content: [
        {
          number: '6',
          issues: 'issues',
          type: 'MetaTrust (CQ)'
        },
        {
          number: '3',
          issues: 'issues',
          type: 'Solhint'
        }
      ]
    }
  ])

  const gasInfo = ref(
    {
      title: 'Gas Usage Analysis',
      number: '2',
      issues: 'issues',
      type: 'eth-gas-reporter',
      report: 'Unit Test Report',
      reportInfo: 'Contract：MyToken2,Contract：MyERC72',
    }
  )

  const AiInfo = ref({
    title: 'AI Analysis',
    subtitle: 'Support by OpenAI',
    content: 'This code is a contract that implements the ERC-20O token interface.It includes some core functions, such as transferring tokens, querying balance amount, approve third-party transfer tokens, query token authorization quota, etc.'
  })
    
</script>

<style lang="less" scoped>
  .check-container {
    padding: 32px;
    border-radius: 12px;
    margin-bottom: 24px;
    .check-container-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 32px;
    }
  }
  .view-detail-btn {
    @apply text-2xl font-bold p-0;
  }
</style>