<template>
  <div :id="echartsId" :style="{width: '168px', height: '50px'}"></div>
</template>

<script lang="ts" setup>
// 引入echarts
import * as echarts from '@/components/Echarts.vue'
import { onMounted, toRefs } from "vue";

const props = defineProps({
  echartsData: Array,
  echartsId: String,
});
const { echartsData, echartsId } = toRefs(props);

onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  let myChart = echarts.init(document.getElementById(echartsId?.value));
  // 绘制图表
  myChart.setOption({
    xAxis: {
      show: false,
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show:false
      },
      data: [1,2,3,4,5,6,7]
    },
    grid: {
      left: "0",
      top: "0",
      right: "0",
      bottom: "0",
      containLabel: true,
    },
    yAxis: {
      axisLabel: { // 取消显示坐标值
        show: false
      },
      splitLine: { //取消网格线
        show:false
      },
      type: 'value'
    },
    series: [
      {
        symbol: "none",
        smooth: false,//平滑
        name: "Dayly Requests（7days）",
        type: "line",
        data: echartsData?.value,
        itemStyle: {
          normal: {
            color: '#E2B578'
          }
        }
      }
    ]
  });
  window.onresize = function () { // 自适应大小
    myChart.resize();
  };
});
</script>
