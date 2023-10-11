<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <!-- 详情 -->

    <DeployVersionInfomation />
    <DeploymentDetails></DeploymentDetails>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import DeploymentDetails from './components/DeploymentDetails.vue';
import { apiGetProjectsDetail } from '@/apis/projects'
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);const route = useRoute()
const router = useRouter()
// 合约信息对象
const contractInfo = ref<any>()

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

onMounted(async () => {
  await getContactDetail()
  initBreadCrumb()
})
</script>

<style lang="less" scoped></style>