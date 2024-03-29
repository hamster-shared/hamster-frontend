<template>
  <div class="card-border !mt-0">
    <div class="card-title mb-[30px]">Credit Cost(Last 24 hours)</div>
    <div class="h-[300px]">
      <EchartBar v-if="Object.keys(creditCostData).length > 0" echartsId="Requests" :echartsData="creditCostData"></EchartBar>
      <NoData v-else></NoData>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests</div>
      <div>
        <label class="select-title">Time</label>
        <a-select @change="getRequestData" class="w-[150px]" v-model:value="requestParam.time" autocomplete="off" :options="optionTime"></a-select>
        <label class="select-title">Chain</label>
        <a-select @change="getRequestData" class="w-[150px]" v-model:value="requestParam.chain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
      </div>
    </div>
    <div class="h-[300px]">
      <EchartBarTotal v-if="Object.keys(requestData).length > 0" echartsId="RequestsActivity" :echartsData="requestData"></EchartBarTotal>
      <NoData v-else></NoData>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests activity</div>
      <div>
        <label class="select-title">Time</label>
        <a-select @change="getRequestActivity" class="w-[150px]" v-model:value="activityParam.time" autocomplete="off" :options="optionTime" ></a-select>
        <label class="select-title">Chain</label>
        <a-select @change="getRequestActivity" class="w-[150px]" v-model:value="activityParam.chain" autocomplete="off" :options="optionEcosystems.map((item:any) => ({ value: item.ecosystemCode, label: item.ecosystemName }))" ></a-select>
      </div>
    </div>
    <div>
      <RequestsActivity v-if="optionEcosystems.length > 0" ref="requestActivityRef" :activityParam="activityParam"></RequestsActivity>
    </div>
  </div>
  <div class="card-border">
    <div class="flex justify-between items-center mb-[30px]">
      <div class="card-title">Requests Origin</div>
      <div>
        <label class="select-title">Time</label>
        <a-select @change="getRequestOriginData" class="w-[150px]" v-model:value="originParam.time" autocomplete="off" :options="optionTime" ></a-select>
      </div>
    </div>
    <div class="h-[300px]">
      <EchartBarTotal v-if="Object.keys(requestOriginData).length > 0" echartsId="RequestsOrigin" :echartsData="requestOriginData"></EchartBarTotal>
      <NoData v-else></NoData>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { optionTime } from './rpcData';
import NoData from './NoData.vue';
import EchartBar from '@/components/EchartBar.vue';
import EchartBarTotal from '@/components/EchartBarTotal.vue';
import RequestsActivity from './RequestsActivity.vue'
import { formatTimeToHM } from '@/utils/dateUtil';
import { apiZanEcosystemsDigest, apiZanApiKeyCreditCost, apiZanApiKeyRequestStats, apiZanApiKeyRequestOriginStats } from "@/apis/middlewareRPC";

const route = useRoute()
const apiKeyId: any = route.query.apiKeyId || '';
const creditCostData = ref({})
const requestData = ref({})
const requestActivityRef = ref();
const requestOriginData = ref({})
const requestParam = ref({
  time: optionTime[2].value,
  chain: '',
});
const activityParam = ref({
  time: optionTime[2].value,
  chain: '',
}); 
const originParam = ref({
  time: optionTime[2].value,
});
const optionEcosystems = ref<any>([]);

// 获取下拉框的值 optionEcosystems
const getEcosystems = async () => {
  let res = await apiZanEcosystemsDigest();
  if (res.code == 200) {
    optionEcosystems.value = res.data;
    if (optionEcosystems.value.length > 0) {
      requestParam.value.chain = optionEcosystems.value[0].ecosystemCode;
      activityParam.value.chain = optionEcosystems.value[0].ecosystemCode;
    }
  }
}

// 获取 Credit Cost(Last 24 hours) 图表数据
const getCreditCostData = async () => {
  creditCostData.value = {};
  let res = await apiZanApiKeyCreditCost(apiKeyId);
  if (res.code == 200 && res.data.length > 0) {
    let valueX: any = []; 
    let valueY: any = [];
    res.data.map((item: any) => {
      valueX.push(formatTimeToHM(item.dataTime));
      valueY.push(item.totalCredit);
    });
    creditCostData.value = {
      valueX: valueX,
      valueY: valueY,
      seriesName: 'totalCredit',
    };
  } else {
    creditCostData.value = {};
  }
  console.log("getCreditCostData:",creditCostData.value);
}

