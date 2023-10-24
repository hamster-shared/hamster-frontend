<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex justify-between items-center">
      <bread-crumb :routes="breadCrumbInfo"/>
<!--      <div>-->
<!--        <a-button type="primary" ghost @click="getProjectsContract">{{ templatesDetail.version }}（latest）</a-button>-->
<!--        <a-button type="primary" class="ml-4" :loading="downloadLoading" @click="downloadTemplate">Download</a-button>-->
<!--        <a ref="downloadLinkRef" style="display: none;"></a>-->
<!--        <a-button v-if="!tokenMatemaskWallet" type="primary" class="ml-4" :loading="createTemplateLoading" @click="showModal">{{-->
<!--            createTemplate-->
<!--          }}</a-button>-->
<!--      </div>-->
    </div>
  </div>
</template>
<script setup lang="ts">
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";

import {onMounted, ref} from "vue";
const theme = useThemeStore()
const breadCrumbInfo = ref<any>([])

onMounted(async () => {
  judgeOrigin()
})


const judgeOrigin = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName:'Create Project',
      path:'/projects/create'
    },
    {
      breadcrumbName:'Solana Template',
      path:`projects/templates/solana/details`
    }
  ]
}
</script>

<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.ant-btn-primary) {
  width: 150px;
  height: 40px;
}

:deep(.ant-checkbox-wrapper),
:deep(.ant-checkbox-disabled+span),
:deep(.dark-css .ant-checkbox-disabled+span) {
  color: @baseColor;
}

:deep(.ant-checkbox-wrapper+.ant-checkbox-wrapper) {
  margin-left: 0px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: var(--ant-primary-color);
}

:deep(.ant-checkbox-disabled .ant-checkbox-inner),
:deep(.dark-css .ant-checkbox-disabled .ant-checkbox-inner) {
  border-color: var(--ant-primary-color) !important;
}

:deep(.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner:after) {
  border-color: #FFFFFF;
}

ul {
  padding-inline-start: 1rem;
}

// :deep(.dark-css .ant-tabs) {
//   color: #E0DBD2;
// }

:deep(.dark-css .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FFFFFF;
}

:deep(.ant-tabs-tab-btn) {
  width: 100px;
  text-align: center;
}


pre {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.up-tran {
  transform: rotate(90deg);
  transition: all .3s, visibility 0s;
}

:deep(.ant-collapse-item-active .up-tran) {
  transform: rotate(180deg);
}
:deep(.ant-collapse-item-active){
  border: 1px solid #E2B578;
  border-radius: 8px !important;
}
:deep(.ant-collapse-item:last-child>.ant-collapse-content){
  border-radius: 0 0 8px 8px !important;
}
:deep(.ant-collapse){
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 8px;
  border: 1px solid #EBEBEB;
  margin-bottom: 30px;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header){
  font-weight: bold;
}

.active-css{
  background: rgba(226, 181, 120, 0.2);
  // box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  width: 200px;
}
.dark-css{
  .border-r-css{
    border-right: 1px solid #434343;
  }
}
.white-css{
  .border-r-css{
    border-right: 1px solid #EBEBEB;
  }
}
</style>

<style lang="less">
.create-template-modal {
  .ant-modal-body {
    .ant-input-affix-wrapper {
      // border-color: #d9d9d9;
      margin: 8px 0;
    }
  }

  .ant-modal-header {
    border-bottom: none !important;
    padding-bottom: 8px;
  }
}
</style>
