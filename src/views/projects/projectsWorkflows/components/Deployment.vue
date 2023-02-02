<template>
  <div class="p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] mt-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">Deployment</span>
      <a-button v-if="showBth">Ops</a-button>
    </div>
    <div class="flex">
      <div class="w-2/5 border border-solid border-[#EBEBEB] rounded-[12px]">
        <iframe src="http://wwww.baidu.com" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>
      </div>
      <div class="ml-[64px] w-3/5">
        <div class="title-text">Domains</div>
        <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px] flex items-center">
          {{ packageInfo.domain }}
          <img src="@/assets/icons/link-white.svg" class="h-[18px] ml-1 dark:hidden" />
          <img src="@/assets/icons/link-dark.svg" class="h-[18px] ml-1 hidden dark:inline-block" />
        </div>
        <div class="flex w-full">
          <div class="w-1/2">
            <div class="title-text title-m">Status</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">
              <label v-if="workflowsDetailsData.status === 3">Ready</label>
            </div>
            <div class="title-text title-m">Package</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">{{ packageInfo.name }}</div>
            <div class="title-text title-m">Branch</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px] flex items-center">
              <img src="@/assets/icons/master-white.svg" class="h-[20px] mr-1 dark:hidden" />
              <img src="@/assets/icons/master-dark.svg" class="h-[20px] mr-1 hidden dark:inline-block" />
              {{ packageInfo.branch }}
            </div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">Update README.md</div>
          </div>
          <div class="w-1/2">
            <div class="title-text title-m">Created</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">{{
              fromNowexecutionTime(workflowsDetailsData.startTime, "noThing")
            }} by {{
  workflowsDetailsData.triggerUser
}}</div>
            <div class="title-text title-m">Version</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">{{ packageInfo.version }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";

const props = defineProps({
  packageInfo: Object,
  workflowsDetailsData: { type: Object }
});

const props = defineProps({
  showBth: {
    type: Boolean,
    default: true,
  },
})

</script>
<style lang="less" scoped>
.title-text{
  font-weight: bold;
  font-size: 16px;
}
.title-m{
  margin-top: 24px;
}
</style>
<style lang="less" scoped>
.ant-btn {
  width: 131px;
  height: 43px;
}
</style>