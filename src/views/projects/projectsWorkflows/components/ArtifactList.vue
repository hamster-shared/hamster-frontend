<template>
  <div
    class="contracyList p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] mt-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">Artifact</span>
    </div>
    <Package pageType="workflow" :packageListData="artifactListData" :deployType="deployType" :nodeType="params.projectType"/>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "vue";
import { useRouter,useRoute } from "vue-router";
import Package from "../../projectsListDetails/components/Package.vue";
const { params } = useRoute()
const router = useRouter();

const state = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
})

const props = defineProps({
  artifactListData: Array,
  deployType: String,
})

const { artifactListData,deployType } = toRefs(props)

</script>