<template>
  <div class="dark:text-white text-[#121211]">
    <div class="flex justify-between mb-[24px]">
      <Breadcrumb :currentName="currentName" :isClick="false"></Breadcrumb>
      <div class="flex">
        <a-button class="btn" @click="visitBtn">Visit</a-button>
        <a-dropdown class="w-[43px] border border-solid border-[#E2B578] rounded-[8px] ml-[20px] text-center">
          <a class="ant-dropdown-link" @click.prevent>
            <img src="@/assets/icons/point.svg" class="mt-[16px]" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="viewLogs">View Deploy Logs</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="copyUrl">Copy URL</a>
              </a-menu-item>
              <!-- <a-menu-item>
                <a href="javascript:;" @click="deleteBtn">Delete</a>
              </a-menu-item> -->
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div>
      <Deployment :showBth="false" :packageInfo="packageInfo" :workflowsDetailsData="workflowsDetailsData"></Deployment>
    </div>
    <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] p-[32px] rounded-[12px] mt-[24px]">
      <div class="flex justify-between mb-[32px]">
        <span class="text-[24px] font-bold">Realtime Logs</span>
        <span class="log-btn">
          <a-button disabled>All Errors</a-button>
          <a-button disabled class="mx-[16px]">Pause</a-button>
          <a-button disabled>Clear</a-button>
        </span>
      </div>
      <div
        class="dark:bg-[#36322D] bg-[#ffffff] border border-solid dark:border-[#434343] border-[#EBEBEB] p-[32px] rounded-[12px] text-center">
        <a-spin size="large" tip="Loading..." />
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { message } from "ant-design-vue";
import { apiGetPackagesList, apiGetWorkflowsDetail } from "@/apis/workFlows.ts";
import Breadcrumb from '../components/Breadcrumb.vue';
import Deployment from '../../projects/projectsWorkflows/components/Deployment.vue';

const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const currentName = ref('Deployment Detail');
const packageInfo = reactive({});
const workflowsDetailsData = reactive({});

const viewLogs = () => {
  // 回到workFlows详情页
  router.push(`/projects/${packageInfo?.projectId}/${packageInfo?.workflowId}/workflows/${packageInfo?.workflowDetailId}/3/2`)
}

const getPackageDetail = async () => {
  try {
    const queryParams = {
      workflowsId: params.workflowsId,
      workflowDetailId: params.workflowDetailId,
    }
    const { data } = await apiGetPackagesList(queryParams)
    Object.assign(packageInfo, data)
  } catch (err: any) {
    console.info(err)
  }
}

const getWorkflowsDetail = async () => {
  try {
    const queryParams = {
      workflowsId: params.workflowsId,
      workflowDetailId: params.workflowDetailId,
    }
    const { data } = await apiGetWorkflowsDetail(queryParams);
    Object.assign(workflowsDetailsData, data)
  } catch (err: any) {
    console.info(err)
  }

}

const copyUrl = () => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = packageInfo?.domain;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success(t('workFlows.copySuccess'))
}

const visitBtn = () => {
  window.open(packageInfo?.domain)
}

// const deleteBtn = () => {

// }


onMounted(() => {
  getPackageDetail();
  getWorkflowsDetail();
})

</script>

<style lang='less' scoped>
.btn,
.ant-btn {
  width: 131px;
  height: 43px;
}
</style>
