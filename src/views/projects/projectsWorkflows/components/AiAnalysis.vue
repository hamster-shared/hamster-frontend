<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-2xl font-bold">AI Analysis Report</span>
    <span class="block mt-4 text-lg">I am AI's Answer</span>
    <hr class="my-2"/>
    <span>Support by OpenAI</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  aiQuestion:String
})

</script>