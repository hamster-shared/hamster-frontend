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
          <div v-if="val.message === null || val.message.length === 0" class="text-center">
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
              <div class="bg-color mt-[20px]">
                <div class="flex justify-end">
                  <div class="text-[#E2B578] text-[14px] cursor-pointer mr-4" @click="openChainIDE(item,val.name)">
                    <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE
                  </div>
                </div>
                <PrismEditor :code="item.fileContent" :isShowlineNumbers="false"></PrismEditor>
                <!-- <div class="mt-4 text-[14px] whitespace-pre-wrap">
                  <div class="flex" >
                    <div class="w-[5%] text-[#73706E] dark:text-[#B4AFAD]">{{ item.line }}</div>
                    <div class="w-[95%] dark:text-[#E0DBD2]">{{ item.fileContent }}</div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <template #extra>
            <div class="open-link-css">
              <span class="mr-[8px] text-[14px] font-normal">
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
import PrismEditor from "@/components/PrismEditor.vue";
import { apiGetContractContent } from "@/apis/checkReport";
const theme = useThemeStore();
const { params } = useRoute();
interface WorkflowsDetailsData {
  repositoryUrl: string,
  status: number,
  startTime: string,
  errorNumber: number,
  duration: string,
  id: string,
}
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
  gistId: string,
  workflowsDetailsData: WorkflowsDetailsData,
}>()
const { metaTrustData, gistId } = toRefs(props)

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
      if (data !== null && data !== undefined) {
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
      }
      
    } catch (error: any) {
      console.log("erro:", error)
    }
  }
}
const openChainIDE = (item: any,name: string) => {
  const repoUrl = props.workflowsDetailsData.repositoryUrl
  const fileName = name
  const projectId = props.workflowsDetailsData.id
  let line = "L1"
  if (item.line != "") {
    line = "L" + item.line
  }
  var url = `https://staging-9589904a8a.chainide.com/s/createGithubProject?url=${repoUrl}&open=${fileName}&type=file&source=hamster&projectId=${projectId}&version=soljson-v0.8.17+commit.8df45f5fjs&line=${line}-${line}`
  window.open(url)
}
</script>
<style lang='less' scoped>
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