<template>
  <div :id="echartsId" :style="{width: '100%', height: '100%'}"></div>
</template>

<script lang="ts" setup>
// 引入echarts
import * as echarts from 'echarts'
import { onMounted, toRefs } from "vue";

const props = defineProps({
  echartsData: Array,
  echartsId: {
    type:String,
    required:true
  },
});
const { echartsData, echartsId } = toRefs(props);

const setShowNumber = (value: any) => {
  let valLen = value.toString().length;
  if (value.toString().length > 3) {
    return value.toString().substring(0,valLen-3) + 'K';
  } else {
    return value;
  }
}

onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  let myChart = echarts.init(document.getElementById(echartsId?.value)as HTMLElement);
  // 绘制图表
  myChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: {
      type: 'value',
      // axisLine: {
      //   show: true,
      //   lineStyle: {
      //     color: '#E2B578'
      //   }
      // },
      axisLabel: {
        // formatter: '{value}'
        formatter: function (value: any, index: any) {
          return setShowNumber(value);
        }
      }
    },
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10000, 52000, 200000, 33000, 390000, 330000, 220000],
        itemStyle: {
          color: '#E2B578'
        },
      }
    ]
  });
  window.onresize = function () { // 自适应大小
    myChart.resize();
  };
});
</script>
