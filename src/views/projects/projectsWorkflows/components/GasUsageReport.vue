<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] text-[16px] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]"
    v-for="item in gasUsageReportData" :key="item.id">
    <div class="flex items-center mb-[32px]">
      <!-- <img src="@/assets/icons/gas-usage.svg" class="mr-[8px]" /> -->
      <img class="mr-[8px]" :src="getImageUrl(item.checkTool)" />
      <span class="text-[24px] font-bold">{{ item.name }}</span>
    </div>
    <div v-for="(val, index) in item.reportFileData" :key="index">
      <div v-if="index === 0">
        <div class="flex justify-between">
          <div class="font-bold">{{ val.name }}</div>
          <div>{{ val.issue }} issues</div>
        </div>
        <div v-for="(msg, msg_index) in val.message" :key="msg_index">
          <div class="mt-[24px]">Contract：{{ msg.contractName }}</div>
          <div v-for="(res, res_index) in msg.TestResultList" :key="res_index" class="mt-[10px] flex items-center">
            <img v-show="res.result === 1" src="@/assets/icons/gas-y.svg" class="w-[30px] h-[30px]" />
            <img v-show="res.result === 0" src="@/assets/icons/gas-n.svg" class="w-[30px] h-[30px]" />
            <div class="dark:text-[#E0DBD2] text-[#73706E]">{{ res.unitTestTitle }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="index === 1">
        <div class="font-bold mt-[24px]">{{ val.name }}</div>
        <div v-for="(msg, msg_index) in val.message" :key="msg_index">
          <div class="mt-[24px]">{{ msg_index+1 }}）Contract：{{ msg.contractName }}</div>
          <div class="text-[#73706E] dark:text-[#E0DBD2] pt-[16px] px-[16px]">
            <div v-for="(res, res_index) in msg.issuesInfo" :key="res_index" :class="{'mb-[16px]':res_index==0}">{{ res }}</div>
            <!-- <div class="whitespace-pre-wrap">{{  htmlText  }}</div> -->
          </div>
        </div>
      </div>
      <div v-else-if="index === 2">
        <div class="font-bold mt-[24px] mb-[20px]">{{ val.name }}</div>
        <a-table :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :dataSource="val.message" :columns="methodsColumns" :pagination="false" style="width:100%">
        </a-table>
      </div>
      <div v-else-if="index === 3">
        <div class="font-bold mt-[24px] mb-[20px]">{{ val.name }}</div>
        <a-table :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :dataSource="val.message" :columns="deploymentsColumns" :pagination="false" style="width:100%">
        </a-table>
      </div>
    </div>
    <div class="dark:text-[#6B6B6B] text-[#73706E] mt-2 text-[14px]">Support by eth-gas-reporter（0.8.9+commit.e5eed63a）</div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const props = defineProps({
  gasUsageReportData: Array,
})
const { gasUsageReportData } = toRefs(props);
const deploymentGasLimit = ref("");
const timer = ref();
onMounted(() => {
  
  timer.value = window.setInterval(() => {
    if (gasUsageReportData?.value?.length > 0) {
      gasUsageReportData?.value[0].reportFileData.map((item: any, key) => {
        if (key === 3) {
          deploymentGasLimit.value = item.gasLimit;
        }
      })
    }
    if (deploymentGasLimit.value != "") {
      window.clearInterval(timer.value);
    }
  }, 500);
})
onBeforeUnmount(()=>{ //离开当前组件的生命周期执行的方法
  window.clearInterval(timer.value);
})
const methodsColumns = [
  {
    title: 'Contract',
    dataIndex: 'contractName',
    align: "center",
    ellipsis: true,
    key: 'contractName',
  },
  {
    title: 'Method',
    dataIndex: 'method',
    align: "center",
    key: 'method',
  },
  {
    title: 'Min',
    dataIndex: 'min',
    align: "center",
    key: 'min',
  },
  {
    title: 'Max',
    dataIndex: 'max',
    align: "center",
    ellipsis: true,
    key: 'max',
  },
  {
    title: 'Avg',
    dataIndex: 'avg',
    align: "center",
    key: 'avg',
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
    dataIndex: 'contractName',
    align: "center",
    ellipsis: true,
    key: 'contractName',
  },
  {
    title: 'Min',
    dataIndex: 'min',
    align: "center",
    key: 'min',
  },
  {
    title: 'Max',
    dataIndex: 'max',
    align: "center",
    ellipsis: true,
    key: 'max',
  },
  {
    title: 'Avg',
    dataIndex: 'avg',
    align: "center",
    key: 'avg',
  },
  {
    // title: '% of limit(6718926 gas)',
    title: () => ('% of limit('+deploymentGasLimit.value+')'),
    dataIndex: 'limit',
    align: "center",
    key: 'limit',
  },
];

const getImageUrl = (iconName: string) => {
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
}

</script>
<style lang='less' scoped>
:deep(.dark-css .ant-table-thead > tr > th){
  background-color: #36322D;
  border-bottom: 1px solid #36322D;
  font-weight: bold;
}
:deep(.white-css .ant-table-thead > tr > th) {
  background-color: #F6F6F6;
  border-bottom: 1px solid #F6F6F6;
  color: #151210;
  font-weight: bold;
}
:deep(.dark-css .ant-table-tbody),
:deep(.dark-css .ant-table-tbody > tr.ant-table-placeholder:hover > td) {
  background-color: #000000;
  color: #FFFFFF;
}
:deep(.dark-css  .ant-table-tbody > tr > td) {
  border-bottom: 1px solid #302D2D;
}
:deep(.white-css  .ant-table-tbody > tr > td) {
  border-bottom: 1px solid #F4F4F4;
}
:deep(.white-css .ant-table table) {
  border: 1px solid #EBEBEB;
  border-radius: 12px;
}
:deep(.dark-css .ant-table table) {
  border: 1px solid #434343;
  border-radius: 12px;
}
:deep(.ant-table-tbody){
  box-shadow: none;
}
</style>