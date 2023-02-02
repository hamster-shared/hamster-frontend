<template>
  <div @click="goDetail(showItem.id)"
    class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px]">
    <img :src="showItem.image" class="w-full rounded-tl-[12px] rounded-tr-[12px]" />
    <div
      class="py-[16px] px-[24px] border-b-0 border-l-0 border-r-0 border-solid border-t-[1px] border-[#EBEBEB] dark:border-[#434343]">
      <div class="flex items-center justify-between mt-4">
        <div class="text-[16px] font-bold text-ellipsis">
          <img :src="showItem.logo" class="h-[24px] w-[24px]" />
          {{ showItem.name }}
        </div>
        <div class="flex items-center">
          <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
          <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
          {{ showItem.lastVersion }}
        </div>
      </div>
      <div class="text-[#73706E] dark:text-[#E0DBD2]">{{ showItem.description }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  showItem: Object,
  templateType: String,
});
const { showItem, templateType } = toRefs(props);
const emit = defineEmits(["setCreateProjectValue"]);

const goDetail = async (id: string) => {
  if (templateType?.value === 'create') {
    emit("setCreateProjectValue", "/projects/templates/" + id + "/details");
  }
}
</script>