// 获取 Request 图表数据
const getRequestData = async () => {
  requestData.value = {}
  let res = await apiZanApiKeyRequestStats(apiKeyId, requestParam.value.time, requestParam.value.chain);
  console.log("res:",res);
  if (res.code == 200 && res.data.length > 0) {
    let valueX: any = []; 
    let valueY: any = {};
    let tempMap = new Map();
    let methodSet = new Set();
    res.data.map((item: any) => {
      let tempX = formatTimeToHM(item.dataTime); // 格式：hh:mm
      if (requestParam.value.time == 'STAT_7_DAY' || requestParam.value.time == 'STAT_1_MONTH') {
        tempX = formatTimeToHM(item.dataTime, 'md'); // 格式：MM-DD
      }
      if (item.method) { // 空的不展示
        methodSet.add(item.method);
        let tempNum = item.num;
        if (tempMap.get(tempX)) { //相同的日期累加数据
          // tempNum += tempMap.get(tempX).num;
          let tempObj = tempMap.get(tempX);
          tempObj[item.method] = tempNum;
          tempMap.set(tempX, tempObj);
        } else {
          tempMap.set(tempX,{ [item.method]: tempNum })
        }
      } else {
        tempMap.set(tempX, {});
      }
    });
    let methodList = Array.from(methodSet).sort();
    tempMap.forEach((item: any, key: any) => {
      valueX.push(key);
      methodList.map((it: any, k: any) => {
        if (valueY[it]) {
          if (item[it]) {
            valueY[it].push(item[it]);
          } else {
            valueY[it].push('');
          }
        } else {
          valueY[it] = [item[it]];
        }
      });
    })
    requestData.value = {
      valueX: valueX,
      valueY: valueY,
    };
  } else {
    requestData.value = {};
  }
  console.log("requestData:",requestData.value);
}
//获取Requests activity数据
const getRequestActivity = () => {
  requestActivityRef.value.getTableData();
}

// 获取 Requests Origin 数据
const getRequestOriginData = async () => {
  requestOriginData.value = {};
  let res = await apiZanApiKeyRequestOriginStats(apiKeyId, originParam.value.time);
  if (res.code == 200 && res.data.length > 0) {
    let valueX: any = []; 
    let valueY: any = {};
    let valueOther: any = {}; 
    let tempMap = new Map();
    let originIpSet = new Set();
    res.data.map((item: any) => {
      let tempX = formatTimeToHM(item.dataTime); // 格式：hh:mm
      if (originParam.value.time == 'STAT_7_DAY' || originParam.value.time == 'STAT_1_MONTH') {
        tempX = formatTimeToHM(item.dataTime, 'md'); // 格式：MM-DD
      }
      if (item.originIp) { // 空的不展示
        originIpSet.add(item.originIp);
        console.log("tempMap:",tempMap);
        if (tempMap.get(tempX)) {
          let tempObj = tempMap.get(tempX);
          tempObj[item.originIp] = { totalNum : item.totalNum, httpsNum : item.httpsNum, wssNum : item.wssNum };
          tempMap.set(tempX, tempObj);
        } else {
          tempMap.set(tempX,{ [item.originIp]: { totalNum : item.totalNum, httpsNum : item.httpsNum, wssNum : item.wssNum } })
        }
      } else {
        tempMap.set(tempX, {});
      }
    });
    let originIpList = Array.from(originIpSet).sort();
    tempMap.forEach((item: any, key: any) => {
      valueX.push(key);
      originIpList.map((it: any, k: any) => {
        if (valueY[it]) {
          if (item[it]) {
            valueY[it].push(item[it].totalNum);
            valueOther[it].push({httpsNum: item[it].httpsNum, wssNum: item[it].wssNum});
          } else {
            valueY[it].push('');
            valueOther[it].push({httpsNum: '', wssNum: ''});
          }
        } else {
          valueY[it] = [item[it]?.totalNum];
          valueOther[it] = [{httpsNum: item[it]?.httpsNum, wssNum: item[it]?.wssNum}];
        }
      });
    })
    requestOriginData.value = {
      valueX: valueX,
      valueY: valueY,
      type: 'requestOrigin',
      valueOther: valueOther,
    };
  } else {
    requestOriginData.value = {};
  }
  console.log("requestOriginData:",requestOriginData.value);
}

onMounted(async () => { 
  await getEcosystems();
  getCreditCostData();
  getRequestData();
  getRequestOriginData();
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