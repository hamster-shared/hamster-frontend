<template>
  <BreadCrumb currentName="Check Report" :isClick="loading" class="mb-6"></BreadCrumb>
  <WorkflowsInfo :checkType="params.checktype" :workflowsDetailsData="workflowsDetailsData" :title="title" :inRunning="inRunning"></WorkflowsInfo>
  <MetaTrustSA :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (SA)' && params.checktype == 'MetaTrust (SA)' "></MetaTrustSA>
  <MetaTrustSP :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool == 'MetaTrust (SP)' && params.checktype == 'MetaTrust (SP)' "></MetaTrustSP>
  <MetaTrustOSA :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (OSA)' && params.checktype == 'MetaTrust (OSA)' "></MetaTrustOSA>
  <MetaTrustCQ :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (CQ)' && params.checktype == 'MetaTrust (CQ)' "></MetaTrustCQ>
  <Solhint :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Solhint' && params.checktype == 'Solhint' "></Solhint>
  <MyThril :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Mythril' && params.checktype == 'Mythril' "></MyThril>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import MyThril from './components/myThril.vue'
  import MetaTrustOSA from './components/metaTrustOSA.vue';
  import MetaTrustSP from './components/metaTrustSP.vue';
  import MetaTrustSA from './components/metaTrustSA.vue';
  import MetaTrustCQ from './components/metaTrustCQ.vue';
  import Solhint from './components/solhint.vue';
  import WorkflowsInfo from '../projectsWorkflows/components/WorkflowsInfo.vue';
  import { apiGetProjectsDetail } from "@/apis/projects";
  import { apiGetWorkflowsDetail } from "@/apis/workFlows";
  import { apiGetReport } from "@/apis/checkReport";
  import YAML from "yaml";
  import BreadCrumb from '../components/Breadcrumb.vue'

  const { params } = useRoute();
  const queryJson = reactive({
    id: params.id,
    workflowDetailId: params.workflowDetailId,
    workflowsId: params.workflowsId,
    type: params.type,
    projectType: params.projectType,
  })
  const loading = ref(false);
  const title = ref('Check');
  const processData = ref([]);
  const inRunning = ref(true);

  const reportId = ref(2224); //SA:2224,OSA:2244,CQ:2225,myThril:2320
  const metaTrustData = reactive({checkTool: ''});
  const workflowsDetailsData = reactive({
    startTime: '',
    repositoryUrl: '',
    errorNumber: 0,
    duration: 0,
  });

  const getCodeRepository = async() => {
    try {
      const { data } = await apiGetProjectsDetail(queryJson.id);
      // console.log("getCodeRepository-data:",data);
      workflowsDetailsData.repositoryUrl = data.repositoryUrl
    } catch (error: any) {
      console.log("erro:", error)
    }
  }

  const getTime = async() => {
    try {
      const { data } = await apiGetWorkflowsDetail(queryJson);
      // console.log("getTime-data:",data);
      workflowsDetailsData.duration = data.duration
      workflowsDetailsData.startTime = data.startTime

      processData.value = YAML.parse(data.stageInfo);
      inRunning.value = processData.value.some((val: any) => val.status === 1);
    } catch (error: any) {
      console.log("erro:", error)
    }
  }

  const getReportInfo = async () => {
    try {
      const { data } = await apiGetReport(reportId.value);
      data.reportFileData = YAML.parse(data.reportFile);
      data.metaScanOverviewData = YAML.parse(data.metaScanOverview);

      // console.log("getReportInfo-data:",data);
      Object.assign(metaTrustData, data);

      workflowsDetailsData.errorNumber = metaTrustData.issues
    } catch (error: any) {
      console.log("erro:", error)
    }
  }

  onMounted(() => {
    // console.log('queryJson:',queryJson)
    getCodeRepository()
    getTime()
    getReportInfo();
  })

</script>
