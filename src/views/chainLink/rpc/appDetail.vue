<template>
  <div>
    <bread-crumb separator=">" :routes="breadCrumbInfo"/>
    <div class="text-[24px] font-bold my-[30px]">AIShow</div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Get Started">
        <GetStartedPane></GetStartedPane>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Stats" force-render>
        <StatsPane></StatsPane>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Security" disabled>Content of Tab Pane 3</a-tab-pane>
      <a-tab-pane key="4" tab="Teamwork" disabled>Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
  </template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GetStartedPane from './components/GetStartedPane.vue';
import StatsPane from './components/StatsPane.vue'
import BreadCrumb from "@/components/BreadCrumb.vue";

const activeKey = ref('2');
const breadCrumbInfo = ref<any>([])

// 判断跳转来源
const judgeOrigin = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Apps',
      path: '/middleware/dashboard/RPC/myapp'
    },
    {
      breadcrumbName: 'AI Show',
      path: ''
    },
  ]
}

onMounted(()=>{
  judgeOrigin()
})
</script>
<style scoped>
:deep(.ant-tabs .ant-tabs-tab){
  padding: 12px 30px;
}

</style>