<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-2xl font-bold">AI Analysis Report</span>
    <div class="mt-4 text-lg whitespace-pre-wrap">{{ openAiInfo.reportFile }}</div>
    <hr class="my-2"/>
    <span>Support by {{ openAiInfo.checkTool }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,reactive } from 'vue'
import { useRoute } from 'vue-router';
import { apiGetWorkFlowsReport } from "@/apis/workFlows";

const openAiInfo = ref({})

const { params } = useRoute();
const queryJson = reactive({
  id: params.id,
  workflowDetailId: params.workflowDetailId,
  workflowsId: params.workflowsId,
  type: params.type,
  projectType: params.projectType,
})

onMounted(async()=>{
  const params = {
    workflowsId: '248',
    workflowDetailId: '241',
    // workflowsId: queryJson.workflowsId,
    // workflowDetailId: queryJson.workflowDetailId,
  }
  const { data } = await apiGetWorkFlowsReport(params)
  openAiInfo.value = data[3]
  // console.log('openai::',data)
})
</script>