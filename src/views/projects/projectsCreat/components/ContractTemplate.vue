<template>
  <div @click="goDetail(showItem.id)" class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] py-[32px] px-[24px]">
    <img :src="showItem.logo" class="h-[40px] w-[40px]" />
    <div class="text-[16px] mt-4 font-bold text-ellipsis">{{ showItem.name }}</div>
    <div class="text-[#151210] dark:text-[#BBBAB9]">{{ showItem.description }}</div>
    <div class="flex mt-4">
      <div class="flex items-center">
        <img
          src="@/assets/icons/version-white.svg"
          class="h-[20px] dark:hidden"
        />
        <img
          src="@/assets/icons/version-dark.svg"
          class="h-[20px] hidden dark:inline-block"
        />
        {{ showItem.lastVersion }}</div>
      <div class="flex items-center ml-4" v-if="showItem.audited === true">
        <img
          src="@/assets/icons/audi-white.svg"
          class="h-[20px] dark:hidden"
        />
        <img
          src="@/assets/icons/audi-dark.svg"
          class="h-[20px] hidden dark:inline-block"
        />
        Audited</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  showItem: Object,
});
const { showItem } = toRefs(props);
const emit = defineEmits(["setCreateProjectValue"]);

const goDetail = async (id: string) => {

  emit("setCreateProjectValue", "/projects/templates/" + id + "/details");
}
</script>