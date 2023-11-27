<template>
  <a-modal :footer="null" width="760px" centered="true" v-model:visible="modalVisible">
    <div class="text-[24px] text-[#151210] font-bold">Please select the Agent role style</div>
    <template #closeIcon>
      <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
    </template>
    <div class="my-[50px]">
      <a-radio-group v-model:value="roleValue">
        <a-radio-button v-for="(item,key) in roleList" :key="key" :value="item.value">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </div>
    <div class="text-center">
      <a-button type="primary" class="w-[240px] !h-[43px] mr-[24px]" ghost @click="hideVisible">Skip</a-button>
      <a-button type="primary" class="w-[240px] !h-[43px]" @click="handleOk">Confirm</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue';

const props = defineProps({
  modalVisible: Boolean,
});
const { modalVisible } = toRefs(props);
const emits = defineEmits(['hiddenModal']);

const roleValue = ref('');
const roleList = ref([{ label:'御姐之魅', value:'御姐之魅'},{ label:'高贵公主', value:'高贵公主'},{ label:'杠精之道', value:'杠精之道'},{ label:'温柔甜心', value:'温柔甜心'},{ label:'王者气息', value:'王者气息'},{ label:'机智灵狐', value:'机智灵狐'},{ label:'可爱萌物', value:'可爱萌物'},{ label:'冰山美人', value:'冰山美人'},{ label:'热情狂烈', value:'热情狂烈'}]);

const handleOk = async () => {
  
  hideVisible();
}
const hideVisible = () => {
  emits('hiddenModal');
}
</script>
<style scoped lang="less">
:deep(.ant-radio-group){
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
:deep(.ant-radio-group .ant-radio-button-wrapper){
  width: 218px;
  height: 62px;
  line-height: 60px;
  background: #FFFFFF;
  border-radius: 31px;
  border: 2px solid #DCDCDC;
  color: #696D71;
  text-align: center;
}
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)){
  border-color: #E2B578;
  color: #000000;
}
:deep(.ant-radio-button-wrapper:not(:first-child):before){
  display: none;
}
</style>