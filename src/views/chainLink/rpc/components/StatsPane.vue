<template>
  <div class="card-border !mt-0">
    <div class="card-title">Credit Cost(Last 24 hours)</div>
    <div class="h-[300px]">
      <EchartBar echartsId="Requests" :echartsData="[]"></EchartBar>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center">
      <div class="card-title">Requests</div>
      <div>
        <label class="select-title">Time</label>
        <a-select class="w-[150px]" v-model:value="requestParam.time" autocomplete="off" :options="optionTime" ></a-select>
        <label class="select-title">Chain</label>
        <a-select class="w-[150px]" v-model:value="requestParam.chain" autocomplete="off" :options="optionChain" ></a-select>
      </div>
    </div>
    <div class="h-[300px]">
      <EchartBarTotal echartsId="RequestsActivity" :echartsData="[]"></EchartBarTotal>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center">
      <div class="card-title">Requests activity</div>
      <div>
        <label class="select-title">Time</label>
        <a-select class="w-[150px]" v-model:value="activityParam.time" autocomplete="off" :options="optionTime" ></a-select>
        <label class="select-title">Chain</label>
        <a-select class="w-[150px]" v-model:value="activityParam.chain" autocomplete="off" :options="optionChain" ></a-select>
      </div>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center">
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
import { optionTime } from './rpcData';
import EchartBar from '@/components/EchartBar.vue';
import EchartBarTotal from '@/components/EchartBarTotal.vue';

const requestParam = reactive({
  time: '0',
  chain: '0',
});
const activityParam = reactive({
  time: '0',
  chain: '0',
}); 
const originParam = reactive({
  time: '0',
});
const optionChain = ref([
  {label: 'All Chain', value: '0'},
]);

onMounted(() => { 
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
  @apply text-[21px] font-bold pb-[30px];
}
.select-title{
  @apply dark:text-[#E0DBD2];
  color: #000000;
  padding-left: 20px;
  padding-right: 10px;
}
</style>