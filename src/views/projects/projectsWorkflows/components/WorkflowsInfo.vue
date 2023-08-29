<template>
  <div class="workFlows dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px]">
    <a-row>
      <a-col :span="8">
        <div class="">
          <div class="process-detail-title">{{ $t('workFlows.codeRepository') }}</div>
          <div class="truncate process-detail-info">{{ workflowsDetailsData.repositoryUrl }}</div>
          <div class="process-detail-info">
            <!-- <img src="@/assets/icons/white-link.svg" class="mr-[8px] h-[16px] dark:hidden" />
            <img src="@/assets/icons/dark-link.svg" class="mr-[8px] h-[16px] hidden dark:inline-block" /> -->
            <svg-icon name="white-link" size="16" class="mr-[8px]" />
            <span class="align-middle">main</span>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="process-detail-item">
          <div class="process-detail-title">{{ title + ' Result' }}</div>
          <div class="process-detail-info">
            <div v-if="props.checkType != ''">{{ props.checkType }}</div>
            <div v-else>{{ $t(`workFlows.${WorkflowStatusEnum[workflowsDetailsData.status]}`) }}</div>
          </div>
          <div v-if="workflowsDetailsData.status == 2 && (type == '2' || type=='1') && deployType == '3'" class="process-detail-info">
            Insufficient cycle, <a href="javascript:;" @click="openBuyCycles">buy cycles</a>
          </div>
          <div class="process-detail-info error-info" v-show="title === 'Check' && workflowsDetailsData.status != 1">
            {{ workflowsDetailsData.errorNumber + ' issues found' }}
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="process-detail-item">
          <div class="process-detail-title">{{ $t('workFlows.time') }}</div>
          <div class="process-detail-info">{{ fromNowexecutionTime(workflowsDetailsData.startTime, "noThing") }}
          </div>
          <div class="process-detail-info">
            {{ inRunning ? '-' : formatDurationTime(workflowsDetailsData.duration, "elapsedTime") }}
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
  <BuyCycles v-if="showBuyCycle" :visible="showBuyCycle" @handleCancel="showBuyCycle = false"></BuyCycles>
</template>
<script lang='ts' setup>
import { fromNowexecutionTime, formatDurationTime } from "@/utils/time/dateUtils.js";
import { WorkflowStatusEnum } from "@/enums/statusEnum";
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BuyCycles from "@/views/projects/projectsListDetails/components/BuyCycles.vue"

const route = useRoute()
// icp
const type = route.params.projectType
const deployType = route.params.type
const showBuyCycle = ref(false)

interface WorkflowsDetailsData {
  repositoryUrl: string,
  status: number,
  startTime: string,
  errorNumber: number,
  duration: string,
}

const props = defineProps<{
  checkType: string
  title: String,
  inRunning: Boolean,
  workflowsDetailsData: WorkflowsDetailsData,
}>()

// const props = defineProps({
//   title: String,
//   inRunning: Boolean,
//   workflowsDetailsData: { type: Object }
// });

const openBuyCycles = ()=>{
  showBuyCycle.value = true
}

</script>
<style lang='less' scoped>
@backGroundCOlor: #1D1C1A;

html[data-theme='dark'] {
  .process-detail-item::after {
    border: 1px solid #302D2D;
  }

  .process-detail-info {
    color: #FFFFFF;
  }

  .error-info {
    color: #FD0505;
  }
}

.workFlows {
  font-size: 14px;
  padding: 32px;
}

.process-detail-item {
  height: 100%;
  position: relative;
  padding-left: 32px;

  &::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0;
    width: 1px;
    height: calc(100% + 1px);
    border: 1px solid #F4F4F4;
  }
}

.process-detail-title {
  font-weight: 600;
  margin-bottom: 16px;
}

.process-detail-info {
  color: #151210;
  margin-bottom: 16px;
  word-break: break-all;
  padding-right: 16px;
}

.process-detail-info:last-child {
  margin-bottom: 0px;
}

.error-info {
  color: #FD0505;
}
</style>