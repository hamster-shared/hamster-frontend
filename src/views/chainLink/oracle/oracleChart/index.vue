<template>
  <div class="w-full mx-auto container-border" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div>
      <a-tabs v-model:activeKey="tabNetwork" @change="subscripionInfo">
        <a-tab-pane key="Mainnet" tab="Mainnet"></a-tab-pane>
        <a-tab-pane key="Testnet" tab="Testnet" force-render></a-tab-pane>
      </a-tabs>
    </div>
    
    <div class="flex">
      <div class="flex-1">
        <div class="flex justify-between">
          <div class="font-bold text-[20px]">Overiew</div>
          <a-select
            ref="select"
            v-model:value="selectTimeValue"
            style="width: 120px; margin-right: 20px;"
            @change="handleChange"
          >
            <a-select-option value="1">Last 1 days</a-select-option>
            <a-select-option value="2">Last 3 days</a-select-option>
            <a-select-option value="3">Last 7 days</a-select-option>
          </a-select>
        </div>

        <div class="w-full h-[460px]">
          <div class="myChart" ref="myChartRef" id="myEchart"></div>
        </div>
      </div>

      <div class="self-center pl-4 w-60">
        <span class="block mb-6 text-lg">My Subscription</span>
        <div v-for="item in subscripion">
          <div class="flex items-center mb-4 justify-between text-sm border rounded-lg border-[#EBEBEB] border-solid">
            <span class="pl-4">{{ item.title }}</span>
            <span>{{ item.number }}</span>
            <a-button type="link" @click="showPop(item.title)">{{ item.btnTitle }}</a-button>
          </div>
        </div>
        <div class="text-right">
          <a-button type="link" @click="goSublist">View More</a-button>
        </div>
      </div>
    </div>
  </div>
  <createSub v-if="showCreateSub" :showCreateSub="showCreateSub" @getCreateSubInfo="getCreateSubInfo" @closeCreateSub="closeCreateSub"/>
  <addFunds v-if="showAddFund" :showAddFund="showAddFund" @getAddFundInfo="getAddFundInfo" @closeAddFund="closeAddFund"/>
  <addConsumers v-if="showAddConsumers" :showAddConsumers="showAddConsumers" @getAddConsumersInfo="getAddConsumersInfo" @closeAddConsumers="closeAddConsumers"/>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue';
  import * as echarts from 'echarts';
  import { useThemeStore } from "@/stores/useTheme";
  import createSub from '../mySubscription/components/createSub.vue'
  import addFunds from '../mySubscription/components/addFunds.vue'
  import addConsumers from '../mySubscription/components/addConsumers.vue'
  import { apiGetSubscriptionParams } from '@/apis/chainlink'
  import { useRouter } from 'vue-router'
  
  const router = useRouter();

  const theme = useThemeStore();
  const showCreateSub = ref(false)
  const showAddFund = ref(false)
  const showAddConsumers = ref(false)
  const tabNetwork = ref('Mainnet');

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
        data: ['Email', 'Union Ads', 'Video Ads']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    })

    myChart.value = chart
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

  // 监测时间变化
  const selectTimeValue = ref('Last 7 days')
  const handleChange = ()=>{
    console.log('selectTimeValue:',selectTimeValue.value)
  }

  // 获取my subscription的数据
  const subscripion = reactive([
    { title: 'Subscription', number: '', btnTitle: 'Create' },
    { title: 'Consumers', number: '', btnTitle: 'Add' },
    { title: 'Funds', number: '11.23link', btnTitle: 'Add' },
  ])
  const subscripionInfo = async()=>{
    const token = localStorage.getItem('token')
    const params = {
      network: tabNetwork.value,
      token
    }
    try {
      const { data } = await apiGetSubscriptionParams(params)
      subscripion[0].number = data.total_subscription
      subscripion[1].number = data.total_consumers
      console.log('data:',data)
    } catch(err:any){
      console.log('err:',err)
    }
  }
  
  const showPop = (item:string)=>{
    console.log('item',item)
    // 根据title显示对应的弹框
    switch(item){
      case 'Subscripion':
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
const createSubPop = ()=>{
    btnChange()
    showCreateSub.value = true
}
// 订阅数据接收
const getCreateSubInfo = (info:any)=>{
    console.log('订阅数据接收',info)
}
// 关闭订阅
const closeCreateSub = (bool:boolean)=>{
    showCreateSub.value = bool
}

// 添加消费者弹框
const addConsumerPop = ()=>{
    btnChange()
    showAddConsumers.value = true
}
// 添加消费者数据接收
const getAddConsumersInfo = (consumersInfo:any)=>{
    console.log('添加消费者数据接收',consumersInfo)
}
// 关闭消费者
const closeAddConsumers = (bool:boolean)=>{
    showAddConsumers.value = bool
}

// 添加资金弹框
const addFundsPop = ()=>{
    btnChange()
    showAddFund.value = true
}
// 添加资金数据接收
const getAddFundInfo = (fundInfo:any)=>{
    console.log('添加消费者数据接收',fundInfo)
}
// 关闭资金
const closeAddFund = (bool:boolean)=>{
    showAddFund.value = bool
}
// 切换按钮改变状态,先关闭所有弹框，再开点击的弹框
const btnChange = ()=>{
    showCreateSub.value = false
    showAddFund.value = false
    showAddConsumers.value = false
}

onMounted(async() => {
  initChart(myChartRef.value, theme.themeValue);

  // 监测屏幕变化，让echarts自适应宽度
  const handleWindowResize = () => myChart.value.resize();
  window.addEventListener("resize", handleWindowResize)

  await subscripionInfo()
})

onBeforeUnmount(() => {
  const handleWindowResize = () => myChart.value.resize();
  window.removeEventListener("resize", handleWindowResize)
// 跳转subList
const goSublist = ()=>{
  router.push('/chainlink/oracle/subList')
}
</script>

<style scoped lang="less">
 .container-border {
  border: 1px solid #EBEBEB;
  border-radius: 12px;
  padding: 20px;
 }
  .myChart {
    width: 100%;
    height: 100%;
  }
  :deep(.radio-class,.ant-radio-group) {
     .ant-radio-button-wrapper {
      background-color: unset;
      border-color: unset;
      color: grey;
      border-radius: unset;
    }
    .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:first-child,
    .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:nth-child(2){
      color: #E2B578;
    }
  }
  .subscripion-divider {
    margin: 16px auto;
  }
</style>