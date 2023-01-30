<template>
  <div
    class="contracyList p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] mt-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">{{ $t("workFlows.contractList") }}</span>
      <a-button class="btn" @click="toDeployUrl(contractListData[0])" :disabled="contractListData?.length <= 0">{{
        $t('common.deploy')
      }}</a-button>
    </div>
    <a-table :dataSource="contractListData" :columns="columns" :pagination="false"
      :class="contractListData.length <= 0 ? 'no-table-data' : ''">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a class="dark:text-[#E0DBD2] text-[#151210]" @click="toDeployUrl(record)">{{ $t('common.deploy') }}</a>
          <a-divider type="vertical" />
          <a class="dark:text-[#E0DBD2] text-[#151210]" @click="toDetailUrl(record)">{{ $t('common.detail') }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const router = useRouter();

const columns = [{
  title: 'Contract',
  dataIndex: 'name',
  align: "center",
  key: 'name',
},
{
  title: 'Version',
  dataIndex: 'version',
  align: "center",
  key: 'version',
},
{
  title: 'Network',
  dataIndex: 'network',
  align: "center",
  customRender: ({ text }) => {
    if (!text) {
      return '-'
    }
  },
  key: 'network',
},
{
  title: 'Build Time',
  dataIndex: 'buildTime',
  align: "center",
  customRender: ({ text }) => {
    return dayjs(text).format('YYYY/MM/DD HH:mm:ss')
  },
  key: 'buildTime'
},
{
  title: 'Action',
  align: "center",
  key: 'action',
}];

const state = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
})

const props = defineProps({
  contractListData: Array,
})

const { contractListData } = toRefs(props)

const toDeployUrl = (val: any) => {
  const contract = val.id || '00';
  router.push(`/projects/${val.projectId}/artifacts-contract/${val.version}/deploy/${contract}`)
}

const toDetailUrl = (val: any) => {
  router.push(`/projects/${val.projectId}/contracts-details/${val.version}`)
}

</script>

<style lang="less" scoped>
.btn {
  width: 131px;
  height: 43px;
}

:deep(.ant-btn[disabled]) {
  color: #fff;
  border-color: #E2B578;
  background-color: #E2B578;
}

:deep(.ant-btn[disabled]:hover) {
  color: #fff;
  border-color: #E2B578;
  background-color: #E2B578;
}
</style>
