<template>
  <div :class="{ 'hidden': JSON.stringify(props.packageInfo) === '{}' }"
    class="p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] mt-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">Deployment</span>
      <a-button v-if="showBth" @click="toDetail">Ops</a-button>
    </div>
    <div class="flex">
      <div class="w-2/5 border border-solid border-[#EBEBEB] rounded-[12px]">
        <div class="w-full h-full overflow-hidden">
          <!-- <iframe :src="packageInfo.domain" frameborder="0" width="105%" height="100%" scrolling="auto"></iframe> -->
          <!-- <iframe :src="packageInfo.image" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe> -->
          <img :src="packageInfo.image" class="h-[325px] w-[100%] object-cover rounded-xl" />
        </div>
      </div>

      <div class="ml-[64px] w-3/5">
        <div class="title-text">Domains</div>
        <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px] flex">
          <div class="text-ellipsis mr-[12px] cursor-pointer text-[#E2B578]" @click="openDomain">
            {{ packageInfo.domain }}
          </div>
          <div class="w-[20px] flex items-center">
            <img src="@/assets/icons/link-white.svg" class="h-[18px] cursor-pointer dark:hidden" @click="copyDomain" />
            <img src="@/assets/icons/link-dark.svg" class="h-[18px] cursor-pointer hidden dark:inline-block"
              @click="copyDomain" />
          </div>
        </div>
        <div class="flex w-full">
          <div class="w-1/2">
            <div class="title-text title-m">Status</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">
              {{ $t(`workFlows.${WorkflowStatusEnum[workflowsDetailsData.status]}`) }}
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
            }} by {{ workflowsDetailsData.triggerUser }}
            </div>
            <div class="title-text title-m">Version</div>
            <div class="text-[#73706E] dark:text-[#E0DBD2] mt-[8px]">{{ '#' + packageInfo.version }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { WorkflowStatusEnum } from "@/enums/statusEnum";
const router = useRouter();

interface PackageInfo {
  image: string,
  domain: string,
  name: string,
  branch: string,
  version: string,
}

interface WorkflowsDetailsData {
  status: number,
  startTime: string,
  triggerUser: string,
  workflowsId: string,
  workflowDetailId: string,
}

const props = defineProps<{
  packageInfo: PackageInfo,
  workflowsDetailsData: WorkflowsDetailsData,
  showBth: {
    type: Boolean,
    default: true,
  },
}>()

// const props = defineProps({
//   packageInfo: Object,
//   workflowsDetailsData: { type: Object },
//   showBth: {
//     type: Boolean,
//     default: true,
//   },
// });
// const enum StatusEnum {
//   "nonExecution",
//   "running",
//   "failed",
//   "ready",
//   "stop",
// }

const toDetail = () => {
  router.push(`/projects/${props.workflowsDetailsData?.workflowsId}/frontend-details/${props.workflowsDetailsData?.workflowDetailId}/${props.workflowsDetailsData?.packageId}`)
}

const openDomain = () => {
  window.open(props.packageInfo?.domain)
}

const copyDomain = async () => {
  let OrderNumber = props.packageInfo?.domain;
  // 创建一个input 元素
  // createElement() 方法通过指定名称创建一个元素
  let newInput = document.createElement("input");
  // 讲存储的数据赋值给input的value值
  newInput.value = OrderNumber;
  // appendChild() 方法向节点添加最后一个子节点。
  document.body.appendChild(newInput);
  // 选中input元素中的文本
  // select() 方法用于选择该元素中的文本。
  newInput.select();
  // 执行浏览器复制命令
  try {
    //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
    await document.execCommand('Copy') // 执行浏览器复制命令
    // 清空输入框
    newInput.remove();
    message.success("copy success");
  } catch {
    message.error("copy failed");
  }
}

</script>
<style lang="less" scoped>
.title-text {
  font-weight: bold;
  font-size: 16px;
}

.title-m {
  margin-top: 24px;
}
</style>
<style lang="less" scoped>
.ant-btn {
  width: 131px;
  height: 43px;
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*文字溢出的部分隐藏并用省略号代替*/
  white-space: nowrap;
  /*文本不自动换行*/
  overflow: hidden;
}
</style>