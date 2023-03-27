<template v-if="stages">
  <div class="flex">
    <div v-for="(item, index) in stages" :key="index" class="flex">
      <div>
        <div v-if="item?.status == 0" class="inline-block">
          <img :src="nodataSVG" class="w-[16px] h-[16px]" />
        </div>
        <div v-if="item?.status == 1" class="inline-block">
          <img src="@/assets/images/run.gif" class="w-[17px] h-[17px]" />
        </div>
        <div v-if="item?.status == 3" class="inline-block">
          <img :src="successSVG" class="w-[16px] h-[16px]" />
        </div>
        <div v-if="item?.status == 2" class="inline-block">
          <img :src="failedSVG" class="w-[16px] h-[16px]" />
        </div>
        <div v-if="item?.status == 4" class="inline-block">
          <img :src="stopSVG" class="w-[16px] h-[16px]" />
        </div>
      </div>
      <div v-if="index !== stages.length - 1">
        <img :src="greyArrowSVG" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import successSVG from "@/assets/icons/success.svg";
import failedSVG from "@/assets/icons/fail.svg";
import stopSVG from "@/assets/icons/stop.svg";
// import nodataSVG from "@/assets/icons/pipeline-no-data.svg";
import nodataSVG from "@/assets/icons/nonExecution.svg";
import greyArrowSVG from "@/assets/icons/grey-arrow.svg";

const props = defineProps<{
  stages: [];
}>();

const { stages } = toRefs(props);

onMounted(() => {
  if (stages.value.length > 8) {
    stages.value = [...stages.value.slice(-8, -1), ...stages.value.slice(-1)];
  }
});
</script>
