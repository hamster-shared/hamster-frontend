<template>
  <div>
    <div class="title">My APPs</div>
    <div class="card-border">
      <div class="flex justify-end items-center text-[#E2B578] mb-[18px]">
        <div class="font-[14px] text-[#E2B578] cursor-pointer" @click="goMyApp">View all apps</div>
        <svg-icon name="right" size="13" class="ml-[10px]" />
      </div>
      <div class="flex">
        <!-- 循环遍历拿出app -->
        <div v-if="apIKeyInfo.length > 0">
          <div v-for="(item, key) in apIKeyInfo" :key="key" class="w-[300px] h-[188px] bg-[rgba(226,181,120,0.25)] rounded-[12px] border border-solid border-[#EBEBEB] p-[20px] cursor-pointer" @click="goMyAppDetail(item.apiKeyId, item.name)">
            <div class="flex justify-between items-center">
              <div class="text-[21px] font-black">{{ item.name }}</div>
              <svg-icon name="right" size="17" />
            </div>
            <div class="flex items-center mt-[20px] mb-[40px]">
              <svg-icon name="time" size="19" />
              <div class="text-[14px] font-light ml-[10px]">{{ formatDateToLocale(item.createdTime).format("YYYY/MM/DD HH:mm:ss") }}</div>
            </div>
            <a-button type="primary" class="!rounded-[17px] w-[125px] !font-semibold !text-[15px] !flex justify-center items-center" >
              <svg-icon name="key" size="19" class="mr-[10px]" />
              API Key
            </a-button>
          </div>
        </div>
        <div class="flex justify-center items-center h-[188px] w-[188px] ml-[30px] rounded-[8px] border border-dashed border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816] cursor-pointer" @click="createApp">
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
          <EchartBar v-if="Object.keys(creditCostData).length > 0" echartsId="CreditCost" :echartsData="creditCostData"></EchartBar>
        </div>
        <div class="w-1/3 pl-[30px]">
          <div class="flex items-center mb-[40px] relative">
            <div class="text-[30px] font-extrabold text-[#E2B578] mr-[20px]">{{ userPlan.planName }}</div>
            <div class="absolute right-0">
              <a-button class="" type="primary" @click="goVersionPlan">Upgrade</a-button>
            </div>
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Balance:</label>
            <label class="font-extrabold">{{ setNumberValue(userPlan.totalCredit-userPlan.usedCredit) }} </label> credits
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Total:</label>
            <label class="font-extrabold">{{ setMillionValue(userPlan.totalCredit.toString()) }}<label v-if="userPlan.totalCredit.toString().length > 6"> million</label> </label> credits
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Rate Limits:</label>
            <label class="font-extrabold">{{ userPlan.creditLimit }} </label> credits/s
          </div>
          <div class="mb-[20px]">
            <label class="card-label">Expire date:</label>
            <label class="font-extrabold">{{ formatDateToLocale(userPlan.expireTime).format("YYYY/MM/DD HH:mm:ss") }}</label>
          </div>
          <div class="text-[#E2B578] cursor-pointer" @click="goBilling">View More</div>
        </div>
      </div>
      <div class="flex justify-end mt-[30px]">
        <a-select class="w-[150px]" v-model:value="optionParams.opApp" autocomplete="off" :options="optionsApp.map(item => ({ value: item.value, label: item.label }))" ></a-select>
        <a-select class="!ml-[20px] w-[150px]" v-model:value="optionParams.opChain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
        <a-select class="!ml-[20px] w-[150px]" v-model:value="optionParams.opDay" autocomplete="off" :options="optionTime" ></a-select>
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
      <!-- <div class="w-2/3 text-center cursor-pointer text-[#E2B578] mt-[20px]">View More</div> -->
    </div>
  </div>
  <CreateAppModal :createVisible="createVisible" @hiddenCreateModal="hiddenCreateModal"></CreateAppModal>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EchartBar from '@/components/EchartBar.vue';
import EchartPie from '@/components/EchartPie.vue';
import EchartLine from '@/components/EchartLine.vue';
import CreateAppModal from './components/CreateAppModal.vue';
import { formatDateToLocale } from '@/utils/dateUtil';
import { formatTimeToHM } from '@/utils/dateUtil';
import { optionTime, setMillionValue, setNumberValue } from './components/rpcData'
import { apiGetZanUserAuthed, apiZanPlan, apiZanEcosystemsDigest, apiZanApiKeyPage, apiZanApiKeyCreditCostLast24 } from "@/apis/middlewareRPC";

const router = useRouter()

const apIKeyInfo = ref<any>([]);
const creditCostData = ref({})
const optionsApp = ref<any>([]);
const optionEcosystems = ref<any>([])
const optionParams = ref({
  opApp: '',
  opChain: '',
  opDay: optionTime[0].value
});
const createVisible = ref(false);
const userPlan = ref<any>({
  planName: '',
  totalCredit: 0,
  usedCredit: 0,
  creditLimit: 0,
  expireTime: '',
});

const hiddenCreateModal = () => {
  createVisible.value = false;
}
// 新建app
const createApp = ()=>{
  createVisible.value = true;
}

// 跳转app detail
const goMyAppDetail = (apiKeyId: String, apiKeyName: String)=>{
  router.push('/middleware/dashboard/RPC/myapp/detail?apiKeyId='+apiKeyId+'&apiKeyName=' + apiKeyName)
}

// 跳转app
const goMyApp = ()=>{
  router.push('/middleware/dashboard/RPC/myapp')
}

// 跳转 Billing
const goBilling = ()=>{
  router.push('/middleware/dashboard/RPC/Billing')
}

// 跳转 versionPlan
const goVersionPlan = ()=>{
  router.push('/middleware/dashboard/RPC/versionPlan')
}
// 获取 Credit Cost(Last 24 hours) 图表数据
const getCreditCostLastData = async () => {
  let res = await apiZanApiKeyCreditCostLast24();
  if (res.length > 0) {
    let valueX: any = []; 
    let valueY: any = [];
    res.map((item: any) => {
      valueX.push(formatTimeToHM(item.dataTime));
      valueY.push(item.totalCredit);
    });
    creditCostData.value = {
      valueX: valueX,
      valueY: valueY,
      seriesName: 'totalCredit',
    };
  }
}
// 获取overview free里面的字段信息
const getOverviewFree = async () => {
  const authedData = await apiGetZanUserAuthed();
  if(authedData.data){
    let res = await apiZanPlan();
    if (res.code == 200) {
      userPlan.value = res.data
    }
  }
}

// 获取下拉框的值 optionEcosystems
const getEcosystems = async () => {
  let res = await apiZanEcosystemsDigest();
  if (res.code == 200) {
    optionEcosystems.value = res.data;
    optionParams.value.opChain = optionEcosystems.value[0].ecosystemCode;
  }
}
//获取apps要显示的信息
const getApiKeyInfo = async () => {
  let res = await apiZanApiKeyPage(1, 10);
  if (res.code == 200) {
    if (res.data.data.length > 0) {
      res.data.data.forEach((item: any) => {
        optionsApp.value.push({
          value: item.apiKeyId,
          label: item.name,
        });
      });
      optionParams.value.opApp = res.data.data[0].apiKeyId;
      apIKeyInfo.value = [res.data.data[0]];
    }
  }
}

onMounted(async () => {
  getApiKeyInfo();
  getOverviewFree();
  getCreditCostLastData();
  getEcosystems();
})
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