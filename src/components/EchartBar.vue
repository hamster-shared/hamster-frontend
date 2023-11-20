<template>
  <div :id="echartsId" :style="{width: '100%', height: '100%'}"></div>
</template>

<script lang="ts" setup>
// 引入echarts
import * as echarts from 'echarts'
import { onMounted, toRefs, watch } from "vue";

const props = defineProps({
  // echartsData: Array,
  echartsData: {
    type:Object,
    default: {
      valueX: [],
      valueY: [],
      seriesName: '',
    }
  },
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

watch(
  () => props.echartsData,
  (value) => {
    setEchartOption();
  }, { deep: true, immediate: false }
);

const setEchartOption = () => {
  let myChart = echarts.init(document.getElementById(echartsId?.value)as HTMLElement);
  // 清空图标中的数据
  myChart.clear();
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
        data: echartsData.value.valueX,
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
        name: echartsData.value.seriesName,
        type: 'bar',
        barWidth: '60%',
        data: echartsData.value.valueY,
        itemStyle: {
          color: '#E2B578'
        },
      }
    ]
  });
  window.onresize = function () { // 自适应大小
    myChart.resize();
  };
}
onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  setEchartOption();
});
</script>
