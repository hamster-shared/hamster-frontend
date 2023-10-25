<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <!-- 详情 -->

    <DeployVersionInfomation ref="versionRef" v-if="versionList.length" :name="contractInfo.name" :versionList="versionList" />
    <DeploymentDetails v-if="version" :version="version"></DeploymentDetails>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import DeploymentDetails from './components/DeploymentDetails.vue';
import { apiGetProjectsDetail } from '@/apis/projects'
import { apiGetProjectsVersions } from "@/apis/workFlows";
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);
const route = useRoute()
const router = useRouter()
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
    // {
    //   breadcrumbName: 'Deploy',
    //   path: ''
    // },
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

}

onMounted(async () => {
  await getContactDetail()
  initBreadCrumb()
  await getProjectsVersion() 
})

watchEffect(() => {
  if (versionRef.value != undefined) {
    console.log('versionRef.value.selectedVersion:', versionRef.value.selectedVersion);

    version.value = versionRef.value.selectedVersion;
  }
});
</script>

<style lang="less" scoped></style>