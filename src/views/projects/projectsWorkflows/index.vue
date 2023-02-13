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
    <div v-if="queryJson.projectType === '1'">
      <!-- contract -->
      <CheckReport v-show="queryJson.type === '1'" :projectType="queryJson.projectType" :checkReportData="checkReportData"></CheckReport>
      <ContractList v-show="queryJson.type === '2'" :contractListData="contractListData"></ContractList>
    </div>
    <div v-else>
      <CheckReport v-show="queryJson.type === '1'" :projectType="queryJson.projectType" :checkReportData="frontendReportData"></CheckReport>
      <ArtifactList v-show="queryJson.type === '2'" :artifactListData="artifactListData"></ArtifactList>
      <Deployment v-show="queryJson.type === '3'" :packageInfo="packageInfo"
        :workflowsDetailsData="workflowsDetailsData"></Deployment>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiGetProjectsDetail, apiProjectsWorkflowsStop } from "@/apis/projects";
import { apiGetWorkflowsDetail, apiGetWorkFlowsContract, apiGetWorkFlowsReport, apiGetDetailFrontendReport, apiGetPackagesList, apiGetDeployInfo } from "@/apis/workFlows";
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n'
import YAML from "yaml";
import Breadcrumb from '../components/Breadcrumb.vue';
import WorkflowsInfo from './components/WorkflowsInfo.vue';
import WorkflowsProcess from './components/WorkflowsProcess.vue';
import CheckReport from './components/CheckReport.vue';
import ContractList from './components/ContractList.vue';
import ArtifactList from './components/ArtifactList.vue';
import Deployment from './components/Deployment.vue';

const { t } = useI18n()
const { params } = useRoute();
const queryJson = reactive({
  id: params.id,
  workflowDetailId: params.workflowDetailId,
  workflowsId: params.workflowsId,
  type: params.type,
  projectType: params.projectType,
})

const detailTimer = ref();
const title = ref('');
const currentName = ref('');
const inRunning = ref(true);
const processData = ref([]);
const frontendReportData = reactive([]);
const checkReportData = reactive([]);
const contractListData = reactive([]);
const artifactListData = reactive([]);
const packageInfo = reactive({});
const workflowsDetailsData = reactive({
  startTime: '',
  endTime: '',
  RepositoryUrl: '',
  errorNumber: 0,
  workflowDetailId: params.workflowDetailId,
  workflowsId: params.workflowsId,
  packageId: 0,
  execNumber: 0,
});

const getWorkflowsDetails = async () => {
  const { data } = await apiGetWorkflowsDetail(queryJson)
  Object.assign(workflowsDetailsData, data);
  const stageInfo = YAML.parse(data.stageInfo);
  processData.value = stageInfo;
  processData.value.unshift({ name: 'Start', status: 99, duration: 'none' })

  setCurrentName();

  // 打印查看转换后的 stageInfo
  // console.log(stageInfo, 'stageInfo');
  inRunning.value = processData.value.some((val: any) => val.status === 1);
  if (inRunning.value) {
    detailTimer.value = setTimeout(() => {
      getWorkflowsDetails();
    }, 5000);
  } else {
    clearTimeout(detailTimer.value);
    loadInfo();
  }
}

const loadInfo = () => {
  if (queryJson.projectType === '2') {
    queryJson.type === '1' ? getDetailFrontendReport() : getWorkflowPackage();
  } else {
    queryJson.type === '1' ? getCheckReport() : getContractList();
  }
}

const getContractList = async () => {
  const { data } = await apiGetWorkFlowsContract(queryJson);
  Object.assign(contractListData, data);
}

const getCheckReport = async () => {
  let issue = 0;
  const list: any = []
  const { data } = await apiGetWorkFlowsReport(queryJson);
  data.map((item: any) => {
    if (item.checkTool !== 'sol-profiler' && item.checkTool !== '') {
      list.push(item)
    }
  })

  list.map((item: any) => {
    item.reportFileData = YAML.parse(item.reportFile);
    item.reportFileData.map((val: any) => {
      issue += val.issue
    })
  })
  workflowsDetailsData.errorNumber = issue;
  Object.assign(checkReportData, list);
}

const getDetailFrontendReport = async () => {
  try {
    let issue = 0;
    const params = {
      workflowsId: queryJson.workflowsId,
      workflowDetailId: queryJson.workflowDetailId,
    }
    const { data } = await apiGetDetailFrontendReport(params);
    data.map((item: any) => {
      item.reportFileData = YAML.parse(item.reportFile);
      item.reportFileData.map((val: any) => {
        issue += val.issue
      })
    })

    workflowsDetailsData.errorNumber = issue;
    Object.assign(frontendReportData, data)

    console.log(frontendReportData, 'frontendReportData')

  } catch (error: any) {
    console.log("erro:", error)
  }
}

const getWorkflowPackage = async () => {
  try {
    const params = {
      workflowsId: queryJson.workflowsId,
      workflowDetailId: queryJson.workflowDetailId,
    }
    if (queryJson.type === '2') {
      const { data } = await apiGetPackagesList(params);
      Object.assign(artifactListData, data)
    } else {
      const { data } = await apiGetDeployInfo(params);
      Object.assign(packageInfo, data)
    }

  } catch (error: any) {
    console.log("erro:", error)
  }
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
  try {
    const { data } = await apiGetProjectsDetail(queryJson.id.toString())
    Object.assign(workflowsDetailsData, { repositoryUrl: data.repositoryUrl, packageId: data.recentDeploy.packageId })
  } catch (err: any) {
    console.info(err)
  }

}

const setCurrentName = () => {
  if (queryJson.projectType === '1') {
    // projectType === '1' === contract
    title.value = queryJson.type === '1' ? 'Check' : 'Build';
    currentName.value = `Contract ${title.value}_#${workflowsDetailsData.execNumber}`
  } else {
    // projectType === '2' === frontend
    if (queryJson.type === '1') {
      title.value = 'Check'
    } else if (queryJson.type === '2') {
      title.value = 'Build'
    } else {
      title.value = 'Deploy'
    }
    currentName.value = `Frontend ${title.value}_#${workflowsDetailsData.execNumber}`
  }
}

onMounted(() => {
  getWorkflowsDetails();
  getProjectsDetailData();
  loadInfo();
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
