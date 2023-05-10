<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Files</span>
    <div class="mt-4" v-if="metaTrustData.issues > 0">
      <label class="dark:text-[#E0DBD2]">Severity: </label>
      <a-button class="Severity-btn" :class="[checkExitBtn('CRITICAL') ? 'Severity-btn-checked':'Severity-btn-hover']" @click="showContent('CRITICAL')">Critical: {{ SeverityBtnData.CRITICAL }}</a-button>
      <a-button class="Severity-btn" :class="[checkExitBtn('HIGH') ? 'Severity-btn-checked':'Severity-btn-hover']" @click="showContent('HIGH')">High:  {{ SeverityBtnData.HIGH }}</a-button>
      <a-button class="Severity-btn" :class="[checkExitBtn('MEDIUM') ? 'Severity-btn-checked':'Severity-btn-hover']" @click="showContent('MEDIUM')">Medium:  {{ SeverityBtnData.MEDIUM }} </a-button>
      <a-button class="Severity-btn" :class="[checkExitBtn('LOW') ? 'Severity-btn-checked':'Severity-btn-hover']" @click="showContent('LOW')">Low:  {{ SeverityBtnData.LOW }}</a-button>
      <a-button class="Severity-btn" :class="[checkExitBtn('INFORMATIONAL') ? 'Severity-btn-checked':'Severity-btn-hover']" @click="showContent('INFORMATIONAL')">Info:  {{ SeverityBtnData.INFORMATIONAL }}</a-button>
    </div>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="box-card">
      <div v-if="checkedBtn.length === 0" class="text-[#BBBAB9] text-center py-[80px]">
        <div class="text-[10px]">No Data…</div>
        <div class="text-[8px]">You currently do not choose to display data</div>
      </div>
      <div v-else-if="Object.keys(reportFileDataSP).length === 0" class="text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      <a-collapse v-else v-model:activeKey="activeKey" v-for="(val,key) in reportFileDataSP" :key="key">
        <a-collapse-panel :key="key" :header="key" :showArrow="false">
          <div v-if="val.Details.length === 0" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div>
          <div v-for="(item,index) in val.Details" :key="index">
            <div v-if="Object.keys(item).length > 0">
              <div :class="{'border-css' : index !== 0}"></div>
              <div class="font-bold">
                <label class="mr-2" :class="[item.Severity === 'CRITICAL'?'text-[#FF0003]':item.Severity === 'LOW'?'text-[#BC5EDE]':item.Severity === 'HIGH'?'text-[#FF4D4F]':item.Severity === 'MEDIUM'?'text-[#FAAD14]':'text-[#1890FF]']">[{{ item.Severity }}]</label>
                <label>{{ item.Title }}</label>
              </div>
              <div class="bg-color mt-[20px] p-[20px]">
                <div class="flex justify-end">
                  <!-- <div class="text-[#E2B578] text-[14px] cursor-pointer" @click="openChainIDE(key)">
                    <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE
                  </div> -->
                </div>
                <div class="mt-4  text-[14px] whitespace-pre-wrap">
                  <div class="flex" >
                    <div class="w-[5%] text-[#73706E] dark:text-[#B4AFAD]">{{ item.affectedFiles.range.start.line }}</div>
                    <div class="w-[95%] text-[#545454] dark:text-[#B4AFAD]">{{ item.affectedFiles.text }}</div>
                  </div>
                </div>
              </div>
              <div class="font-medium mt-[20px]">Description</div>
              <div class="text-[#73706E] dark:text-[#B4AFAD]">{{ item.Description }}</div>
              <div class="font-medium mt-[20px]">POC</div>
              <div class="bg-color mt-[20px] p-[20px] text-[14px]">
                <div class="flex text-[#73706E] dark:text-[#B4AFAD]" v-for="subItem in item.poc" :key="index">
                  <div class="mr-4">Step {{ subItem.callDepth }}</div>
                  <div>
                    <label>{{ subItem.functionName }}</label>
                    <label v-for="subVal in subItem.parameters" :key="index" class="pl-4">
                      {{ subVal.name }} = {{ subVal.value }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #extra>
            <div>
              <span class="mr-[8px] text-[14px] text-[#E2B578] font-normal">
                {{ val.Details.length + ' issues found' }}
              </span>
              <svg-icon name="up-arrow" size="12" />
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, toRefs } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();

