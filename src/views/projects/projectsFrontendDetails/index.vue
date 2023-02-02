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
              <a-menu-item>
                <a href="javascript:;" @click="deleteBtn">Delete</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div>
      <Deployment :showBth="false"></Deployment>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from '../components/Breadcrumb.vue';
import Deployment from '../../projects/projectsWorkflows/components/Deployment.vue';
import { useI18n } from 'vue-i18n';
import { message } from "ant-design-vue";

const { t } = useI18n();
const router = useRouter();
const currentName = ref('Deployment Detail');


const visitBtn = () => {

}

const viewLogs = () => {
  // 回到workFlows详情页
  router.push(`/projects/3b0771b3-bdf3-4b79-965e-214530f5194b/69/workflows/99/3/2`)
}

const copyUrl = () => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = '哈哈';
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success(t('workFlows.copySuccess'))
}

const deleteBtn = () => {

}

</script>

<style lang='less' scoped>
.btn,
.an-btn {
  width: 131px;
  height: 43px;
}
</style>
