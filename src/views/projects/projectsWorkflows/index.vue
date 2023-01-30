<template>
  <div class="dark:text-white text-[#121211]">
    <div class="flex justify-between mb-[24px]">
      <Breadcrumb :currentName="currentName" :isClick="false"></Breadcrumb>
      <a-button class="btn" @click="stopBtn">{{ $t('workFlows.stop') }}</a-button>
    </div>
    <WorkflowsInfo :workflowsDetailsData="workflowsDetailsData" :title="title" :inRunning="inRunning"></WorkflowsInfo>
    <WorkflowsProcess :processData="processData" :workflowsId="queryJson.workflowsId"
      :workflowDetailId="queryJson.workflowDetailId">
    </WorkflowsProcess>
    <CheckReport v-show="queryJson.type === '1'" :checkReportData="checkReportData"></CheckReport>
    <ContractList v-show="queryJson.type === '2'" :contractListData="contractListData"></ContractList>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import YAML from "yaml";
import Breadcrumb from '../components/Breadcrumb.vue';
import WorkflowsInfo from './components/WorkflowsInfo.vue';
import WorkflowsProcess from './components/WorkflowsProcess.vue';
import CheckReport from './components/CheckReport.vue';
import ContractList from './components/ContractList.vue';
import { apiGetProjectsDetail, apiProjectsWorkflowsStop } from "@/apis/projects";
import { apiGetWorkflowsDetail, apiGetWorkFlowsContract, apiGetWorkFlowsReport } from "@/apis/workFlows";
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter();
const queryJson = reactive({
  id: router.currentRoute.value.params?.id,
  workflowDetailId: router.currentRoute.value.params?.workflowDetailId,
  workflowsId: router.currentRoute.value.params?.workflowsId,
  type: router.currentRoute.value.params?.type,
})
const detailTimer = ref(null);
const title = ref('');
const currentName = ref('');
const inRunning = ref(false);
const processData = ref([]);
const checkReportData = reactive([]);
const contractListData = reactive([]);
const workflowsDetailsData = reactive({
  startTime: '',
  endTime: '',
  RepositoryUrl: '',
  errorNumber: 0,
});

const getWorkflowsDetails = async () => {
  const { data } = await apiGetWorkflowsDetail(queryJson)
  Object.assign(workflowsDetailsData, data);
  const stageInfo = YAML.parse(data.stageInfo);
  processData.value = stageInfo;
  processData.value.unshift({ name: 'Start', status: 99, duration: 'none' })

  // 打印查看转换后的 stageInfo
  console.log(stageInfo, 'stageInfo');
  inRunning.value = processData.value.some((val: any) => val.status === 1);
  if (inRunning.value) {
    detailTimer.value = setTimeout(() => {
      getWorkflowsDetails();
    }, 5000);
  } else {
    clearTimeout(detailTimer.value);
    queryJson.type === '1' ? getCheckReport() : getContractList();
  }
}

const getContractList = async () => {
  const { data } = await apiGetWorkFlowsContract(queryJson);
  Object.assign(contractListData, data);
}

const getCheckReport = async () => {
  let issue = 0;
  let list = []
  const { data } = await apiGetWorkFlowsReport(queryJson);
  data.map((item: any) => {
    if (item.checkTool !== 'sol-profiler' && item.checkTool !== '') {
      list.push(item)
    }
  })

  list.map((item: any) => {
    item.reportFileData = YAML.parse(item.reportFile);
    item.reportFileData.map(val => {
      issue += val.issue
    })
  })

  // console.log(errop, 'errop')
  workflowsDetailsData.errorNumber = issue;
  // Object.assign(workflowsDetailsData, { errorNumber, issue })
  Object.assign(checkReportData, list)
}

const stopBtn = async () => {
  if (inRunning.value) {
    try {
      const { data } = await apiProjectsWorkflowsStop(queryJson);
      getWorkflowsDetails()
    } catch (err: any) {
      message.error(err.message)
    }
  } else {
    message.info(t('workFlows.workflowStopped'))
  }
}

const getProjectsDetailData = async () => {
  const { data } = await apiGetProjectsDetail(queryJson.id.toString())
  Object.assign(workflowsDetailsData, { repositoryUrl: data.repositoryUrl })
}

onMounted(() => {
  getWorkflowsDetails();
  getProjectsDetailData();
  title.value = queryJson.type === '1' ? 'Check' : 'Build';
  currentName.value = `Contract ${title.value}_#${queryJson.workflowsId}`
  queryJson.type === '1' ? getCheckReport() : getContractList();
})


onUnmounted(() => {
  clearTimeout(detailTimer.value);
});

</script>
<style lang='less' scoped>
.btn {
  width: 150px;
  height: 43px;
}
</style>
