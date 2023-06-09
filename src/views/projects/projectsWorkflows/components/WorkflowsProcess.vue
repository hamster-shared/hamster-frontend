<template>
  <div class="process rounded-[12px] mt-[24px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211]">
    <div class="process-content">
      <div class="flex justify-between">
        <span class="process-content-title">{{ $t('workFlows.executionProcess') }}</span>
        <span class="text-[14px] open-link-css cursor-pointer" @click="checkAllLogs">
          {{ $t('workFlows.viewFullLogs') }}
        </span>
      </div>
      <div class="process-scroll-box wrapper" ref="wrapper">
        <div class="process-scroll content mb-[32px]">
          <div class="inline-block align-top execution_process_item" v-for="item in processData" :key="item.name">
            <div class="inline-block">
              <div class="">
                <div
                  class="inline-block border border-solid border-[#EFEFEF] dark:border-[#434343] p-[11px] rounded-[5px] flex justify-between"
                  :class="(item.status === 0 || item.status === 99) ? '' : 'cursorP'" @click="checkProcess(item, $event)">
                  <div>
                    <img src="@/assets/icons/start.svg" class="mr-[24px] h-[24px]" v-if="item.status === 99" />
                    <img :src="getImageUrl(item.status, 'stage')" class="w-[24px] h-[24px] mr-[24px] align-middle"
                      v-else-if="item.status !== 1" />
                    <img src="@/assets/images/run.gif" class="w-[24px]  h-[24px] mr-[24px] align-middle" v-else />
                    <div class="text-[16px] font-semibold mr-[24px] inline-block">{{ item.name }}</div>
                  </div>

                  <div class="flex align-middle">
                    <div class="text-[16px] text-[#7B7D7B]" v-if="item.status !== 0">
                      {{ formatDurationTime(item.duration, "noThing") }}
                    </div>
                  </div>
                </div>
                <!-- <img src="@/assets/icons/arrow-white.svg"
                class="w-[28px] space-mark ml-[20px] mr-[20px]  hidden dark:inline-block" />
              <img src="@/assets/icons/arrow-block.svg" class="w-[28px] space-mark ml-[20px] mr-[20px] dark:hidden" /> -->
              </div>
              <div v-if="item.stage" class="stage-process">
                <div v-for="val in item.stage.steps" @click="checkProcessStep(item.name, val, $event)"
                  :class="val.status === 0 ? '' : 'cursorP'"
                  class="flex inline-block border border-solid border-[#EFEFEF] dark:border-[#434343] p-[11px] rounded-[5px] item-stage">
                  <div>
                    <img :src="getImageUrl(val.status, 'step')"
                      class="w-[24px]  h-[24px] mr-[24px] align-middle inline-block" v-if="val.status !== 1" />
                    <img src="@/assets/images/run.gif" class="w-[24px] h-[24px] mr-[24px] align-middle inline-block"
                      v-else />
                  </div>

                  <div class="flex justify-between align-middle item-stage-time">
                    <div class="text-[16px] font-semibold mr-[24px]">{{ val.name }}</div>
                    <div class="text-[16px] text-[#7B7D7B]" v-if="val.status !== 0">
                      {{ formatDurationTime(val.duration, "noThing") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img src="@/assets/icons/arrow-white.svg"
              class="w-[28px] space-mark ml-[20px] mr-[20px] mt-[10px] align-top hidden dark:inline-block" />
            <img src="@/assets/icons/arrow-block.svg"
              class="w-[28px] space-mark ml-[20px] mt-[10px] align-top mr-[20px] dark:hidden" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Processmodal ref="processModalRef" :stagesData="stagesData"></Processmodal>
</template>
<script lang='ts' setup>
import { ref, onMounted, toRefs, watch, nextTick, reactive, onUnmounted } from "vue";
import BScroll from "@better-scroll/core";
import Scrollbar from "@better-scroll/scroll-bar";
import Processmodal from "./ProcessModal.vue";
import { formatDurationTime } from "@/utils/time/dateUtils.js";
import { apiGetDetailStageLogs, apiGetDetailStepLogs } from "@/apis/workFlows";
import { WorkflowStatusEnum, WorkflowStagSvgEnum, WorkflowStepSvgEnum } from "@/enums/statusEnum";
BScroll.use(Scrollbar);

interface Process {
  name: string,
  status: number,
  duration: string,
  startTime: string,
}

interface ProcessData extends Process {
  stage: {
    steps: Process[],
  },
}

const props = defineProps<{
  workflowsId: string,
  workflowDetailId: string,
  processData: ProcessData[]
}>()


const queryParams = reactive({
  id: '',
  stagename: '',
  workflowsId: '',
  workflowDetailId: '',
  start: 0,
})
const stagesData = reactive({
  title: "",
  content: [],
});

const stagesTimer = ref();
const wrapper = ref();
const processModalRef = ref();
const bscroll = ref();

const { processData, workflowsId, workflowDetailId } = toRefs(props);
Object.assign(queryParams, { workflowsId: workflowsId, workflowDetailId: workflowDetailId });

// console.log(processData, 'processData')
const checkProcess = (item: any, e: Event) => {
  if (item.status === 0 || item.status === 99) {
    e.stopPropagation();
  } else {
    stagesData.title = item.name;
    stagesData.content = [];
    queryParams.stagename = item.name;
    processModalRef.value.showVisible();
    getStageLogsData(item);
  }
}

const getStageLogsData = async (val: any, start = 0) => {
  queryParams.start = start;
  const { data } = await apiGetDetailStageLogs(queryParams);

  let t = data?.content?.split("\r");
  if (data.content) {
    t.forEach((item: any) => {
      stagesData.content.push(item)
    })
  }

  if (!data.end && processModalRef.value.visible) {
    stagesTimer.value = setTimeout(() => {
      getStageLogsData(val, data.lastLine);
    }, 3000);
  } else {
    clearTimeout(stagesTimer.value);
  }
}


const checkProcessStep = async (stagename: string, val: any, e: Event) => {
  if (val.status === 0) {
    e.stopPropagation();
  } else {
    const queryJson = {
      name: queryParams.workflowsId,
      id: queryParams.workflowDetailId,
      stagename: stagename,
      stepname: val.name,
    }
    try {
      const { data } = await apiGetDetailStepLogs(queryJson);
      let t = data?.content?.split("\r");
      if (data.content) {
        t.forEach((item: any) => {
          let h = item ? item.split("\n") : '';
          h.forEach((val: any) => {
            stagesData.content.push(val)
          })
        })
      }
      processModalRef.value.showVisible();
    } catch (err: any) {
      console.log(err, 'err')
    }
  }
}

const getImageUrl = (status: any, type: string,) => {
  let iconName = ''
  if (type === 'stage') {
    iconName = `${WorkflowStagSvgEnum[status]}`;
  } else {
    iconName = `${WorkflowStepSvgEnum[status]}`;
  }
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
};

watch(
  () => props.processData,
  (oldV, newV) => {
    nextTick(() => {
      bscroll.value && bscroll.value.refresh();
    })
  }, { deep: true, immediate: true }
);
const timer = ref();
onMounted(() => {
  initScroll()
  timer.value = setTimeout(() => {
    nextTick(() => { 
      bscroll.value && bscroll.value.refresh();
    })
    clearTimeout(timer.value);
  }, 1000)
})

onUnmounted(() => {
  clearTimeout(stagesTimer.value);
})

const initScroll = () => {
  bscroll.value = new BScroll(wrapper.value, {
    startX: 0,
    scrollX: true,
    scrollY: false,
    probeType: 1,
    scrollbar: {
      fade: false,
      interactive: true,
      scrollbarTrackClickable: true,
    }
  });
};

const checkAllLogs = () => {
  window.open(`/projects/${queryParams.workflowsId}/workflows/${queryParams.workflowDetailId}/allLogs`)
}

</script>
<style lang='less' scoped>
@backGroundCOlor: #1D1C1A;

html[data-theme='dark'] {
  .item-stage {
    &::before {
      border-color: #434343;
    }

    &::after {
      border-color: #434343;
    }
  }
}

.process {
  width: 100%;
  font-size: 14px;
  margin-bottom: 24px;

  .cursorP {
    cursor: pointer;
  }

  .process-scroll-box {
    white-space: nowrap;
    overflow: hidden;

    .process-scroll {
      display: inline-block;

    }

    :deep(.bscroll-horizontal-scrollbar) {
      z-index: 4 !important;
    }
  }

  .process-content {
    padding: 32px;
    border-radius: 12px;
    margin-bottom: 24px;

    .process-content-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 32px;
    }

    .process-content-title:first {
      margin-bottom: 24px;
    }
  }

  .process-content:last-child {
    margin-bottom: 0px;
  }

  .execution_process_item:last-child {
    .space-mark {
      display: none;
    }
  }

  .item-stage {
    // width: calc(100% - 68px);
    position: relative;
    margin-top: 12px;

    &::before {
      content: '';
      width: 1px;
      height: 12px;
      position: absolute;
      border: 1px solid #EFEFEF;
      top: -12px;
      left: 20px;
    }

    &::after {
      content: '';
      width: 1px;
      height: 12px;
      position: absolute;
      border: 1px solid #EFEFEF;
      top: -12px;
      right: 20px;
    }
  }

  .item-stage-time {
    width: calc(100% - 52px);
    width: 100%;
  }

  .execution_process_item:last-child {

    .item-stage {
      width: 100%;
    }
  }
}

// .stage-process {
//   width: calc(100% - 52px);
// }
</style>