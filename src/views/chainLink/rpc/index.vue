<template>
  <div class="font-bold text-[24px]">RPC</div>
  <div class="text-[16px] dark:text-[#E0DBD2] text-[#73706E] mb-[16px]">Something like that…</div>
  <div class="">
    <div>
      <a-tabs v-model:activeKey="tabNetwork" @change="handleChange">
        <a-tab-pane :key="item" :tab="item" v-for="item in networkList"></a-tab-pane>
      </a-tabs>

    </div>
    <div class="flex justify-between mt-[16px]">
      <div class="font-bold text-[20px]">Overiew</div>
      <!-- <a-select ref="select" v-model:value="tiemValue" style="width: 120px" @change="handleChange">
        <a-select-option :value="item.id" v-for="item in timeList">{{ item.name }}</a-select-option>
      </a-select> -->
    </div>
    <!-- 图表 -->
    <div class="w-full h-[500px]">
      <div class="myChart" ref="myChartRef" id="myEchart"></div>
    </div>

  </div>
  <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[32px]">
    <div class="font-bold text-[20px]">My Network</div>
    <div class="text-right">
      <a-button>Docs</a-button>
    </div>
    <div class="mt-[24px]">
      <a-table :dataSource="dataSource" :columns="columns" :pagination="currentPagination">
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
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import * as echarts from 'echarts';
import { apiGetOverview, apiGetMynetwork } from "@/apis/rpcs";
import { useThemeStore } from "@/stores/useTheme";
import { formatDateToLocale } from '@/utils/dateUtil';
const router = useRouter();
const timeList = ref([{ name: 'Last 7 days', id: 2 }, { name: 'Last 30 days', id: 3 }, { name: 'Last 90 days', id: 4 }, { name: 'All time', id: 1 }])
const tiemValue = ref(2);
const rpcData = ref([]);
const dataSource = ref([]);
const networkList = ref([]);
const tabNetwork = ref('');
const seriesData = ref([]);
const legendData = ref([]);
const xAxisData = ref([]);
const myChartRef = ref()
const myChart = ref();

const mainnetData = ref([]);
const testnetData = ref([]);
const theme = useThemeStore();

const columns = [
  {
    title: 'Number',
    align: "center",
    customRender: ({ index }: any) => {
      return `${index + 1}`
    },
  },
  {
    title: 'Network',
    dataIndex: 'network',
    align: "center",
    key: 'network',
  },
  {
    title: 'Add',
    dataIndex: 'created_at',
    align: "center",
    key: 'created_at',
    customRender: ({ text: date }: any) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Total request',
    dataIndex: 'total_requests_all',
    align: "center",
    key: 'total_requests_all',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    align: "center",
    key: 'action',
  },
]

const handleChange = (val: string) => {
  console.log(val, 'val')
  if (val === 'Mainnet') {
    setEchartData(mainnetData.value);
  } else {
    setEchartData(testnetData.value);
  }
}

const toDetails = (val: any) => {
  // console.log(val, '点击详情操作')
  router.push(`/chainlink/RPC/rpcDetail/${val.chain}`);
}

const initRpcOverview = async () => {
  try {
    const { data } = await apiGetOverview();
    rpcData.value = data;

    data.map((item: any) => {
      if (item.network === 'Mainnet') {
        networkList.value.push('Mainnet');
        mainnetData.value.push(item);

      } else {
        networkList.value.push('Testnet');
        testnetData.value.push(item);

      }
    })

    // console.log(mainnetData.value, testnetData.value, 'uuu')

    networkList.value = Array.from(new Set(networkList.value));
    tabNetwork.value = networkList.value[0];
    if (mainnetData.value.length > 0) {
      setEchartData(mainnetData.value);
    } else {
      setEchartData(testnetData.value);
    }

  } catch (err: any) {
    console.info(err)
  }
}


const setEchartData = (data: any) => {
  seriesData.value = [];
  legendData.value = [];
  xAxisData.value = [];
  data[0].dayly_requests_7days.map((it: any) => {
    xAxisData.value.push(formatDateToLocale(it.start_time).format("YYYY/MM/DD"))
  })

  data.map((item: any) => {
    legendData.value.push(item.chain);
    let data = {
      name: item.chain,
      type: 'line',
      stack: 'Total',
      data: item.dayly_requests_7days.map((val: any) => { return val.request })
    }
    seriesData.value.push(data)
  })

  myChart.value && myChart.value.dispose()
  initChart(myChartRef.value, theme.themeValue);

  // console.log(legendData.value, 'legendData.value')
  // console.log(seriesData.value, 'seriesData.value')
}


const getMynetworkData = async () => {
  const params = {
    page: currentPagination.current,
    size: currentPagination.pageSize,
  }
  const { data, pagination } = await apiGetMynetwork(params);
  dataSource.value = data;
  currentPagination.total = pagination.total;
}

const currentPagination = reactive({
  // 分页配置器
  pageSize: 5, // 一页的数据限制
  current: 1, // 当前页
  total: 0, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['5'], // 指定每页可以显示多少条
  onShowSizeChange: (current: number, pagesize: number) => {
    // 改变 pageSize时的回调
    currentPagination.current = current;
    currentPagination.pageSize = pagesize;
    getMynetworkData()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    currentPagination.current = current;
    getMynetworkData()
  },
});


const initChart = (chartElement: HTMLElement, themeValue: string) => {
  // console.log(themeValue, 'themeValue')
  const chart = echarts.init(chartElement, themeValue);

  chart.setOption({
    backgroundColor: '',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData.value,
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
      data: xAxisData.value,
    },
    yAxis: {
      type: 'value'
    },
    series: seriesData.value,
  })
  myChart.value = chart
}

onMounted(async () => {
  await initRpcOverview();
  initChart(myChartRef.value, theme.themeValue);
  const handleWindowResize = () => myChart.value.resize();
  window.addEventListener("resize", handleWindowResize)
  getMynetworkData();
})

onBeforeUnmount(() => {
  const handleWindowResize = () => myChart.value.resize();
  window.removeEventListener("resize", handleWindowResize)
})

watch(() => theme.themeValue,
  (value) => {
    myChart.value && myChart.value.dispose()
    initChart(myChartRef.value, value);
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
