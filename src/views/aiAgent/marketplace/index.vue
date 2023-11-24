<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Marketplace</div>
    <img src="@/assets/images/marketplace-top.png" class="h-[250px] w-full mb-[30px]"/>
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="All">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane key="2" tab="NFT" force-render>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="Develop">Content of Tab Pane 3</a-tab-pane>
      <a-tab-pane key="4" tab="Other">Content of Tab Pane 4</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";

const { getImageURL } = useAssets();
const theme = useThemeStore();

const activeKey = ref('1');

</script>
<style scoped lang="less">
:deep(.ant-tabs-tab){
  padding: 0;
  font-weight: 600;
  color: #000000;
  font-size: 16px;
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