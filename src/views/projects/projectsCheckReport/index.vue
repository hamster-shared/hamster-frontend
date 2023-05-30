<template>
  <bread-crumb class="!text-[24px]" :routes="breadCrumbInfo"></bread-crumb>
  <WorkflowsInfo :checkType="params.checktype" :workflowsDetailsData="workflowsDetailsData" :title="title" :inRunning="inRunning" class="mt-[20px]"></WorkflowsInfo>
  <MetaTrustSA :gistId="gistId" :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (SA)' && params.checktype == 'MetaTrust (SA)' "></MetaTrustSA>
  <MetaTrustSP :gistId="gistId" :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool == 'MetaTrust (SP)' && params.checktype == 'MetaTrust (SP)' "></MetaTrustSP>
  <MetaTrustOSA :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (OSA)' && params.checktype == 'MetaTrust (OSA)' "></MetaTrustOSA>
  <MetaTrustCQ :gistId="gistId" :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (CQ)' && params.checktype == 'MetaTrust (CQ)' "></MetaTrustCQ>
  <Solhint :gistId="gistId" :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Solhint' && params.checktype == 'Solhint' "></Solhint>
  <MyThril :gistId="gistId" :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Mythril' && params.checktype == 'Mythril' "></MyThril>
  <GasUsageReport :gasUsageReportData="gasUsageReportData" v-if="params.checktype == 'gasInfoDetail' "></GasUsageReport>
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
  import GasUsageReport from '../projectsWorkflows/components/GasUsageReport.vue'
  import { apiGetProjectsDetail } from "@/apis/projects";
  import { apiGetWorkflowsDetail, apiGetWorkFlowsReport } from "@/apis/workFlows";
  import { apiGetReport } from "@/apis/checkReport";
  import YAML from "yaml";
  import BreadCrumb from '@/components/BreadCrumb.vue';

  const { params,query } = useRoute();
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
  const breadCrumbInfo = ref<any>([])

  const gistId = ref('');
  const gasUsageReportData = reactive([])
  const reportId:any = query.reportId; //SP:2295,SA:2224,OSA:2244,CQ:2225,myThril:2320,Solhint:2319
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
      workflowsDetailsData.repositoryUrl = data.repositoryUrl;
      gistId.value = data.gistId;
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
      const { data } = await apiGetReport(reportId);
      data.reportFileData = YAML.parse(data.reportFile);
      data.metaScanOverviewData = YAML.parse(data.metaScanOverview);

      // console.log("getReportInfo-data:",data);
      Object.assign(metaTrustData, data);

      workflowsDetailsData.errorNumber = metaTrustData.issues
    } catch (error: any) {
      console.log("erro:", error)
    }
  }

  const getCheckReport = async () => {
    let issue = 0;
    const listGas: any = [];
    const { data } = await apiGetWorkFlowsReport(queryJson);
    data?.map((item: any) => {
      if (item.checkTool === 'eth-gas-reporter') {
        listGas.push(item);
      }
    })

    issue = yamlData(listGas, issue, "gasUsage");
    
    Object.assign(gasUsageReportData, listGas);
    workflowsDetailsData.errorNumber = issue;
  }

  const yamlData = (list: any[], issue: number, dataType: string) => {
    if (list.length > 0) {
      list.map((item: any) => {
          item.reportFileData = YAML.parse(item.reportFile);
          item.reportFileData?.map((val: any, index: number) => {
            if (dataType === "gasUsage") {
              if (index === 0) {
                issue += val.issue
              }
            } else {
              issue += val.issue
            }
          })
          item.errorNumber = issue;
      })
    } 
    return issue;
  }
  onMounted(() => {
    console.log('queryJson:',queryJson,query)
    getCodeRepository()
    getTime()
    if (params.checktype == 'gasInfoDetail') {
      getCheckReport();
    } else {
      getReportInfo();
    }
    breadCrumbInfo.value = [
      {
        breadcrumbName:'projects',
        path:'/projects'
      },
      {
        breadcrumbName:query?.currentName?.replace('-','#'),
        path:localStorage.getItem('evmCheckWorkflow')
      },
      {
        breadcrumbName:'Check Report',
        path:''
      },
    ]
  })

</script>
