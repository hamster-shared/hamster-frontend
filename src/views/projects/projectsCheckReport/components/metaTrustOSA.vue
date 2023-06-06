<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Module</span>
    <div v-if="metaTrustData.issues === 0" class="box-card text-center py-[50px]">
      <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
      <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
      <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
      <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
    </div>
    <div v-else>
      <div class="mt-4" v-if="metaTrustData.issues > 0">
        <label>Severity: </label>
        <a-button class="severity-btn" :class="[checkExitBtn('Critical') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('Critical')">Critical: {{ severityBtnData.CRITICAL }}</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn('High') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('High')">High:  {{ severityBtnData.HIGH }}</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn('Medium') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('Medium')">Medium:  {{ severityBtnData.MEDIUM }} </a-button>
        <a-button class="severity-btn" :class="[checkExitBtn('Low') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('Low')">Low:  {{ severityBtnData.LOW }}</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn('Informational') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('Informational')">Info:  {{ severityBtnData.INFORMATIONAL }}</a-button>
      </div>
      <div v-if="checkedBtn.length === 0" class="box-card text-[#BBBAB9] text-center py-[80px]">
        <div class="text-[10px]">No Data…</div>
        <div class="text-[8px]">You currently do not choose to display data</div>
      </div>
      <div v-else-if="btnDataNum === 0" class="box-card text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      <div v-else class="box-card p-[32px]" :class="[checkExitBtn(val.Criticality)?'block':'hidden']" v-for="(val,key) in reportFileDataOSA" :key="key">
        <div class="flex justify-between">
          <div class="title">{{ val.Library }}</div>
          <div class="font-normal" :class="[val.Criticality === 'Critical'?'text-[#FF0003]':val.Criticality === 'Low'?'text-[#BC5EDE]':val.Criticality === 'High'?'text-[#FF4D4F]':val.Criticality === 'Medium'?'text-[#FAAD14]':'text-[#1890FF]']">{{ val.Criticality }}</div>
        </div>
        <div class="sub-title">{{ val["Vulnerability ID"] }}  | {{ val["CWE ID"] }} | {{ val.License[0] }}</div>
        <div class="sub-title mt-[20px]">Description</div>
        <div class="desc">{{ val.Description }}</div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, ref, toRefs } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();

interface ItemsData {
  "Vulnerability ID": string;
  "CWE ID": string;
  Library: string;
  Criticality: string;
  Description: string;
  License: [0];
}
interface VulnerabilityData {
  items: ItemsData[];
}
interface ResData {
  vulnerability: VulnerabilityData;
}
interface ReportFileData {
  results: ResData;
}
interface MetaScanOverviewData {
  CRITICAL: string,
  HIGH: string,
  INFORMATIONAL: string,
  LOW: string,
  MEDIUM: string
}
interface MetaTrustData {
  issues: number,
  metaScanOverviewData: MetaScanOverviewData,
  reportFileData: ReportFileData,
}
const props = defineProps<{
  metaTrustData: MetaTrustData,
}>()
const { metaTrustData } = toRefs(props)

const severityBtnData = metaTrustData.value.metaScanOverviewData;
const btnDataNum = ref(0);
let reportFileDataOSA = Object.assign({}, metaTrustData.value.reportFileData.results.vulnerability.items);
const checkedBtn = ref(['Critical', 'High', 'Medium', 'Low', 'Informational']);

const showContent = (value: string) => {
  let index = checkedBtn.value.findIndex((item: string) => item === value);
  if (index === -1) {
    checkedBtn.value.push(value);
  } else {
    checkedBtn.value.splice(index, 1)
  }
  setBtnDataNum();
}
//判断按钮是否选中
const checkExitBtn = (value: string) => {
  if (value === 'Optimization') value = 'Informational';
  if (checkedBtn.value.findIndex((item: string) => item === value ) !==-1 ) {
    return true;
  } else {
    return false;
  }
}
//记录选中按钮对应的数据总数
const setBtnDataNum = () => {
  btnDataNum.value = 0;
  checkedBtn.value.forEach((ele:string) => {
    btnDataNum.value += severityBtnData[ele.toUpperCase()];
  });
}

onMounted(() => {
  setBtnDataNum();
})
</script>
<style lang='less' scoped>
.severity-btn{
  margin-left: 16px;
  width: 100px;
  background-color: transparent;
  border: 2px solid #E2B578;
  color: #E2B578;
}
.severity-btn-hover:hover{
  background: rgba(226,181,120,0.2);
  color: #E2B578;
}
.severity-btn-checked{
  background: #E2B578;
  color: #FFFFFF;
}
.white-css{
  .box-card{
    background: #FFFFFF;
    box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
    border: 1px solid #F8F8F8;
  }
  .sub-title{
    color: #000000;
  }
  .desc{
    color: #73706E;
  }
}
.dark-css{
  .box-card{
    background-color: #36322D;
    border: 1px solid #36322D;
  }
  .sub-title{
    color: #FFFFFF;
  }
  .desc{
    color: #B4AFAD;
  }
}
.box-card{
  margin-top: 25px;
  border-radius: 12px;
  line-height: 22px;
  font-size: 16px;
  .title{
    font-weight: bold;
    margin-bottom: 10px;
  }
  .sub-title{
    font-weight: 400;
  }
  .desc{
    font-weight: 400;
    margin-top: 10px;
  }
}
</style>