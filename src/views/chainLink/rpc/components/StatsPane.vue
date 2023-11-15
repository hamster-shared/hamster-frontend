<template>
  <div class="card-border !mt-0">
    <div class="card-title mb-[30px]">Credit Cost(Last 24 hours)</div>
    <div class="h-[300px]">
      <EchartBar echartsId="Requests" :echartsData="[]"></EchartBar>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests</div>
      <div>
        <label class="select-title">Time</label>
        <a-select class="w-[150px]" v-model:value="requestParam.time" autocomplete="off" :options="optionTime" ></a-select>
        <label class="select-title">Chain</label>
        <a-select class="w-[150px]" v-model:value="requestParam.chain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
      </div>
    </div>
    <div class="h-[300px]">
      <EchartBarTotal echartsId="RequestsActivity" :echartsData="[]"></EchartBarTotal>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests activity</div>
      <div>
        <label class="select-title">Time</label>
        <a-select class="w-[150px]" v-model:value="activityParam.time" autocomplete="off" :options="optionTime" ></a-select>
        <label class="select-title">Chain</label>
        <a-select class="w-[150px]" v-model:value="activityParam.chain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
      </div>
    </div>
    <div>
      <RequestsActivity></RequestsActivity>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests Origin</div>
      <div>
        <label class="select-title">Time</label>
        <a-select class="w-[150px]" v-model:value="originParam.time" autocomplete="off" :options="optionTime" ></a-select>
      </div>
    </div>
    <div class="h-[300px]">
      <EchartBarTotal echartsId="RequestsOrigin" :echartsData="[]"></EchartBarTotal>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { optionTime } from './rpcData';
import EchartBar from '@/components/EchartBar.vue';
import EchartBarTotal from '@/components/EchartBarTotal.vue';
import RequestsActivity from './RequestsActivity.vue'
import { apiZanEcosystemsDigest, apiZanApiKeyCreditCost } from "@/apis/middlewareRPC";

const route = useRoute()
const creditCostData = ref([])
const apiKeyId = route.query.apiKeyId || '';
const requestParam = reactive({
  time: optionTime[0].value,
  chain: '',
});
const activityParam = reactive({
  time: optionTime[0].value,
  chain: '',
}); 
const originParam = reactive({
  time: optionTime[0].value,
});
const optionEcosystems = ref([]);

// 获取下拉框的值 optionEcosystems
const getEcosystems = async () => {
  let res = await apiZanEcosystemsDigest();
  if (res.code == 200) {
    optionEcosystems.value = res.data
  }
}

// 获取
const getCreditCostData = async () => {
  let res = await apiZanApiKeyCreditCost(apiKeyId);
  if (res.code == 200) {
    creditCostData.value = res.data;
  }
  console.log("getCreditCostData:",res);
}

onMounted(() => { 
  getEcosystems();
  getCreditCostData();
});
</script>
<style scoped>
.card-border{
  @apply dark:border-[#434343] dark:bg-[#1D1C1A];
  background: #FFFFFF;
  border-radius: 12px; 
  border: 1px solid #EBEBEB;
  padding: 30px;
  margin-top: 30px;
}
.card-title{
  @apply text-[21px] font-bold ;
}
.select-title{
  @apply dark:text-[#E0DBD2];
  color: #000000;
  padding-left: 20px;
  padding-right: 10px;
}
</style>