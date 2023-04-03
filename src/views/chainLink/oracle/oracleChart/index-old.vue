<template>
  <div class="mx-auto" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="flex mt-8">
      <div class="relative flex-1">
        <div style="height: 300px; width: 100%;">
          <v-chart class="chart" :option="option"/>
        </div>
        <div class="absolute top-0 right-[50px]">
          <a-select
            ref="select"
            v-model:value="selectTimeValue"
            style="width: 120px"
            @change="handleChange"
          >
            <a-select-option value="1">Last 1 days</a-select-option>
            <a-select-option value="2">Last 3 days</a-select-option>
            <a-select-option value="3">Last 7 days</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="w-60">
        <span class="block mb-6 text-lg">My Subscripion</span>
        <div v-for="item in subscripion">
          <div class="flex items-center justify-between text-sm">
            <span>{{ item.title }}</span>
            <span>{{ item.number }}</span>
            <a-button type="link">{{ item.btnTitle }}</a-button>
          </div>
          <a-divider class="subscripion-divider"/>
        </div>
        <div class="text-right">
          <a-button type="link">view more</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, provide, watchEffect } from 'vue';
  import { useThemeStore } from "@/stores/useTheme";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import { LineChart } from "echarts/charts";
  import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
  import VChart, { THEME_KEY } from "vue-echarts";

  const theme = useThemeStore();

  use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent 
  ]);

  watchEffect(() => {
    provide(THEME_KEY, theme.themeValue);
  })

  const option = ref({
    title: {
      text: "Overview",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
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
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  });

  const radioValue = ref('mainNet')
  const selectTimeValue = ref('Last 7 days')

  const subscripion = reactive([
    { title: 'Subscripion', number: '3', btnTitle: 'Create' },
    { title: 'Consumers', number: '-', btnTitle: 'Add' },
    { title: 'Funds', number: '11.23link', btnTitle: 'Add' },
  ])

  const handleChange = ()=>{
    console.log('selectTimeValue:',selectTimeValue.value)
  }
</script>

<style scoped lang="less">
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
  .verticle-divider {
    height: 300px;
    margin: 0 24px;
  }
  .subscripion-divider {
    margin: 16px auto;
  }
</style>