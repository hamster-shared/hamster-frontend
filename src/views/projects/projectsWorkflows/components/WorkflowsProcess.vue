<template>
  <div class="process rounded-[12px] mt-[24px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211]">
    <div class="process-content">
      <div class="flex justify-between">
        <span class="process-content-title">{{ $t('workFlows.executionProcess') }}</span>
        <span class="text-[14px] text-[#E2B578] cursor-pointer" @click="checkAllLogs">
          {{ $t('workFlows.viewFullLogs') }}
        </span>
      </div>
      <div class="process-scroll-box wrapper" ref="wrapper">
        <div class="process-scroll content">
          <div class="inline-block execution_process_item" v-for="item in processData" :key="item.name">
            <div class="inline-block border border-solid border-[#EFEFEF] dark:border-[#434343] p-[11px] rounded-[5px]"
              :class="(item.status === 0 || item.status === 99) ? '' : 'cursorP'" @click="checkProcess(item, $event)">
              <img src="@/assets/icons/start.svg" class="mr-[24px]" v-if="item.status === 99" />
              <img :src="getImageUrl(item.status)" class="w-[28px] mr-[24px] align-middle"
                v-else-if="item.status !== 1" />
              <img src="@/assets/images/run.gif" class="w-[28px] mr-[24px] align-middle" v-else />
              <span class="align-middle">
                <span class="text-[16px] font-semibold mr-[24px]">{{ item.name }}</span>
                <span class="text-[16px] text-[#7B7D7B]" v-if="item.status !== 0">
                  {{ formatDurationTime(item.duration, "noThing") }}
                </span>
              </span>
            </div>
            <img src="@/assets/icons/arrow-white.svg"
              class="w-[28px] space-mark ml-[20px] mr-[20px]  hidden dark:inline-block" />
            <img src="@/assets/icons/arrow-block.svg" class="w-[28px] space-mark ml-[20px] mr-[20px] dark:hidden" />
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
import { apiGetDetailStageLogs } from "@/apis/workFlows";
BScroll.use(Scrollbar);

const props = defineProps({
  workflowsId: String,
  workflowDetailId: String,
  processData: {
    type: Array,
    default: () => {
      return []
    }
  },
});

const enum StatusEnum {
  "nonExecution",
  "running",
  "failed",
  "success",
  "stop",
}

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

const { processData, workflowsId, workflowDetailId } = toRefs(props);
Object.assign(queryParams, { workflowsId: workflowsId, workflowDetailId: workflowDetailId });


const checkProcess = (item: any, e: Event) => {
  if (item.status === 0 || item.status === 99) {
    e.stopPropagation();
  } else {
    stagesData.title = item.name;
    stagesData.content = []
    queryParams.stagename = item.name;
    processModalRef.value.showVisible();
    getStageLogsData(item);
  }
}

const getStageLogsData = async (val: any, start = 0) => {
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

const getImageUrl = (status: any) => {
  let iconName = `${StatusEnum[status]}`;
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
};

watch(
  () => props.processData,
  (oldV, newV) => {
    nextTick(() => {
      initScroll()
    })
  }, { deep: true }
);

onMounted(() => {
  initScroll()
})

onUnmounted(() => {
  clearTimeout(stagesTimer.value);
})

const initScroll = () => {
  let scroll = new BScroll(wrapper.value, {
    startX: 0,
    scrollX: true,
    scrollY: false,
    probeType: 1,
    scrollbar: {
      fade: false,
      interactive: true,
    },
  });
};

const checkAllLogs = () => {
  window.open(`/projects/${queryParams.workflowsId}/workflows/${queryParams.workflowDetailId}/allLogs`)
}

</script>
<style lang='less' scoped>
@backGroundCOlor: #1D1C1A;

.process {
  width: 100%;
  font-size: 14px;

  .process-scroll-box {
    white-space: nowrap;
    overflow: hidden;

    .process-scroll {
      display: inline-block;
      margin-bottom: 24px;

      .cursorP {
        cursor: pointer;
      }
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
}
</style>