interface Parameters {
  name: string,
  value: string,
}
interface PocData {
  callDepth: string,
  functionName: string,
  parameters: Parameters[],
}
interface lineData {
  line: string,
  column: string,
}
interface RangeData {
  start: lineData,
  end: lineData,
}
interface FileData {
  text: string,
  highlights: RangeData[],
  range: RangeData,
}
interface Details {
  Severity: string,
  Description: string,
  Title: string,
  affectedFiles: FileData,
  poc: PocData[],
}
interface IssuesData {
  Details: Details[],
}
interface ReportFileData {
  Issues: IssuesData[]
}
interface MetaScanOverviewData {
  CRITICAL: number,
  HIGH: number,
  INFORMATIONAL: number,
  LOW: number,
  MEDIUM: number
}
interface MetaTrustData {
  issues: number,
  metaScanOverviewData: MetaScanOverviewData,
  reportFileData: ReportFileData,
}
const props = defineProps<{
  metaTrustData: MetaTrustData,
  gistId: string,
}>()
const { metaTrustData, gistId } = toRefs(props)

const SeverityBtnData = metaTrustData.value.metaScanOverviewData;
const reportFileDataSP = Object.assign({}, metaTrustData.value.reportFileData.Issues);
const activeKey = ref(['1']);
const checkedBtn: any = ref(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL']);

const showContent = (value: any) => {
  let index = checkedBtn.value.findIndex((item: any) => item === value);
  if (index === -1) {
    checkedBtn.value.push(value);
  } else {
    checkedBtn.value.splice(index, 1)
  }
  setCheckBtnData();
}
//判断按钮是否选中
const checkExitBtn = (value: any) => {
  if (value === 'OPTIMIZATION') value = 'INFORMATIONAL';
  if (checkedBtn.value.findIndex((item: any) => item === value ) !==-1 ) {
    return true;
  } else {
    return false;
  }
}
//设置点击按钮需要显示的数据
const setCheckBtnData = () => {
  let baseReportFileData = metaTrustData.value.reportFileData.Issues;
  for (let key in baseReportFileData) {
    let tempArray: any[] = [];
    delete reportFileDataSP[key];
    baseReportFileData[key].Details.forEach(element => {
      if (checkExitBtn(element.Severity)) {
        tempArray.push(element)
      }
    });
    if (tempArray.length > 0) {
      reportFileDataSP[key] = {
        Details: tempArray
      };
    }
  }
}
const openChainIDE = (name: any) => {
  const openVal = name.substring(name.lastIndexOf("/")+1)
  window.open("https://chainide.com/s/createGistProject?gist="+gistId.value+"&open="+openVal);
}
</script>
<style lang='less' scoped>
.Severity-btn{
  margin-left: 16px;
  width: 100px;
  background: rgba(255,255,255,0.2);
  border: 2px solid #E2B578;
  color: #E2B578;
}
.Severity-btn-hover:hover{
  background: rgba(226,181,120,0.2);
  color: #E2B578;
}
.Severity-btn-checked{
  background: #E2B578;
  color: #FFFFFF;
}
.svg-icon {
  transform: rotate(180deg);
  transition: all .3s, visibility 0s;
  color: #E2B578;
}
:deep(.ant-collapse-item-active .svg-icon) {
  transform: rotate(0deg);
}
:deep(.dark-css .ant-collapse){
  border-bottom: 1px solid #302D2D;
}
:deep(.white-css .ant-collapse){
  border-bottom: 1px solid #F3F3F3;
}
:deep(.ant-collapse){
  font-size: 16px;
}
:deep(.ant-collapse-item){
  padding: 0 24px;
}
:deep(.dark-css .ant-collapse-header){
  color: #E0DBD2 !important;
}
:deep(.ant-collapse-header){
  font-weight: 500;
  padding: 15px 0 !important;
}
:deep(.dark-css .ant-collapse-content){
  background-color: #36322D;
  border: 1px solid rgba(216, 216, 216,0.2);
}
:deep(.white-css .ant-collapse-content){
  border: 1px solid rgba(151, 151, 151, 0.2);
}
:deep(.ant-collapse-content){
  border-radius: 12px !important;
  margin-bottom: 20px;
}
.dark-css{
  background: #36322D;
  border: 1px solid #302D2D;
  .bg-color{
    background-color: rgba(216, 216, 216,0.2);
  }
  .border-css{
    border-bottom: 1px solid #45423D;
  }
}
.white-css{
  background: #FFFFFF;
  box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
  border: 1px solid #F8F8F8;
  .bg-color{
    background-color: rgba(216, 216, 216, 0.2);
  }
  .border-css{
    border-bottom: 1px solid #F3F3F3;
  }
}
.box-card{
  margin-top: 25px;
  border-radius: 12px;
  line-height: 22px;
  font-size: 16px;
  .hight-light{
    background-color: rgba(226, 181, 120, 0.10)
  }
  .border-css{
    margin-bottom: 40px;
    margin-top: 40px;
  }
}
</style>