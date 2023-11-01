<template>
  <div>
    <div class="title">My APPs</div>
    <div class="card-border">
      <div class="flex justify-end items-center text-[#E2B578]">
        <div class="font-[14px] text-[#E2B578]">View all apps</div>
        <svg-icon name="right" size="13" class="ml-[10px]" />
      </div>
      <div class="flex">
        <div class="w-[300px] h-[188px] bg-[rgba(226,181,120,0.25)] rounded-[12px] border border-solid border-[#EBEBEB] p-[20px]">
          <div class="flex justify-between items-center">
            <div class="text-[21px] font-black">AI Show</div>
            <svg-icon name="right" size="17" />
          </div>
          <div class="flex items-center mt-[20px] mb-[40px]">
            <svg-icon name="time" size="19" />
            <div class="text-[14px] font-light ml-[10px]">2023-09-01 16:10 (GMT+8)</div>
          </div>
          <a-button type="primary" class="!rounded-[17px] w-[125px] !font-semibold !text-[15px] !flex justify-center items-center" >
            <svg-icon name="key" size="19" class="mr-[10px]" />
            API Key
          </a-button>
        </div>
        <div @click="showCreateModal" class="flex justify-center items-center h-[188px] w-[188px] ml-[30px] rounded-[8px] border border-dashed border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816] cursor-pointer">
          <div class="text-center text-[#666666]">
            <svg-icon name="add-icon" size="33" class="dark:text-[#6C6C6C]" />
            <div class="font-normal mt-[20px] dark:text-[#FFFFFF]">Create Now</div>
          </div>
        </div>
      </div>
    </div>
    <div class="title mt-[50px]">Overview</div>
    <div class="card-border">
      <div class="font-medium mb-[10px]">Credit Cost (Last 24 hours)</div>
      <div class="flex pb-[30px] border-bottom">
        <div class="w-2/3">
          <EchartBar echartsId="CreditCost" :echartsData="[]"></EchartBar>
        </div>
        <div class="w-1/3 pl-[30px]">
          <div class="flex items-center mb-[40px]">
            <div class="text-[30px] font-extrabold text-[#E2B578] mr-[20px]">Free</div>
            <a-button type="primary" disabled="true">Upgrade</a-button>
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Balance:</label>
            <label class="font-extrabold">500 millino </label>credits
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Total:</label>
            <label class="font-extrabold">500 millino </label>credits
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Rate Limits:</label>
            <label class="font-extrabold">300 millino </label>credits/s
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Expire date:</label>
            <label class="font-extrabold">2023-09-31</label>
          </div>
          <div class="text-[#E2B578]">View More</div>
        </div>
      </div>
      <div class="flex justify-end mt-[30px]">
        <a-select class="w-[150px]" v-model:value="optionParams.opApp" autocomplete="off" :options="OptionsApp.map(item => ({ value: item.value, label: item.label }))" ></a-select>
        <a-select class="!ml-[20px] w-[150px]" v-model:value="optionParams.opChain" autocomplete="off" :options="OptionsChain" ></a-select>
        <a-select class="!ml-[20px] w-[150px]" v-model:value="optionParams.opDay" autocomplete="off" :options="OptionsDay" ></a-select>
      </div>
      <div class="flex">
        <div class="w-2/3">
          <EchartLine echartsId="echartLine" :echartsData="[]"></EchartLine>
        </div>
        <div class="w-1/3">
          <div class="flex justify-center items-center mt-[20px]">
            <EchartPie titleText="Top 5" echartsId="echartTop5" :echartsData="[]"></EchartPie>
          </div>
          <div  class="flex justify-center items-center">
            <EchartPie titleText="Source" echartsId="echartSource" :echartsData="[]"></EchartPie>
          </div>
          <div  class="flex justify-center items-center">
            <EchartPie titleText="Errors" echartsId="echartErrors" :echartsData="[]"></EchartPie>
          </div>
        </div>
      </div>
      <div class="w-2/3 text-center cursor-pointer text-[#E2B578] mt-[20px]">View More</div>
    </div>
  </div>
  <CreateAppModal :createVisible="createVisible" @hiddenCreateModal="hiddenCreateModal"></CreateAppModal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import EchartBar from '@/components/EchartBar.vue';
import EchartPie from '@/components/EchartPie.vue';
import EchartLine from '@/components/EchartLine.vue';
import CreateAppModal from './components/CreateAppModal.vue';

const OptionsApp = ref([
  {label: 'All Apps', value: '0'},
]);
const OptionsChain = ref([
  {label: 'All Chain', value: '0'},
]);
const OptionsDay = ref([
  {label: 'The Last 1 days', value: '1'},
]);
const optionParams = reactive({
  opApp: 'Ethereum',
  opChain: '0',
  opDay: '1'
});
const createVisible = ref(false);

const showCreateModal = () => {
  createVisible.value = true;
}
const hiddenCreateModal = () => {
  createVisible.value = false;
}
</script>
<style scoped>
.title{
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}
.border-bottom{
  @apply dark:border-[#434343];
  border-bottom: 1px solid #EBEBEB;
}
.card-border{
  @apply border border-solid border-[#EBEBEB] dark:border-[#434343] rounded-[12px] p-[30px]
}
.card-label{
  @apply text-[#A0A0A0] mr-[10px];
}
</style>