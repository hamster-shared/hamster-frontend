<template>
  <div :id="echartsId" :style="{width: '180px', height: '180px'}"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, toRefs } from "vue";

const props = defineProps({
  echartsData: Array,
  echartsId: {
    type:String,
    required:true
  },
  titleText: {
    type:String,
    required:true
  },
});
const { echartsData, echartsId, titleText } = toRefs(props);

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById(echartsId.value));
  // 绘制图表
  myChart.setOption({
    title: {
      text: titleText.value,
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b}: ({d}%)'
      formatter : function (params: any) {
        return params.seriesName + '<br/><div style="display: flex;align-items: center;"><div style="width:10px; height:10px; border-radius:50%;margin-right:5px; background-color:'+params.color+';"></div><div>' + params.name+": "+params.percent+"%</div></div>";
      }
          
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      show: false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: echartsData?.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
})



</script>
<style scoped lang="less"> 

</style>