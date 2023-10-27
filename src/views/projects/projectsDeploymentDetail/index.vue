<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <!-- 详情 -->

    <DeployVersionInfomation ref="versionRef" v-if="versionList.length" :name="contractInfo.name" :versionList="versionList" />
    <DeploymentDetails v-if="version" :version="version" @execStop="execStop" @reDeploy="reDeploy"></DeploymentDetails>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import DeploymentDetails from './components/DeploymentDetails.vue';
import { apiGetProjectsDetail } from '@/apis/projects'
import {apiGetProjectsContract, apiGetProjectsVersions} from "@/apis/workFlows";
import { apiGetExecuteInfoById } from "@/apis/contractOrchestrationDeploy"
import type {DeployRecord} from "@/views/projects/projectsDeploymentOrchestration/components/DeployData";
import NewEngine, {formatContractList} from "@/views/projects/projectsDeploymentOrchestration/components/utils/engine";
import {ethers} from "ethers";
import {apiGetNetworkByName} from "@/apis/network";
const breadCrumbInfo = ref<any>([]);
const route = useRoute()
const provider = new ethers.providers.Web3Provider(window.ethereum)
const newEngine = new NewEngine(provider)
// 合约信息对象
const contractInfo = ref<any>({})
const versionList = ref([]);
const versionRef = ref();
const version = ref('');

// 导航栏
const initBreadCrumb = ()=>{
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
      breadcrumbName: 'Deployment Details',
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

// 获取版本号
const getProjectsVersion = async () => {
  try {
    const { data } = await apiGetProjectsVersions({id: route.query.id});
    versionList.value = data
  } catch (error: any) {
    console.log("erro:", error)
  }
};

// exec deploy
const execDeploy = async () => {
  const executeId = route.query.executeId
  const projectId = route.query.id
  const res = await apiGetExecuteInfoById(projectId,executeId)
  if (res.code === 200) {
    let execJson:DeployRecord = JSON.parse(res.data.arrangeProcessData)
    const execStatus = execJson.deployStep.some(item => item && item.status === "RUNNING" || item.status === "PENDDING")
    if (execStatus) {
      const { data } = await apiGetProjectsContract({ id: projectId, version: route.query.version});
      const contractMap = formatContractList(data)
      const networkData = await apiGetNetworkByName(res.data.network)
      let deployParams = {
        projectId:projectId,
        execId: executeId,
        version: route.query.version,
        network: res.data.network,
        rpcUrl: networkData.data.rpcUrl
      }
      newEngine.start(contractMap,execJson,deployParams)
    }
  }
}

//stop exec
const execStop = () => {
  newEngine.stop()
}
// retry exec contract deploy
const reDeploy = async () => {
  const executeId = route.query.executeId
  const projectId = route.query.id
  const res = await apiGetExecuteInfoById(projectId,executeId)
  if (res.code === 200) {
    let execJson:DeployRecord = JSON.parse(res.data.arrangeProcessData)
    const { data } = await apiGetProjectsContract({ id: projectId, version: route.query.version});
    const contractMap = formatContractList(data)
    const networkData = await apiGetNetworkByName(res.data.network)
    let deployParams = {
      projectId:projectId,
      execId: executeId,
      version: route.query.version,
      network: res.data.network,
      rpcUrl: networkData.data.rpcUrl
    }
    newEngine.start(contractMap,execJson,deployParams)
  }
}


onMounted(async () => {
  await getContactDetail()
  initBreadCrumb()
  await getProjectsVersion()
  await execDeploy()
})

watchEffect(() => {
  if (versionRef.value != undefined) {
    console.log('versionRef.value.selectedVersion:', versionRef.value.selectedVersion);

    version.value = versionRef.value.selectedVersion;
  }
});
</script>

<style lang="less" scoped></style>