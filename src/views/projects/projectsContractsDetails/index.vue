<template>
  <div class="contractSetails flex justify-between mb-[24px]">
    <Breadcrumb :currentName="projectName" :isClick="false"></Breadcrumb>
    <a-select class="select-dark" ref="select" v-model:value="contractDeployDetail.version" style="width: 180px"
      @change="changeVersion">
      <a-select-option :value="item" v-for="item in versionData" :key="item">{{
        item
      }}</a-select-option>
    </a-select>
  </div>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] p-[32px] rounded-[8px]">
    <a-tabs v-model:activeKey="activeKeyId" class="dark:text-white text-[#121211]" @change="changeActiveKey">
      <a-tab-pane v-for="(item, key) in contractInfo" :key="item.id" :tab="key">
        <a-table :dataSource="item.deployInfo" :columns="columns" class="mb-[64px]" :pagination="false"
          :customRow="customRowClick" :rowClassName="setRowClassName">
          <template #bodyCell="{ record, column }">
            <template v-if="column.key === 'action'">
              <a @click.stop="deploy(record)">Deploy</a>
            </template>
          </template>
        </a-table>
        <div class="" v-if="item.abiInfo">
          <div class="text-[24px] font-bold mb-[32px]">Contract List</div>
          <ContractList :abiInfo="item.abiInfo" :contractAddress="contractAddress" :frameType="frameType" 
            @checkContract="checkContract">
          </ContractList>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- <noData :hasData="hasData"></noData> -->
  </div>

</template>
<script lang='ts' setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import Breadcrumb from "../components/Breadcrumb.vue";
import ContractList from "./components/ContractList.vue";
import { apiGetContractDeployDetail, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiGetProjectsDetail } from "@/apis/projects"
const router = useRouter();
const theme = useThemeStore();

// console.log(theme.themeValue, 'theme')

const queryJson = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
})
const activeKey = ref('');
const activeKeyId = ref('');
const projectName = ref('');
const frameType = ref(0);
const versionData = reactive([]);
const contractName = ref('');
const contractAddress = ref('');
const selectedRow = ref(0);
const columns = [
  {
    title: 'Network',
    dataIndex: 'network',
    align: "center",
    key: 'network',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    align: "center",
    customRender: ({ text }) => {
      if (!text) {
        return '-'
      }
    },
    key: 'address',
  },
  {
    title: 'Action',
    align: "center",
    key: 'action',
  }];

// const tabList = reactive([]);
const contractDeployDetail = reactive({})
const contractInfo = reactive({})

const getProjectsDetail = async () => {
  const { data } = await apiGetProjectsDetail(queryJson.id)
  frameType.value = data.frameType
}

const getContractDeployDetail = async () => {
  const { data } = await apiGetContractDeployDetail(queryJson)
  Object.assign(contractDeployDetail, data)
  Object.assign(contractInfo, data.contractInfo)

  activeKey.value = Object.keys(contractInfo)[0];
  activeKeyId.value = Object.values(contractInfo)[0]?.id;
  contractAddress.value = Object.values(contractInfo)[0]?.deployInfo[0]?.address;
}

const getVersion = async () => {
  const { data } = await apiGetProjectsVersions({ id: queryJson.id });
  Object.assign(versionData, data)
}

const deploy = (val: any) => {
  router.push(`/projects/${queryJson.id}/artifacts-contract/${queryJson.version}/deploy/${activeKeyId.value}`)
}
const changeVersion = (val: any) => {
  queryJson.version = val
  getContractDeployDetail()
}

const changeActiveKey = (activeKey: any) => {
  console.log(activeKey, 'activeKey')
}

const checkContract = (name: string) => {
  contractName.value = name
}


const customRowClick = (record: any, index: number) => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: async (event: Event) => {
      contractAddress.value = record.address;
      selectedRow.value = index;
    }
  }
};

const setRowClassName = (record: any, index: number) => {
  if (index === selectedRow.value && theme.themeValue === 'dark') {
    return 'clickRowStyle-dark'
  }
  if (index === selectedRow.value && theme.themeValue === 'white') {
    return 'clickRowStyle'
  }
}

onBeforeMount(() => {
  projectName.value = localStorage.getItem("projectName") || '';
  getVersion()
  getContractDeployDetail()
  getProjectsDetail()
})

</script>
<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.ant-select-selection-item) {
  color: @baseColor;
}

:deep(.clickRowStyle-dark) {
  background-color: #463F36;
}


:deep(.clickRowStyle) {
  background-color: #FFFAF3;
}
</style>
