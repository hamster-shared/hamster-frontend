<template>
  <div>
    <BreadCrumb :routes="breadCrumbInfo" />
    <ContractBase v-if="baseInfo.address" :baseInfo="baseInfo"></ContractBase>
    <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px] mt-[32px]">
      <div class="text-[24px] font-bold mb-[32px]">Contract Explorer</div>

      <ContractList v-if="frameType && abiInfo.length" :abiInfo="abiInfo" :contractAddress="baseInfo.address" :frameType="contractInfo.frameType"
        @checkContract="checkContract" :canisterId="canisterId">
      </ContractList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from 'vue-router';
import BreadCrumb from "@/components/BreadCrumb.vue";
import ContractBase from './components/ContractBase.vue';
import ContractList from '@/views/projects/projectsContractsDetails/components/ContractList.vue';
import { apiGetProjectsDetail } from "@/apis/projects";
import { apiGetSourceInfoById } from '@/apis/contractOrchestrationDeploy'
import { message } from "ant-design-vue";

const breadCrumbInfo = ref<any>([]);

const route = useRoute()
const contractName = ref('');
const frameType = ref(1);
const abiInfo = ref('');
// 罐应用那边合约调用需要的数据
const canisterId = ref('')
const id:any = route.query.id
const contractDeployId:any = route.query.contractDeployId
// 合约信息对象
const contractInfo = ref<any>({})
// 页面头部数据
const baseInfo = ref<any>({})

const checkContract = (name: string) => {
  contractName.value = name
}

// apiGetSourceInfoById
const getDetailInfo = async()=>{
  try {
    const res = await apiGetSourceInfoById(id, contractDeployId)
    console.log('获取页面所有信息：',res)
    baseInfo.value = res.data
    abiInfo.value = res.data.abiInfo
  } catch (error:any) {
    message.error(error)
  }
}

const initBreadCrumb = ()=>{
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: contractInfo.value.name,
      path: `/projects/${contractInfo.value.id}/details/${contractInfo.value.type}`
    },
    {
      breadcrumbName: 'Dashboard',
      path: `/projects/projectsDashboard?id=${route.query.id}`
    },
    {
      breadcrumbName: 'projectsDashboardExplorer',
      path: ''
    },
  ]
}

// 获取合约详情
const getContactDetail = async()=>{
  const res = await apiGetProjectsDetail(route.query.id)
  if(res.code===200){
    contractInfo.value = res.data
    console.log('获取合约详情:',res)
  }
}

onMounted(async () => {
  getDetailInfo()
  await getContactDetail()
  initBreadCrumb()
})

onBeforeMount(async () => {
  // getVersion();
  // await getContractDeployDetail()
})
</script>

<style lang="less" scoped></style>
