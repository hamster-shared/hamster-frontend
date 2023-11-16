<template>
  <div :id="echartsId" :style="{width: '100%', height: '100%'}"></div>
</template>

<script lang="ts" setup>
// 引入echarts
import * as echarts from 'echarts'
import { onMounted, ref, toRefs, watch } from "vue";

const props = defineProps({
  // echartsData: Array,
  echartsData: {
    type:Object,
    default: {
      valueX: [],
      valueY: {}
    }
  },
  echartsId: {
    type:String,
    required:true
  },
});
const { echartsData, echartsId } = toRefs(props);

const seriesList = ref<any>([]);
const setSeriesArray = () => {
  for (let key in echartsData.value.valueY) {
    seriesList.value.push({
      name: key,
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      emphasis: {
        focus: 'series'
      },
      data: echartsData.value.valueY[key]
    });
  }
  console.log("seriesList.value:",seriesList.value);
}

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
  let myChart = echarts.init(document.getElementById(echartsId?.value) as HTMLElement);
  // 清空图标中的数据
  myChart.clear();
  setSeriesArray(); //设置series数据
  // 绘制图表
  myChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      left: '3%',
      textStyle: {
        color: '#E2B578'
      },
    }, // 显示柱状图上面的颜色对应的name
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
    series: seriesList.value
    // [
    //   {
    //     name: 'Direct',
    //     type: 'bar',
    //     stack: 'total',
    //     label: {
    //       show: true
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     data: [320, 302, 301, 334, 390, 330, 320]
    //   },
    //   {
    //     name: 'Mail Ad',
    //     type: 'bar',
    //     stack: 'total',
    //     label: {
    //       show: true
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     data: [120, 132, 101, 134, 90, 230, 210]
    //   },
    //   {
    //     name: 'Affiliate Ad',
    //     type: 'bar',
    //     stack: 'total',
    //     label: {
    //       show: true
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     data: [220, 182, 191, 234, 290, 330, 310]
    //   },
    //   {
    //     name: 'Video Ad',
    //     type: 'bar',
    //     stack: 'total',
    //     label: {
    //       show: true
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     data: [150, 212, 201, 154, 190, 330, 410]
    //   },
    //   {
    //     name: 'Search Engine',
    //     type: 'bar',
    //     stack: 'total',
    //     label: {
    //       show: true
    //     },
    //     emphasis: {
    //       focus: 'series'
    //     },
    //     data: [820, 832, 901, 934, 1290, 1330, 1320]
    //   }
    // ]
  });
  window.onresize = function () { // 自适应大小
    myChart.resize();
  };
}
onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  setEchartOption();
});
</script>
