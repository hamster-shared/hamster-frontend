<template>
  <div class="workFlows dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px]">
    <a-row>
      <a-col :span="8">
        <div class="">
          <div class="process-detail-title">{{ $t('workFlows.codeRepository') }}</div>
          <div class="process-detail-info">{{ workflowsDetailsData.repositoryUrl }}</div>
          <div class="process-detail-info">
            <img src="@/assets/icons/white-link.svg" class="mr-[8px] h-[16px] dark:hidden" />
            <img src="@/assets/icons/dark-link.svg" class="mr-[8px] h-[16px] hidden dark:inline-block" />
            <span class="align-middle">main</span>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="process-detail-item">
          <div class="process-detail-title">{{ title + ' Result' }}</div>
          <div class="process-detail-info">{{ $t(`workFlows.${StatusEnum[workflowsDetailsData.status] }`) }}</div>
          <div class="process-detail-info error-info" v-show="title === 'Check'">
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
</template>duration
<script lang='ts' setup>
import { fromNowexecutionTime, formatDurationTime } from "@/utils/time/dateUtils.js";
const props = defineProps({
  title: String,
  inRunning: Boolean,
  workflowsDetailsData: { type: Object }
});

const enum StatusEnum {
  "nonExecution",
  "running",
  "failed",
  "passed",
  "stop",
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