<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-2xl font-bold">AI Analysis Report</span>
    <div class="mt-4 text-lg whitespace-pre-wrap">{{ reportFile }}</div>
    <hr class="my-2 border-[#73706E]"/>
    <span class="text-[#73706E]">Support by {{ checkTool }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  checkTool:String,
  reportFile:String
})
</script>