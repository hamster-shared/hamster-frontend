<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Marketplace</div>
    <img src="@/assets/images/marketplace-top.png" class=" w-full mb-[30px]"/>
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="All">
        <TabsContent :tabsList="agentList" tabsType="all"></TabsContent>
      </a-tab-pane>
      <a-tab-pane key="2" tab="NFT">
        <TabsContent :tabsList="agentList" tabsType="NFT"></TabsContent>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Develop">
        <TabsContent :tabsList="agentList" tabsType="Develop"></TabsContent>
      </a-tab-pane>
      <a-tab-pane key="4" tab="Other">
        <TabsContent :tabsList="agentList" tabsType="Other"></TabsContent>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import TabsContent from './components/TabsContent.vue'
import { apiGetMarketplaceMockList } from '@/apis/agentMock';
import { agentList } from '../home/agentData';

const { getImageURL } = useAssets();
const theme = useThemeStore();

const activeKey = ref('1');

onMounted(async()=>{
  const res = await apiGetMarketplaceMockList()
  // console.log(22222222,res)
})
</script>
<style scoped lang="less">
:deep(.ant-tabs-tab){
  padding: 0;
  font-weight: 600;
  color: #000000;
  font-size: 16px;
}
:deep(.ant-tabs-top>.ant-tabs-nav){
  margin-bottom: 30px;
}
:deep(.ant-tabs-tab + .ant-tabs-tab){
  margin: 0 0 0 10px
}
:deep(.ant-tabs-tab:hover){
  background: rgba(226,181,120,0.1);
  border-radius: 8px;
  color: #000000;
}
:deep(.ant-tabs-top > .ant-tabs-nav:before){
  border: none;
}
:deep(.ant-tabs-ink-bar){
  display: none;
}
:deep(.ant-tabs-tab-btn){
  padding: 8px 30px;
}
:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  background: #000000;
  border-radius: 8px;
  color: #FFFFFF;
}
.dark-css{
  :deep(.ant-tabs-top > .ant-tabs-nav:before){
    border: none;
  }
  :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
    background: #FFFFFF;
    color: #000000;
  }
  :deep(.ant-tabs-tab:hover){
    color: #FFFFFF;
  }
}
</style>