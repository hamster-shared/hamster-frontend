<template>
  <BreadCrumb currentName="Check Report" :isClick="loading" class="mb-6"></BreadCrumb>
  <MetaTrustSA :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (SA)' && params.checktype == 'MetaTrust (SA)' "></MetaTrustSA>
  <MetaTrustSP :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool == 'MetaTrust (SP)' && params.checktype == 'MetaTrust (SP)' "></MetaTrustSP>
  <MetaTrustOSA :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (OSA)' && params.checktype == 'MetaTrust (OSA)' "></MetaTrustOSA>
  <MetaTrustCQ :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'MetaTrust (CQ)' && params.checktype == 'MetaTrust (CQ)' "></MetaTrustCQ>
  <Solhint :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Solhint' && params.checktype == 'Solhint' "></Solhint>
  <MyThril :metaTrustData="metaTrustData" v-if="metaTrustData.checkTool === 'Mythril' && params.checktype == 'Mythril' "></MyThril>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import MyThril from './components/myThril.vue'
  import MetaTrustOSA from './components/metaTrustOSA.vue';
  import MetaTrustSP from './components/metaTrustSP.vue';
  import MetaTrustSA from './components/metaTrustSA.vue';
  import MetaTrustCQ from './components/metaTrustCQ.vue';
  import Solhint from './components/solhint.vue';
  import WorkflowsInfo from '../projectsWorkflows/components/WorkflowsInfo.vue';
  import { apiGetProjectsDetail, apiProjectsWorkflowsStop } from "@/apis/projects";
  import { apiGetReport } from "@/apis/checkReport";
  import { apiGetWorkflowsDetail, apiGetWorkFlowsContract, apiGetWorkFlowsReport, apiGetDetailFrontendReport, apiGetPackagesList, apiGetDeployInfo } from "@/apis/workFlows";
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
  const detailTimer = ref();
  const title = ref('');
  const currentName = ref('');
  const inRunning = ref(true);
  const processData = ref([]);
  const openAiInfo = ref({})

  const reportId = ref(2224); //SA:2224,OSA:2244,CQ:2225,myThril:2320,Solhint:2319
  const metaTrustData = reactive({checkTool: ''});
  const gasUsageReportData = reactive([])
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
    frameType: 0,
    deployType: 0,
    checkStatus: 0,
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
      getProjectsDetailData();
    }
  }

  const loadInfo = () => {
    if (queryJson.projectType === '2') {
      queryJson.type === '1' ? getDetailFrontendReport() : getWorkflowPackage();
    } else {
      queryJson.type === '1' ? getCheckThrilReport() : getContractList();
    }
  }

  const getContractList = async () => {
    const { data } = await apiGetWorkFlowsContract(queryJson);
    Object.assign(contractListData, data);
  }

  const getCheckMyThrilData = reactive([])
  const getCheckThrilReport = async () => {
    let issue = 0;
    const list: any = []
    const listGas: any = [];
    const { data } = await apiGetWorkFlowsReport(queryJson);
    
    if (data != null) {
      data.map((item: any) => {
        if (item.checkTool !== 'sol-profiler' && item.checkTool.toLowerCase() !== 'openai' && item.checkTool !== '') {
          if (item.checkTool === 'eth-gas-reporter') {
            listGas.push(item);
          } else {
            list.push(item)
          }
        }
      })

      // issue = yamlData(listGas, issue, "gasUsage");
      const myThril = [list.find( (item:any) => item.checkTool == 'mythril')]
      Object.assign(getCheckMyThrilData, myThril);

      issue = yamlData(myThril, issue, "report");

      data.filter((item: any) => {
        if (item.checkTool == 'OpenAI') {
          openAiInfo.value = item
        }
      })
    }
    
    // Object.assign(gasUsageReportData, listGas);
    workflowsDetailsData.errorNumber = issue;
    Object.assign(checkReportData, list);
  }

  const yamlData = (list: any[], issue: number, dataType: string) => {
    list.map((item: any) => {
      item.reportFileData = YAML.parse(item.reportFile);
      item.reportFileData.map((val: any, index: number) => {
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
    return issue;
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

  const getProjectsDetailData = async () => {
    try {
      const { data } = await apiGetProjectsDetail(queryJson.id.toString())
      Object.assign(workflowsDetailsData, { repositoryUrl: data.repositoryUrl, packageId: data.recentDeploy.packageId, frameType: data.frameType, deployType: data.deployType, checkStatus:data.recentCheck.status })
      localStorage.setItem('frameType', data.frameType)
      localStorage.setItem('gistId',data.gistId)
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

  const getReportInfo = async () => {
    try {
      const { data } = await apiGetReport(reportId.value);
      data.reportFileData = YAML.parse(data.reportFile);
      data.metaScanOverviewData = YAML.parse(data.metaScanOverview);

      console.log("data:",data);
      Object.assign(metaTrustData, data);
    } catch (error: any) {
      console.log("erro:", error)
    }
  }
  onMounted(() => {
    getWorkflowsDetails();
    getProjectsDetailData();
    loadInfo();
    getReportInfo();
    console.log('params:',params.checktype)
  })


  onUnmounted(() => {
    clearTimeout(detailTimer.value);
  });
</script>
