<template>
  <div class="w-full mx-auto container-border" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div>
      <a-tabs v-model:activeKey="tabNetwork" @change="changeNetwork">
        <a-tab-pane key="Mainnet" tab="Mainnet" disabled></a-tab-pane>
        <a-tab-pane key="testnet" tab="Testnet"></a-tab-pane>
      </a-tabs>
    </div>

    <div class="flex">
      <div class="flex-1">
        <div class="flex justify-between">
          <!-- <a-select ref="select" v-model:value="selectTimeValue" style="width: 120px; margin-right: 20px;"
            @change="handleChange">
            <a-select-option value="1">Last 1 days</a-select-option>
            <a-select-option value="2">Last 3 days</a-select-option>
            <a-select-option value="3">Last 7 days</a-select-option>
          </a-select> -->
        </div>

        <div class="w-full h-full">
          <div class="myChart" ref="myChartRef" id="myEchart"></div>
        </div>
      </div>

      <div class="self-center pl-4 w-60">
        <p class="block mb-6 text-lg">My Subscription</p>
        <div v-for="item in subscripion">
          <div class="flex items-center mb-4 justify-between text-sm border rounded-lg border-[#EBEBEB] border-solid">
            <span class="pl-4">{{ item.title }}</span>
            <span v-if="item.title=='Funds'" :title="item.number">{{ item.number.slice(0,4) }} link</span>
            <span v-else>{{ item.number }}</span>
            <a-button class="is-show-btn" :disabled="item.disabled" type="link" @click="showPop(item.title)">{{ item.btnTitle }}</a-button>
          </div>
        </div>
        <div class="text-right">
          <a-button type="link" @click="goSublist">View More</a-button>
        </div>
      </div>
    </div>
  </div>
  <createSub v-if="showCreateSub" :showCreateSub="showCreateSub" @getCreateSubInfo="getCreateSubInfo"
    @closeCreateSub="closeCreateSub" />
  <addFunds v-if="showAddFund" :showAddFund="showAddFund" @getAddFundInfo="getAddFundInfo" @closeAddFund="closeAddFund" />
  <addConsumers v-if="showAddConsumers" :showAddConsumers="showAddConsumers" @getAddConsumersInfo="getAddConsumersInfo"
    @closeAddConsumers="closeAddConsumers" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { ethers } from 'ethers';
import { useThemeStore } from "@/stores/useTheme";
import createSub from '../mySubscription/components/createSub.vue'
import addFunds from '../mySubscription/components/addFunds.vue'
import addConsumers from '../mySubscription/components/addConsumers.vue'
import { apiGetSubscriptionParams, apiGetOracleEchartParams, getCustomerBalance } from '@/apis/chainlink'
import { useRouter } from 'vue-router'

const router = useRouter();

const theme = useThemeStore();
const showCreateSub = ref(false)
const showAddFund = ref(false)
const showAddConsumers = ref(false)
const tabNetwork = ref('testnet');
// 获取用户所有订阅金额
const balance = ref(0)

// 创建echarts
const myChartRef = ref()
const myChart = ref()
const initChart = (chartElement: HTMLElement, themeValue: string) => {
  const chart = echarts.init(chartElement, themeValue);
  chart.setOption({
    // darkMode: themeValue == 'dark'?true:false,
    backgroundColor: '',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData.value
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData.value
    },
    yAxis: {
      type: 'value'
    },
    series: seriesData.value
  })

  myChart.value = chart
}

// 监测时间变化
// const selectTimeValue = ref('Last 7 days')
// const handleChange = () => {
//   console.log('selectTimeValue:', selectTimeValue.value)
// }

// 获取echart的数据
const legendData = ref<[] | null>()
const xAxisData = ref([])
const seriesData = ref<[] | null>()

// 获取my subscription的数据
const subscripion = reactive<any>([
  { title: 'Subscription', number: '', btnTitle: 'Create',disabled:false },
  { title: 'Consumers', number: '-', btnTitle: 'Add',disabled:false },
  { title: 'Funds', number: '-', btnTitle: 'Add',disabled:false },
])
const getSubscripionInfo = async () => {
  const token = localStorage.getItem('token')
  const params = {
    network: tabNetwork.value,
    token
  }
  try {
    const { data } = await apiGetSubscriptionParams(params)
    subscripion[0].number = data.total_subscription?data.total_subscription:'0'
    console.log('subscripion[0].number:',subscripion[0].number)
    // if(!data.total_consumers){
    //   subscripion[1].number = '-'
    //   subscripion[1].disabled = true
    // }else{
    //   subscripion[1].number = data.total_consumers
    //   subscripion[1].disabled = false
    // }
    subscripion[1].number = subscripion[0].number == '0' ? '-' : data.total_consumers
    if(subscripion[0].number == '0'){
      subscripion[1].disabled = true
    }else{
      subscripion[1].disabled = false
    }
    console.log('data:', data)
  } catch (err: any) {
    console.log('err:', err)
  }
}

