<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Files</span>
    <div class="mt-4" v-if="metaTrustData.issues > 0">
      <label>Severity: </label>
      <a-button class="severity-btn" :class="[checkExitBtn('CRITICAL') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('CRITICAL')">Critical: {{ severityBtnData.CRITICAL }}</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn('HIGH') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('HIGH')">High:  {{ severityBtnData.HIGH }}</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn('MEDIUM') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('MEDIUM')">Medium:  {{ severityBtnData.MEDIUM }} </a-button>
      <a-button class="severity-btn" :class="[checkExitBtn('LOW') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('LOW')">Low:  {{ severityBtnData.LOW }}</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn('INFORMATIONAL') ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent('INFORMATIONAL')">Info:  {{ severityBtnData.INFORMATIONAL }}</a-button>
    </div>

    <div class="box-card">
      <div v-if="checkedBtn.length === 0" class="text-[#BBBAB9] text-center py-[80px]">
        <div class="text-[10px]">No Data…</div>
        <div class="text-[8px]">You currently do not choose to display data</div>
      </div>
      <div v-else-if="Object.keys(reportFileDataCQ).length === 0" class="text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      
      <a-collapse v-else v-model:activeKey="activeKey" v-for="(val,key) in reportFileDataCQ" :key="key">
        <a-collapse-panel :key="key" :header="key" :showArrow="false">
          <div v-if="val.Details.length === 0" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div>
          <div v-for="(item,index) in val.Details" :key="index">
            <div :class="{'border-css' : index !== 0}"></div>
            <div class="flex justify-between">
              <div class="font-bold">
                <label class="mr-2" :class="[item.Severity === 'CRITICAL'?'text-[#FF0003]':item.Severity === 'LOW'?'text-[#BC5EDE]':item.Severity === 'HIGH'?'text-[#FF4D4F]':item.Severity === 'MEDIUM'?'text-[#FAAD14]':'text-[#1890FF]']">[{{ item.Severity }}]</label>
                <label>File(s) Affected</label>
              </div>
              <div class="text-[#E2B578] text-[14px] cursor-pointer" @click="openChainIDE(key)">
                <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE
              </div>
            </div>

            <div class="whitespace-pre-wrap file-bg mt-[20px] p-[20px] rounded-xl">
              {{ item.file }}
            </div>

            <div class="font-medium mt-[20px]">Description</div>
            <div class="text-[#73706E]">{{ item.Description }}</div>
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
  import { onMounted, ref, toRefs } from 'vue';
  import { useThemeStore } from "@/stores/useTheme";
  import { apiGetMetascanFile } from "@/apis/checkReport";

  const theme = useThemeStore()

  interface FileData {
    lineNum: number,
    lineText: string,
  }
  interface MweData {
    severity: string,
    description: string,
    recommendation: string,
    lineStart: number,
    lineEnd: number,
    hightlights: [0],
    fileContent: FileData[],
  }
  interface ReportFileData {
    Details: MweData[],
    fileKey: string
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
    reportFileData: ReportFileData[],
  }
  const props = defineProps<{
    metaTrustData: MetaTrustData,
  }>()
  const { metaTrustData } = toRefs(props)

  const severityBtnData = metaTrustData.value.metaScanOverviewData;
  const reportFileDataCQ = Object.assign({}, metaTrustData.value.reportFileData.Issues);
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
  //设置代码的点亮行
  // const checkHightlight = (heightlight: any[], value: any) => {
  //   if (heightlight.findIndex((item: any) => item === value ) !==-1 ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //设置点击按钮需要显示的数据
  const setCheckBtnData = () => {
    let baseReportFileData = metaTrustData.value.reportFileData.Issues;
    
    for (let key in baseReportFileData) {
      let tempMwe: any[] = [];
      delete reportFileDataCQ[key];

      baseReportFileData[key].Details.forEach((element:any) => {
        if (checkExitBtn(element.Severity)) {
          tempMwe.push(element)
        }
      });
      if (tempMwe.length > 0) {
        reportFileDataCQ[key] = {
          Details: tempMwe,
          FileAddress: baseReportFileData[key].FileAddress,
        };
      }
    }
  }
  
  //获取显示的代码
  const getMetascanFile = async () => {
    for (let key in reportFileDataCQ) {
      // console.log('key',key)
      let fileKey = reportFileDataCQ[key].FileAddress;
      // console.log('fileKey',fileKey)
      try {
        const { data } = await apiGetMetascanFile(fileKey);
        const tempFile = data.split('\n')

        // console.log('fileKey-data:',tempFile)

        reportFileDataCQ[key]?.Details?.forEach((item:any)=>{
          item.file = tempFile.slice(item.AffectedFiles.Line*1-1, item.AffectedFiles.Line*1)[0]
          // console.log('item:',item)
        })
      } catch (error: any) {
        console.log("erro:", error)
      }
    }
  }
  const openChainIDE = (name: string) => {
    const gistId = localStorage.getItem('gistId');
    const openVal = name.substring(name.lastIndexOf("/")+1)
    window.open("https://chainide.com/s/createGistProject?gist="+gistId+"&open="+openVal);
  }

  onMounted(() => {
    console.log('reportFileDataCQ:',reportFileDataCQ)
    getMetascanFile();
  })
</script>

<style lang='less' scoped>
.severity-btn{
  margin-left: 16px;
  width: 100px;
  background: rgba(255,255,255,0.2);
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
  .file-bg{
    background: rgba(216, 216, 216,0.2);
  }
}
</style>