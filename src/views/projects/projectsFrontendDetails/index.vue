<template>
  <div class="dark:text-white text-[#121211]">
    <div class="flex justify-between mb-[24px]">
      <bread-crumb :routes="breadCrumbInfo"/>
      <div class="flex">
        <a-button class="btn" @click="visitBtn">Visit</a-button>
        <a-dropdown class="w-[43px] border border-solid border-[#E2B578] rounded-[8px] ml-[20px] text-center">
          <a class="ant-dropdown-link" @click.prevent>
            <img src="@/assets/icons/point.svg" class="mt-[16px]" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" style="color:black" @click="viewLogs">View Deploy Logs</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" style="color:black" @click="copyUrl">Copy URL</a>
              </a-menu-item>
              <a-menu-item v-if="nodeType!=='3'">
                <a href="javascript:;" style="color:black" @click="deleteBtn">Delete</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div>
      <Deployment v-if="id" :showBth="false" :id="id" :packageInfo="packageInfo" :workflowsDetailsData="workflowsDetailsData" :nodeType="nodeType"></Deployment>
    </div>
    <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] p-[32px] rounded-[12px] mt-[24px]">
      <div class="flex justify-between mb-[32px]">
        <span class="text-[24px] font-bold">Realtime Logs</span>
        <span class="log-btn" v-if="nodeType!='3'">
          <a-button disabled>All Errors</a-button>
          <a-button disabled class="mx-[16px]">Pause</a-button>
          <a-button disabled>Clear</a-button>
        </span>
      </div>
      <div ref="terminalElementRef"></div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted, reactive, onBeforeUnmount, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { message } from "ant-design-vue";
import { apiGetPackageDetail, apiGetWorkflowsDetail } from "@/apis/workFlows.ts";
import { apiDeleteDeployInfo } from "@/apis/projects.ts";
import BreadCrumb from "@/components/BreadCrumb.vue";
import Deployment from '../../projects/projectsWorkflows/components/Deployment.vue';
import { useWebSocket } from '@vueuse/core'
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit'

const { t } = useI18n();
const router = useRouter();
const { params,query } = useRoute();
const breadCrumbInfo = ref<any>([])
const packageInfo = reactive<any>({});
const workflowsDetailsData = reactive({
  packageId: params.packageId,
});
const nodeType = ref(query.type)
// 项目id
const id = ref()

const viewLogs = () => {
  // 回到workFlows详情页
  router.push(`/projects/${packageInfo?.projectId}/${packageInfo?.workflowId}/workflows/${packageInfo?.workflowDetailId}/3/2?type=${nodeType.value}`)
}

const baseUrl = ref(import.meta.env.VITE_WS_API)
const userInfo = JSON.parse(localStorage.getItem('userInfo') as string)

// Term
const fitAddon = new FitAddon()
const term = new Terminal()
const terminalElementRef = ref()

const buildTerm = () => {
  term.loadAddon(fitAddon)
  term.open(terminalElementRef.value)

  fitAddon.fit()
}

watchEffect((onClose) => {
  const handler = () => fitAddon.fit()
  window.addEventListener("resize", handler)
  onClose(() => window.removeEventListener("resize", handler))
})

// websocket
const useWebSocketURL = ref()
const { close: closeWebSocket } = useWebSocket(useWebSocketURL, {
  heartbeat: true,
  onMessage: (_ws, event) => writeRealtimeLogs(event)
})

const writeRealtimeLogs =(event: any) => {
  if (!terminalElementRef.value) {
    return false
  }

  console.log("event", event)
  const log = event.data.replace(/\n(?!\r)/g, "\n\r")
  term.write(log)
}

const getPackageDetail = async () => {
  try {
    const { data } = await apiGetPackageDetail(params.packageId)
    id.value = data.projectId
    Object.assign(packageInfo, data)
    useWebSocketURL.value = `${baseUrl.value}/projects/${packageInfo.projectId}/${userInfo.username}/frontend/logs`
    buildTerm()
  } catch (err: any) {
    console.info(err)
  }
}

const getWorkflowsDetail = async () => {
  try {
    const queryParams = {
      workflowsId:  params.workflowsId,
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
  // https://polkadot.js.org/apps/?rpc=wss://jian-guo-s-0711.hamster.newtouch.com
  if(nodeType.value=='3'){
    const url = `https://polkadot.js.org/apps/?rpc=${packageInfo?.domain}`
    window.open(url)
  }else{
    window.open(packageInfo?.domain);
  }
}

const deleteBtn = async () => {
  try {
    const { data } = await apiDeleteDeployInfo(workflowsDetailsData.packageId);
    router.back();
  } catch (err: any) {
    console.info(err)
  }
}

// 判断跳转来源
const judgeOrigin = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName:'Projects',
      path:'/projects'
    },
    {
      breadcrumbName:packageInfo.name,
      path:`/projects/${packageInfo.projectId}/details/${nodeType.value}`
    },
    {
      breadcrumbName:'Deployment Detail',
      path:''
    },
  ]
}

onMounted(async() => {
  getWorkflowsDetail();
  await getPackageDetail();
  judgeOrigin()
})

onBeforeUnmount(()=>{
  closeWebSocket()
})
</script>

<style lang='less' scoped>
.btn,
.ant-btn {
  width: 131px;
  height: 43px;
}
</style>
