<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
    <div class="text-[24px] font-bold inline-block">{{name}}
      <div
        class="inline-block ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
        <label>EVM</label>
      </div>
    </div>
    <div class="mt-[32px] mb-[20px]">Contract Version</div>
    <a-select ref="select" v-model:value="selectedVersion" style="width: 50%"
      :options="versionList.map(item => ({ value: item }))">
    </a-select>
    <div class="text-[16px] font-bold mt-[30px] mb-[20px]">Source Info</div>
    <div class="text-[14px]">
      <img src="@/assets/images/link.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
      <img src="@/assets/images/link-white.png" class="h-[17px] mr-[10px] dark:hidden" />
      https://github.com/hamster-shared/hamster.git/main
    </div>
    <div class="mt-[10px] text-[14px]">
      <img src="@/assets/images/info.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
      <img src="@/assets/images/info-white.png" class="h-[17px] mr-[10px] dark:hidden" />
      3f433f6 | commit on Nov 3, 2022 | upgrade go version
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
const selectedVersion = ref<string>('1');
const props = defineProps({
  versionList:{
    type:Array,
    default:()=>[]
  },
  name:{
    type:String,
    defalut:''
  }
})
const { versionList, name } = toRefs(props)
const changeChecked = (val: any) => {
  console.log(val, 'switch')
}
defineExpose({
  selectedVersion,
})

</script>

<style lang="less" scoped></style>