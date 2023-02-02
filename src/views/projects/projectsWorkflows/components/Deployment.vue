<template>
  <div
    class="contracyList p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] mt-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">Deployment</span>
      <a-button v-if="showBth">Ops</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
  showBth: {
    type: Boolean,
    default: true,
  },
})

</script>
<style lang="less" scoped>
.ant-btn {
  width: 131px;
  height: 43px;
}
</style>