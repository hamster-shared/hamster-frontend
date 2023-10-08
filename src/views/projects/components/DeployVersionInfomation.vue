<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
    <div class="text-[24px] font-bold inline-block">hamster
      <div
        class="inline-block ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
        <label>EVM</label>
      </div>
    </div>
    <div class="mt-[32px] mb-[20px]">Contract Version</div>
    <a-space>
      <a-select ref="select" v-model:value="value1" style="width: 500px"
        :options="versionList.map(item => ({ value: item }))">
      </a-select>
    </a-space>
    <div class="text-[16px] font-bold mt-[30px] mb-[20px]">Source Info</div>
    <div class="mb-[10px]">https://github.com/h</div>
    <div>
      3f433f6｜commit on No
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
const value1 = ref<string>('1');
const versionList = ref(["1", "2", "3"]);
const changeChecked = (val: any) => {
  console.log(val, 'switch')
}

</script>

<style lang="less" scoped></style>