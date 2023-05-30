<template>
  <div v-if="resultInfo?.length || gasInfo || AiInfo"  class="rounded-[12px] mt-[24px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211]">
    <div class="check-container">
      <div>
        <img class="mr-[8px]" src="@/assets/icons/Solhint.svg" />
        <span class="check-container-title">Check Result</span>
      </div>

      <div v-for="(item, index) in resultInfo" v-if="resultInfo?.length" :key="index" class="items-center grid grid-cols-4 pl-10 rounded-xl my-8 border border-[#B5B5B5] border-solid">
        <span class="text-base font-bold">{{ item?.title }}</span>
        <div v-for="content in item?.content" class="py-8">
          <div>
            <span class="text-4xl cursor-pointer" :id="content?.checkTool" @click="router.push(`${route.fullPath}/${content.checkTool}?reportId=${content.id}&currentName=${currentName.replace('#','[')}`)">{{ content.issues }}</span>
            <span class="block text-2xl">issues</span>
            <span class="text-base">{{ content.checkTool }}</span>
          </div>
        </div>
      </div>

      <div v-if="gasInfo" class="grid grid-cols-4 p-10 rounded-xl my-8 border border-[#B5B5B5] border-solid">
        <span class="pt-10 text-base font-bold">{{ gasInfo?.title }}</span>
        <div>
          <span class="text-4xl">{{ gasInfo?.content[0].issues }}</span>
          <span class="block text-2xl">issues</span>
          <span class="text-base">{{ gasInfo?.content[0].checkTool }}</span>
        </div>
        <div class="flex col-span-2">
          <div class="flex-1">
            <span class="block mb-2 text-base font-bold">{{ gasInfo?.content[0].name }}</span>
            <div>
              <span class="inline-block my-2 text-base font-medium">Contract: {{ gasAnalysisReport?.message[0]?.contractName }}</span>
              <div v-for="gasItem in gasAnalysisReport?.message[0]?.TestResultList">
                <img v-show="gasItem.result === 1" src="@/assets/icons/gas-y.svg" class="w-[30px] h-[30px]" />
                <img v-show="gasItem.result === 0" src="@/assets/icons/gas-n.svg" class="w-[30px] h-[30px]" />
                <span class="text-base">{{ gasItem.unitTestTitle }}</span>
              </div>
            </div>
          </div>
          <a-button class="view-detail-btn" type="link" @click="router.push(`${route.fullPath}/gasInfoDetail?currentName=${currentName.replace('#','[')}`)">View Detail</a-button>
        </div>
      </div>

      <div v-if="AiInfo" class="p-10 rounded-xl my-8 border border-[#B5B5B5] border-solid">
        <div class="mb-9">
          <span class="block text-base font-bold">{{ AiInfo?.title }}</span>
          <span class="text-base">Support by OpenAI</span>
        </div>
        <span class="col-span-3 text-base whitespace-pre-wrap">{{ AiInfo?.content[0].reportFile }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted,toRefs } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  import { apiGetCheckResult } from "@/apis/workFlows";
  const props = defineProps({
    currentName:{
      type:String,
      default:''
    }
  })
  const { currentName } = toRefs(props)
  const { params } = useRoute();
  const route = useRoute()
  const router = useRouter()

  const resultInfo = ref<[] | null>([])
  const gasInfo = ref()
  const AiInfo = ref()
  const gasAnalysisReport = ref()
  const getCheckResultInfo = async() => {
    try {
      const { data } = await apiGetCheckResult({id:params.workflowsId, detailId:params.workflowDetailId})
      console.log('getCheckResultInfo-data:', data)
      const info = data
      
      info?.forEach( (item:any)=>{
        if( item.title == 'Secutity Analysis' || item.title == 'Open Source Analysis' || item.title == 'Code Quality Analysisi') {
          resultInfo.value?.push(item)
          console.log('resultInfo.value', resultInfo.value)

        } else if( item.title == 'Gas Usage Analysis' ){
          gasInfo.value = item
          
          let reportFileInfo = JSON.parse(item.content[0].reportFile)
          console.log('Gas Usage Analysis:reportFileInfo', reportFileInfo)

          const gasReport = reportFileInfo.find((report:any)=>Object.keys(report.message[0]).includes('TestResultList'))
          console.log('gasReport:',gasReport)
          gasAnalysisReport.value = gasReport
          
        } else if( item.title == 'AI Analysis' ){
          console.log('AI Analysis')
          AiInfo.value = item
        }
      })
    } catch (err: any) {
      console.log('getCheckResultInfo-data:', err)
    }
  }

  onMounted(()=>{
    getCheckResultInfo()
  })
    
</script>

<style lang="less" scoped>
  .check-container {
    padding: 32px;
    border-radius: 12px;
    margin-bottom: 24px;
    .check-container-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 32px;
      vertical-align: middle;
    }
  }
  .view-detail-btn {
    @apply text-base font-normal p-0;
  }
</style>