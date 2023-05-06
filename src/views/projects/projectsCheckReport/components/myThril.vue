<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Files</span>

    <div class="box-card">
      <div v-if="reportIssue == 0" class="text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      
      <a-collapse v-else class="mythril-collapse" v-model:activeKey="activeKey" v-for="(val,key) in reportFileDataMyThril" :key="key">
        <a-collapse-panel :key="key" :header="val.name" :showArrow="false">
          <!-- <div v-if="val.message.length === 0" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div> -->
          <div v-for="(item,index) in val.message" :key="index">
            <div class="text-base">
              {{ item.note }}
            </div>

            <div class="whitespace-pre-wrap file-bg mt-[20px] p-[20px] rounded-xl">
              <div class="flex justify-end text-[#E2B578] text-[14px] cursor-pointer">
                <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE
              </div>
              {{ item.file }}
            </div>
          </div>
          
          <template #extra>
            <div>
              <span class="mr-[8px] text-[14px] text-[#E2B578] font-normal">
                {{ val.message.length + ' issues found' }}
              </span>
              <svg-icon name="up-arrow" size="12" />
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, toRefs } from 'vue';
  import { apiGetContractContent } from "@/apis/checkReport";

  interface FileData {
    lineNum: number,
    lineText: string,
  }
  interface MweData {
    column: string,
    level: string,
    line: string,
    note: string,
    originalText: string,
    tool: string,
    file: string,
    fileContent: FileData[],
  }
  interface ReportFileData {
    message: MweData[],
    fileKey: string,
    name: string
  }
  interface MetaTrustData {
    issues: number,
    projectId: string,
    reportFileData: ReportFileData[],
  }

  const props = defineProps<{
    metaTrustData: MetaTrustData,
  }>()

  const { metaTrustData } = toRefs(props)
  const reportIssue = metaTrustData.value.issues
  const projectId = metaTrustData.value.projectId
  const reportFileDataMyThril = Object.assign([], metaTrustData.value.reportFileData);

  //获取显示的代码
  const getMythrilscanFile = () => {
    reportFileDataMyThril.forEach(async( item:any )=>{
      try {
        const { data } = await apiGetContractContent(projectId, item.name)
        const tempFile = data.split('\n')
        // console.log('mythril-data:', tempFile)

        item.message?.forEach( (message:any) => {
          message.file = tempFile.slice(message.line*1-1, message.line*1)[0]
          // console.log('message.file:', message.file)
        })
      } catch(err:any){
        console.log('mythril-err:',err)
      }
    })
  }
  const openChainIDE = (name: string) => {
    const gistId = localStorage.getItem('gistId');
    const openVal = name.substring(name.lastIndexOf("/")+1)
    window.open("https://chainide.com/s/createGistProject?gist="+gistId+"&open="+openVal);
  }

  onMounted(() => {
    console.log('mythril:',reportFileDataMyThril, reportIssue)
    getMythrilscanFile()
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
.file-bg{
  background: rgba(216, 216, 216,0.2);
}
:deep(.ant-collapse-item-active .svg-icon) {
  transform: rotate(0deg);
}
:deep(.ant-collapse){
  border-bottom: 1px solid #F3F3F3;
  font-size: 16px;
}
:deep(.ant-collapse-item){
  padding: 0 24px;
}
:deep(.ant-collapse-header){
  font-weight: 500;
  padding: 15px 0 !important;
}
:deep(.ant-collapse-content-box){
  border-radius: 12px;
  border: 1px solid rgba(151, 151, 151, 0.2);
  margin-bottom: 20px;
}
.box-card{
  margin-top: 25px;
  box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
  border-radius: 12px;
  background: #FFF;
  border: 1px solid #F8F8F8;
  line-height: 22px;
  font-size: 16px;
  .bg-color{
    background-color: rgba(216, 216, 216, 0.2);
  }
}

html[data-theme='dark']{
  .box-card{
    background: #36322D;
    border: 1px solid #302D2D;
    box-shadow: unset;
  }
  .ant-collapse{
    border-bottom: unset;
  }
  .mythril-collapse{
    :deep(.ant-collapse>.ant-collapse-item) {
      border-bottom: 1px solid #302D2D;
    }

    :deep(.ant-collapse-content) {
      background-color: #36322D;
      border-radius: 12px;
    }
  }
}
</style>