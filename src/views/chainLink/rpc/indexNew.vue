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
          <NoData v-else></NoData>
        </div>
        <div class="w-1/3 pl-[30px]">
          <div class="flex items-center mb-[40px] relative">
            <div class="text-[30px] font-extrabold text-[#E2B578] mr-[20px]">Free</div>
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
        <a-select @change="getMainChain" class="w-[150px]" v-model:value="optionParams.opApp" autocomplete="off" :options="optionsApp.map(item => ({ value: item.value, label: item.label }))" ></a-select>
        <a-select @change="getMainChain" class="!ml-[20px] w-[150px]" v-model:value="optionParams.opChain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
        <a-select @change="getMainChain" class="!ml-[20px] w-[150px]" v-model:value="optionParams.time" autocomplete="off" :options="optionTime" ></a-select>
      </div>
      <div class="flex mt-[30px]">
        <div class="w-2/3 h-[580px]">
          <EchartLine v-if="Object.keys(mainChart).length > 0" echartsId="echartLine" :echartsData="mainChart"></EchartLine>
          <NoData v-else></NoData>
        </div>
        <div class="w-1/3 pl-[30px]">
          <div class="flex justify-center items-center h-[180px]">
            <EchartPie v-if="circlePanel1Top5.length > 0" titleText="Top 5" echartsId="echartTop5" :echartsData="circlePanel1Top5"></EchartPie>
            <NoData v-else></NoData>
          </div>
          <div  class="flex justify-center items-center mt-[20px] h-[180px]">
            <EchartPie v-if="circlePanel2Source.length > 0" titleText="Source" echartsId="echartSource" :echartsData="circlePanel2Source"></EchartPie>
            <NoData v-else></NoData>
          </div>
          <div  class="flex justify-center items-center mt-[20px] h-[180px]">
            <EchartPie v-if="circlePanel3Error.length > 0" titleText="Errors" echartsId="echartErrors" :echartsData="circlePanel3Error"></EchartPie>
            <NoData v-else></NoData>
          </div>
        </div>
      </div>
      <!-- <div class="w-2/3 text-center cursor-pointer text-[#E2B578] mt-[20px]">View More</div> -->
    </div>
  </div>
  <CreateAppModal :createVisible="createVisible" @hiddenCreateModal="hiddenCreateModal" @refreshApps="getApiKeyInfo"></CreateAppModal>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EchartBar from '@/components/EchartBar.vue';
import EchartPie from '@/components/EchartPie.vue';
import EchartLine from '@/components/EchartLine.vue';
import NoData from './components/NoData.vue'
import CreateAppModal from './components/CreateAppModal.vue';
import { formatDateToLocale } from '@/utils/dateUtil';
import { formatTimeToHM } from '@/utils/dateUtil';
import { optionTime, setMillionValue, setNumberValue } from './components/rpcData'
import {
  apiGetZanUserAuthed, apiZanPlan, apiZanEcosystemsDigest, apiZanApiKeyPage,
  apiZanApiKeyCreditCostLast24, apiZanApiKeyRequestStats, apiZanApiKeyRequestActivityStats,apiZanApiKeyRequestOriginStats, apiGetZanAuthUrl
} from "@/apis/middlewareRPC";

const router = useRouter()

const apIKeyInfo = ref<any>([]);
const creditCostData = ref({})
const optionsApp = ref<any>([]);
const optionEcosystems = ref<any>([])
// 主echarts
const mainChart = ref<any>({})
// 第一个圆饼  Top 5
const circlePanel1Top5 = ref<any>([])
// 第二个圆饼    Source
const circlePanel2Source = ref<any>([])
// 第三个圆饼  Errors
const circlePanel3Error = ref<any>([])
const optionParams = ref({
  opApp: '',
  opChain: '',
  time: optionTime[2].value
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
// const createApp = ()=>{
//   createVisible.value = true;
// }

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
  } else {
    creditCostData.value = {}
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

// 获取折线图和圆饼图数据
const getMainChain = async () => {
  mainChart.value = {};
  let res = await apiZanApiKeyRequestStats(optionParams.value.opApp, optionParams.value.time, optionParams.value.opChain);

  console.log("res:", res);
  if (res.code == 200 && res.data.length > 0) {
    let valueX: any = []; 
    let valueY: any = [];
    res.data.map((item: any) => {
      if (optionParams.value.time == 'STAT_7_DAY' || optionParams.value.time == 'STAT_1_MONTH') {
        valueX.push(formatTimeToHM(item.dataTime, 'md')); // 格式：MM-DD
      } else {
        valueX.push(formatTimeToHM(item.dataTime)); // 格式：hh:mm
      }
      
      valueY.push(item.num);
    });
    mainChart.value = {
      valueX: valueX,
      valueY: valueY,
      seriesName: 'num',
    };
  } else {
    mainChart.value = {};
  }
  //圆饼 TOP 5
  getCircleTop5(res);
  //获取圆饼Source
  getCircleSource();
  //获取圆饼Errors
  getCircleErrors();
}

//获取圆饼Top 5
const getCircleTop5 = (res: any) => {
  if (res.code == 200 && res.data.length > 0) {
    const groupedByMethod: any = res.data.reduce((acc: any, requestStats: any) => {
      const method = requestStats.method
      let num = acc.get(method) || 0
      num += requestStats.num
      acc.set(method, num);
      return acc;
    }, new Map<string, number>());
    
    groupedByMethod.forEach((value: any, key: any) => {
      circlePanel1Top5.value.push({
        name: key, value: value
      });
    });
  } else {
    circlePanel1Top5.value = [];
  }
} 

//获取圆饼Source
const getCircleSource = async () => {
  const res = await apiZanApiKeyRequestOriginStats(optionParams.value.opApp, optionParams.value.time);

  if (res.code == 200 && res.data.length > 0) {
    
    const httpsWssData = res.data.reduce((acc:any,item:any)=> {
      acc.httpsNum += item.httpsNum
      acc.wssNum += item.wssNum
      return acc
    }, {
      httpsNum: 0,
      wssNum:0,
    })

    circlePanel2Source.value = [
      { name: 'HTTPS', value: httpsWssData.httpsNum },
      { name: 'WSS', value: httpsWssData.wssNum }
    ]
  } else {
    circlePanel2Source.value = [];
  }
} 

//获取圆饼Errors
const getCircleErrors = async () => {
  const res = await apiZanApiKeyRequestActivityStats(optionParams.value.opApp, optionParams.value.time, optionParams.value.opChain);
  if (res.code == 200 && res.data.length > 0) {
    const successFailData = res.data.reduce((acc: any, item: any) => {
      acc.successNum += (item.totalNum - item.failedNum)
      acc.failedNum += item.failedNum
      return acc
    }, {
      "successNum": 0,
      "failedNum": 0,
    })

    circlePanel3Error.value = [
      { name: 'SUCCESS', value: successFailData.successNum },
      {name: 'FAILED', value: successFailData.failedNum}
    ]
  } else {
    circlePanel3Error.value = [];
  }
  
}

const createApp = async () => {
  const authedData = await apiGetZanUserAuthed()
  if(authedData.data){
      // router.push('/middleware/dashboard/RPC/home')
      createVisible.value = true;
  }else {
      let url = ""
      try{
        const authUrlResp = await apiGetZanAuthUrl()
        url = authUrlResp.data
      }catch (e) {
          return
      }
      const myWindow = window.open(url, 'login-zan', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
      myWindow?.focus()
  }
}

onMounted(async () => {
  getOverviewFree();
  getCreditCostLastData();
  await getApiKeyInfo();
  await getEcosystems();
  getMainChain();

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