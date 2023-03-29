<template>
  <div class="font-bold text-[24px]">RPC</div>
  <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px]">
    <div>
      <a-radio-group v-model:value="tabNetwork">
        <a-radio-button value="Mainnet">Mainnet</a-radio-button>
        <a-radio-button value="Testnet">Testnet</a-radio-button>
      </a-radio-group>

    </div>
    <div class="flex justify-between mt-[16px]">
      <div class="font-bold text-[20px]">Overiew</div>
      <a-select ref="select" v-model:value="tiemValue" style="width: 120px" @change="handleChange">
        <a-select-option :value="item.id" v-for="item in timeList">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <!-- 图表 -->
    <div class="w-full h-[500px]">
      <div class="myChart" ref="myChart"></div>
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
import { ref, onMounted } from "vue";
import * as echarts from 'echarts';
const timeList = ref([{ name: 'Last 7 days', id: 2 }, { name: 'Last 30 days', id: 3 }, { name: 'Last 90 days', id: 4 }, { name: 'All time', id: 1 }])
const tiemValue = ref(2);
const dataSource = ref([]);
const myChart = ref();
const myChartShow = ref();
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
  const option = {
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
  }

  myChartShow.value = echarts.init(myChart.value);
  myChartShow.value.setOption(option);
}

onMounted(() => {
  initChart();
  // window.addEventListener("resize", () => {
  //   console.log(myChartShow.value, 'kk')
  //   myChartShow.value.resize();
  // });
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