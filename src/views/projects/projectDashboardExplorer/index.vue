<template>
  <div>
    <BreadCrumb :routes="breadCrumbInfo" />
    <ContractBase></ContractBase>
    <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px] mt-[32px]">
      <div class="text-[24px] font-bold mb-[32px]">Contract Explorer</div>

      <ContractList v-if="frameType" :abiInfo="abiInfo" :contractAddress="contractAddress" :frameType="frameType"
        @checkContract="checkContract" :canisterId="contractAddress">
      </ContractList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import ContractBase from './components/ContractBase.vue';
import ContractList from '@/views/projects/projectsContractsDetails/components/ContractList.vue';
import { apiGetProjectsDetail } from "@/apis/projects";
import { apiGetContractDeployDetail, apiGetProjectsVersions } from "@/apis/workFlows";

const breadCrumbInfo = ref<any>([]);
const contractDeployDetail = reactive({});


const contractName = ref('');
const frameType = ref(1);
const contractAddress = ref('');
const abiInfo = ref('');
const versionData = ref([]);

const checkContract = (name: string) => {
  contractName.value = name
}

const getContractDeployDetail = async () => {
  const queryJson = {
    id: 'f6db9205-2e19-4256-a6dd-d9121d1f4739',
    version: '1',
  }
  const { data } = await apiGetContractDeployDetail(queryJson)
  Object.assign(contractDeployDetail, data);
  abiInfo.value = data.contractInfo.ExampleToken.abiInfo;
  contractAddress.value = data.contractInfo.ExampleToken.deployInfo[0].address;

}

const getVersion = async () => {
  const { data } = await apiGetProjectsVersions({ id: 'f6db9205-2e19-4256-a6dd-d9121d1f4739' });
  Object.assign(versionData, data)
}

onMounted(async () => {
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: 'projectsDashboardExplorer',
      path: ''
    },
  ]
})

onBeforeMount(async () => {
  getVersion();
  await getContractDeployDetail()
})
</script>

<style lang="less" scoped></style>