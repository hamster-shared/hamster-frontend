<template>
  <a-modal v-model:visible="props.visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Configure dfx.json</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[10px] text-[14px] text-[#73706E]">
        When deploying on the Internet Computer for the first time, you need to configure the dfx.json file to guide Hamster to build and deploy the project. To modify it later, you can click the "Settings" button in the project details page
      </div>
      <div class="mt-[20px] flex">
        <div class="w-1/2 pr-[18px]">
          <div class="text-[18px] text-[#151210] font-bold mb-[20px]">Canister info</div>
          <a-form class="modal-form" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
            <a-form-item name="name" label="Canister Name">
               <a-input @change="changeName" class="modal-input" v-model:value="formData.name" placeholder="Please enter Canister Name" allow-clear autocomplete="off" />
            </a-form-item>
            <a-form-item name="type" label="Type">
              <a-select dropdownClassName="modal-select-dropdown" class="modal-input" v-model:value="formData.type" placeholder="Please select type" @change="changeType">
                <a-select-option value="Assets">Assets</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="source" label="Source">
               <a-input @change="changeSource" class="modal-input" v-model:value="formData.source" placeholder="Please enter Source" allow-clear autocomplete="off" />
            </a-form-item>
          </a-form>
        </div>
        <div class="h-[310px] w-1/2 pl-[18px]">
          
          <div class="h-full bg-[#3B3B3B] rounded-[8px]">
            <div class="bg-[#191919] px-[20px] py-[7px] text-[#FFFFFF] text-[16px] rounded-tl-[8px] rounded-tr-[8px]">dfx.json Preview</div>
            <pre class="text-[#E2B578] pt-[10px] pl-[10px]">{{dfxContent}}</pre>
          </div>
        </div>
      </div>
      <div class="text-center mt-[32px]">
        <a-button class="!w-[240px] !h-[43px]" @click="handleDone">Done</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { generateDFX } from '@/utils/generateDFX'
  
const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  }
});
const emit = defineEmits(["CancelDFX"])
const formRef = ref();
const formData = reactive({
  name: '',
  type: undefined,
  source: '',
});
const dfxContent = ref({});

const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter Canister Name')],
    type: [requiredRule('Please enter Type')],
    source: [requiredRule('Please enter Source')],
  };
});
// 输入名称
const changeName = (e:any) => {
  console.log('输入名称',e.target.value)
  dfxContent.value = generateDFX(formData.name,formData.type,formData.source)
}
// 选择类型
const changeType = () => {
  dfxContent.value = generateDFX(formData.name,formData.type,formData.source)
}
// 输入源路径
const changeSource = () => {
  dfxContent.value = generateDFX(formData.name,formData.type,formData.source)
}
const handleDone = async () => {
  await formRef.value.validate()
}
const handleCancel = ()=>{
  emit('CancelDFX')
}
</script>
<style scoped lang="less">
:deep(.ant-form-item-label > label){
  font-size: 14px;
  font-weight: 400;
}
</style>