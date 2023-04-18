<template>
  <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] mt-[32px] p-[32px]">
    <div class="flex">
      <img :src="frontendTemplateDetail.image"
        class="w-2/4 rounded-[12px] mr-[64px] mb-[64px] border border-solid dark:border-[#434343] border-[#EBEBEB]" />
      <div>
        <div class="text-[24px] font-bold">{{ frontendTemplateDetail.name }}</div>        
        <div class="mt-[8px] mb-[24px] dark:text-[#E0DBD2] text-[#73706E]">{{ frontendTemplateDetail.description }}
        </div>
        <a-button @click="viewDemo">View Demo</a-button>
      </div>
    </div>
    <div>
      <MdEditor :text="text" />
    </div>
  </div>

</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
import MdEditor from "@/components/mdEditor.vue";
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  showUrl: {
    type: String,
    default: '',
  }
});
const frontendTemplateDetail = JSON.parse(localStorage.getItem('frontendTemplateDetail'));
// const { text } = toRefs(props)
// const editorValue = ref('');
const viewDemo = () => {
  window.open(props.showUrl)
}
</script>
<style scoped lang="less">
.ant-btn {
  height: 43px;
}
</style>