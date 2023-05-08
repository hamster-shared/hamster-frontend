<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Files</span>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="box-card">
      <div v-if="reportFileData.length === 0" class="text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      <a-collapse v-else v-model:activeKey="activeKey" v-for="(val,key) in reportFileData" :key="key">
        <a-collapse-panel :key="key" :header="val.name" :showArrow="false">
          <div v-if="val.message.length === 0" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div>
          <div v-for="(item,index) in val.message" :key="index">
            <div v-if="Object.keys(item).length > 0">
              <div :class="{'border-css' : index !== 0}"></div>
              <div class="font-bold">
                <label class="mr-2" :class="[item.level === 'warning'?'text-[#F6662B]':'text-[#FF0003]']">[{{ item.level }}]</label>
                <label>{{ item.note }}</label>
              </div>
              <div class="bg-color mt-[20px] p-[20px]">
                <div class="flex justify-end">
                  <div class="text-[#E2B578] text-[14px] cursor-pointer" @click="openChainIDE(val.name)">
                    <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE
                  </div>
                </div>
                <div class="mt-4 text-[14px] whitespace-pre-wrap">
                  <div class="flex" >
                    <div class="w-[5%] text-[#73706E] dark:text-[#B4AFAD]">{{ item.line }}</div>
                    <div class="w-[95%] dark:text-[#E0DBD2]">{{ item.fileContent }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #extra>
            <div>
              <span class="mr-[8px] text-[14px] text-[#E2B578] font-normal">
                {{ val.issue + ' issues found' }}
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
import { useRoute } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import { apiGetContractContent } from "@/apis/checkReport";
const theme = useThemeStore();
const { params } = useRoute();

interface MessageData {
  level: string,
  line: string,
  note: string,
  fileContent: string,
}
interface ReportFileData {
  issue: number,
  name: string,
  message: MessageData[]
}
interface MetaTrustData {
  issues: number,
  reportFileData: ReportFileData[],
}
const props = defineProps<{
  metaTrustData: MetaTrustData,
}>()
const { metaTrustData } = toRefs(props)

const reportFileData = Object.assign({}, metaTrustData.value.reportFileData);
const activeKey = ref(['1']);

onMounted(() => {
  getMetascanFile();
})
//获取显示的代码
const getMetascanFile = async () => {
  console.log("reportFileData:",reportFileData);
  for (let key in reportFileData) {
    try {
      const { data } = await apiGetContractContent(params.id, reportFileData[key].name);
      const tempFile = data.split('\n');

      //截取需要显示的代码
      reportFileData[key].message.forEach((element, index) => {
        let tempData = '';
        if (tempFile.length >= element.line) {
          tempData = tempFile[parseInt(element.line) - 1];
        }
        element.fileContent = tempData;
        // reportFileData[ind].message[index].fileContent = tempData;
      });
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