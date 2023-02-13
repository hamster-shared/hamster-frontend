<template>
  <div class="detailLogs p-[32px]">
    <div v-for="it in jobLogsData.detailLogsList" :key="it">{{ it }}</div>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { apiGetDetailLogs } from "@/apis/workFlows";
const router = useRouter();
const jobLogsData = reactive({ detailLogsList: [] });

const queryParams = reactive({
  workflowsId: router.currentRoute.value.params?.workflowsId,
  workflowDetailId: router.currentRoute.value.params?.workflowDetailId,
})

const getDetailLogs = async () => {
  const { data } = await apiGetDetailLogs(queryParams)
  jobLogsData.detailLogsList = data.content?.split('\r')
}
onMounted(() => {
  getDetailLogs()
})
</script>
<style lang='less' scoped>
// .detailLogs {
//   min-height: 100vh;
// }
</style>