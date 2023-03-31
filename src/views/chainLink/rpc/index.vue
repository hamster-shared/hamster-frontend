<template>
  <div class="font-bold text-[24px]">RPC</div>
  <div class="text-[16px] dark:text-[#E0DBD2] text-[#73706E] mb-[16px]">Something like that…</div>
  <div class="">
    <div>
      <a-tabs v-model:activeKey="tabNetwork">
        <a-tab-pane key="Mainnet" tab="Mainnet"></a-tab-pane>
        <a-tab-pane key="Testnet" tab="Testnet" force-render></a-tab-pane>
      </a-tabs>

    </div>
    <div class="flex justify-between mt-[16px]">
      <div class="font-bold text-[20px]">Overiew</div>
      <a-select ref="select" v-model:value="tiemValue" style="width: 120px" @change="handleChange">
        <a-select-option :value="item.id" v-for="item in timeList">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <!-- 图表 -->
    <div class="w-full h-[500px]">
      <div class="myChart" ref="myChart" id="myEchart"></div>
    </div>

  </div>
  <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[32px]">
    <div class="font-bold text-[20px]">My Network</div>
    <div class="text-right">
      <a-button>Docs</a-button>
    </div>
    <div class="mt-[24px]">
      <a-table :dataSource="dataSource" :columns="columns">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'action'">
            <label class="text-[#FF4A4A] ml-2 cursor-pointer" @click="toDetails(record)">Details</label>
          </template>
        </template>
      </a-table>
    </div>

  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from 'echarts';
const timeList = ref([{ name: 'Last 7 days', id: 2 }, { name: 'Last 30 days', id: 3 }, { name: 'Last 90 days', id: 4 }, { name: 'All time', id: 1 }])
const tiemValue = ref(2);
const dataSource = ref([]);
const tabNetwork = ref('Mainnet');
const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    align: "center",
    key: 'number',
  },
  {
    title: 'Network',
    dataIndex: 'network',
    align: "center",
    key: 'network',
  },
  {
    title: 'Add',
    dataIndex: 'add',
    align: "center",
    key: 'add',
  },
  {
    title: 'Total request',
    dataIndex: 'totalRequest',
    align: "center",
    key: 'totalRequest',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    align: "center",
    key: 'action',
  },
]

const handleChange = (val: number) => {
  console.log(val, 'val')
}

const toDetails = (val: any) => {
  console.log(val, '点击详情操作')
}

const initChart = () => {
  let myChart = echarts.init(document.getElementById('myEchart') as HTMLElement);
  myChart.setOption({
    // darkMode: true,
    // title: {
    //   text: 'Stacked Line'
    // },
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
  window.onresize = function () { // 自适应大小
    myChart.resize();
  };
}

onMounted(() => {
  initChart();
})
</script>
<style lang='less' scoped>
.myChart {
  width: 100%;
  height: 100%;
}

:deep(.ant-radio-group .ant-radio-button-wrapper) {
  border-radius: 0;
}

:deep(.ant-radio-group) {
  margin-top: 24px;
}
</style>
