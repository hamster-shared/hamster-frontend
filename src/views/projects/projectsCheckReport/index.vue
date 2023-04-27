<template>
<div>projectsCheckReport</div> 
<metaTrustSA v-if="checkReportData.checkTool === 'MetaTrust (SA)'" :checkReportData="checkReportData"></metaTrustSA>
<metaTrustSP></metaTrustSP>
<metaTrustOSA v-if="checkReportData.checkTool === 'MetaTrust (OSA)'" :checkReportData="checkReportData"></metaTrustOSA>
</template>
<script lang='ts'  setup>
import { ref, onMounted, reactive } from 'vue';
import YAML from "yaml";
import { apiGetReport } from "@/apis/checkReport";
import metaTrustOSA from './components/metaTrustOSA.vue';
import metaTrustSP from './components/metaTrustSP.vue';
import metaTrustSA from './components/metaTrustSA.vue';

//SA:2224, OSA:2244
const reportId = ref(2224);
const checkReportData = reactive({checkTool: ''});

onMounted(() => {
  getReportInfo();
})

const getReportInfo = async () => {
  try {
    const { data } = await apiGetReport(reportId.value);
    data.reportFileData = YAML.parse(data.reportFile);
    data.metaScanOverviewData = YAML.parse(data.metaScanOverview);

    console.log("data:",data);
    Object.assign(checkReportData, data);
  } catch (error: any) {
    console.log("erro:", error)
  }
}
</script>