const getBalance = async()=> {
  if(subscripion[0].number == '0'){
    subscripion[2].disabled = true
    return
  }
  try {
    const { data } = await getCustomerBalance()
    console.log('balance-data:', data)
    data?.forEach((item:any) => {
      balance.value = item.balance*1 + balance.value
    });
    const testNumber:any = ethers.BigNumber.from(balance.value+'')
    console.log(111111,parseInt(testNumber,16))
    // if(!parseInt(testNumber,16)){
    //   subscripion[2].number = '-'
    // }else{
    //   subscripion[2].number = ethers.utils.formatEther(testNumber);
    // }
    subscripion[2].number = ethers.utils.formatEther(testNumber);
    subscripion[2].disabled = false
  } catch(err:any) {
    console.log('balance-err:',err)
  }
}
const getOracleChart = async ()=> {
  legendData.value = []
  xAxisData.value = []
  seriesData.value = []
  try {
    const { data } = await apiGetOracleEchartParams(tabNetwork.value)
    legendData.value = data.legendData
    xAxisData.value = data.xaxisData
    const seriesDataInfo =  data.seriesData?.map((item:any) => {
      item['type'] = 'line'
      item['stack'] = 'Total'

      return item
    });
    seriesData.value = seriesDataInfo
    console.log('getOracleChart-data:', data)
  } catch(err:any){
    console.log('getOracleChart-err:', err)
  }

  myChart.value && myChart.value.dispose()
  initChart(myChartRef.value, theme.themeValue);
}
// 切换网络
const changeNetwork = ()=>{
  console.log('tabNetwork',tabNetwork.value)
  getOracleChart()
  getSubscripionInfo()
}

const showPop = (item: string) => {
  console.log('item', item)
  // 根据title显示对应的弹框
  switch (item) {
    case 'Subscription':
      createSubPop();
      break;
    case 'Consumers':
      addConsumerPop();
      break;
    case 'Funds':
      addFundsPop();
      break;
  }
}
// 新增订阅弹框
const createSubPop = () => {
  btnChange()
  showCreateSub.value = true
}
// 订阅数据接收
const getCreateSubInfo = (info: any) => {
  console.log('订阅数据接收', info)
  showCreateSub.value = false
  getSubscripionInfo()
}
// 关闭订阅
const closeCreateSub = (bool: boolean) => {
  showCreateSub.value = bool
  getSubscripionInfo()
}

// 添加消费者弹框
const addConsumerPop = () => {
  btnChange()
  showAddConsumers.value = true
}
// 添加消费者数据接收
const getAddConsumersInfo = (consumersInfo: any) => {
  console.log('添加消费者数据接收', consumersInfo)
  showAddConsumers.value = false
  getSubscripionInfo()
}
// 关闭消费者
const closeAddConsumers = (bool: boolean) => {
  showAddConsumers.value = bool
  getSubscripionInfo()
}

// 添加资金弹框
const addFundsPop = () => {
  btnChange()
  showAddFund.value = true
}
// 添加资金数据接收
const getAddFundInfo = (fundInfo: any) => {
  console.log('添加消费者数据接收', fundInfo)
  showAddFund.value = false
  getBalance()
}
// 关闭资金
const closeAddFund = (bool: boolean) => {
  showAddFund.value = bool
  getBalance()
}
// 切换按钮改变状态,先关闭所有弹框，再开点击的弹框
const btnChange = () => {
  showCreateSub.value = false
  showAddFund.value = false
  showAddConsumers.value = false
}

onMounted(async () => {
  await getOracleChart()
  initChart(myChartRef.value, theme.themeValue);
  // 监测屏幕变化，让echarts自适应宽度
  const handleWindowResize = () => myChart.value.resize();
  window.addEventListener("resize", handleWindowResize)

  await getSubscripionInfo()
  await getBalance()
})

onBeforeUnmount(() => {
  const handleWindowResize = () => myChart.value.resize();
  window.removeEventListener("resize", handleWindowResize)
})
// 跳转subList
const goSublist = () => {
  router.push('/middleware/dashboard/oracle/sublist')
}
// 监测主题变化，改变echarts主题
watch(() => theme.themeValue,
  (value: any) => {
    // console.log(value, 'theme')
    // console.log("dispose", myChart.dispose, value)
    myChart.value && myChart.value.dispose()
    initChart(myChartRef.value, value);
  }
)
</script>

<style scoped lang="less">
.container-border {
  border: 1px solid #EBEBEB;
  border-radius: 12px;
  padding: 20px;
}
span{
  color: rgb(128, 128, 128);
}
.myChart {
  width: 100%;
  height: 100%;
}

.dark-css {
  :deep(.ant-tabs-tab.ant-tabs-tab-disabled) {
    color:grey;
  }
}

:deep(.radio-class, .ant-radio-group) {
  .ant-radio-button-wrapper {
    background-color: unset;
    border-color: unset;
    color: grey;
    border-radius: unset;
  }

  .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:first-child,
  .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:nth-child(2) {
    color: #E2B578;
  }
}

.subscripion-divider {
  margin: 16px auto;
}
&:deep(.is-show-btn){
  color: #E2B578;
  &:hover{
    color: #E2B578;
  }
}
</style>