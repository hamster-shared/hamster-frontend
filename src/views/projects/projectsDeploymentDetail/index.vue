<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <!-- 详情 -->

    <DeployVersionInfomation />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);

onMounted(async () => {
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: 'projectsDeploymentDetail',
      path: ''
    },
  ]
})
</script>

<style lang="less" scoped></style>