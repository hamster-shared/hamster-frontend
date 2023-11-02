<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">AIShow</div>
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
import { ref } from 'vue';
import GetStartedPane from './components/GetStartedPane.vue';
import StatsPane from './components/StatsPane.vue'

const activeKey = ref('2');
</script>
<style scoped>
:deep(.ant-tabs .ant-tabs-tab){
  padding: 12px 30px;
}

</style>