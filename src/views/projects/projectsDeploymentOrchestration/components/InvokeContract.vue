<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Invoke Contract Method</div>
    <div class="mb-[20px] text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automatically call contract methods post-deployment, including its
      own init method or other contracts' methods
    </div>
    <div v-if="selectedId && showMethod" class="border border-solid border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816] rounded-[12px] p-[20px]">
      <div class="flex justify-between mb-[20px]">
        <div class="text-[21px] font-bold">Contract Method</div>
        <div>
          <a-popover trigger="hover" placement="left">
            <template #content>
              <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="deleteBtn">Delete</div>
              <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="addCustomParamsBtn">Add Custom Params
              </div>
            </template>
            <img class="w-[4px] cursor-pointer" src="@/assets/images/diandian.png" />
          </a-popover>
        </div>
      </div>
      <a-form ref="formRef" :rules="formRules" :model="formData" layout="vertical">
        <div class="grid grid-cols-2 gap-4">
          <a-form-item name="methodName" label="Method Name">
            <a-select v-model:value="formData.methodName"  
              placeholder="Contract Address" :options="contractOrchestration.map(item => ({ value: item.id, label:item.name }))">
            </a-select>
          </a-form-item>
          <a-form-item class="form-noLabel" name="methodType" :rules="[{ required: true }]">
            <a-select v-model:value="formData.methodType" @change="changeParams"
              placeholder="Contract method Type" :options="functionData.map(item => ({ value: item }))">
            </a-select>
          </a-form-item>  
        </div>
        <div v-if="formData.methodType">
          <div class="grid grid-cols-2 gap-4">
            <a-form-item :name="formData.param1" label="param1" :rules="[{ required: true }]" >
              <a-select v-model:value="formData.param1" 
                placeholder="Select project contract" :options="paramList">
              </a-select>
            </a-form-item>
            <a-form-item class="form-noLabel" :name="formData.address" :rules="[{ required: true }]">
              <label class="text-[#73706E] dark:text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
              <a-select v-if="formData.param1 == 1" v-model:value="formData.address"  
                placeholder="Contract Address" :options="contractOrchestration.map(item => ({ value: item.id, label:item.name }))">
              </a-select>
              <a-input v-else v-model:value="formData.address" placeholder="Please input address" allowClear />
            </a-form-item>  
          </div>
          <a-form-item :label="item.name" :name="item.name" :rules="[{ required: true }]" v-for="(item, key) in inputData" :key="key">
            <a-input v-model:value="formData[item.name]" :placeholder="'Please input ' + item.type" allowClear />
          </a-form-item>
          <a-form-item label="Custom Params" name="Custom Params">
            <span class="custom-edit" @click="editCustom(dynamicValidateForm.customParams)">Edit</span>
            <a-textarea v-model:value="dynamicValidateForm.customParams" :rows="4" placeholder="please inter a value" />
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div @click="moreContractMethod" 
      class="cursor-pointer flex justify-center items-center mt-[30px] h-[60px] leading-[60px] text-[16px] text-[#666666] dark:text-[#C3C4C7] text-center border border-dashed rounded-[12px] border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816]">
      <img src="@/assets/images/add.png" class="h-[32px] mr-[20px]" />
      <label class="cursor-pointer">Add More Contract Methods</label>
    </div>
  </div>
  <CustomParamsmodal :visible="visible" @showContract="visible = false" @doneSecret="doneSecret" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import CustomParamsmodal from "./CustomParamsmodal.vue";
import type { FormInstance } from 'ant-design-vue';

const props = defineProps({
  selectedId: String,
  inputData: Array as any,
  functionData: Array as any,
  formList: Array as any,
  contractOrchestration:{
    type:Array as any,
    default:()=>[]
  }
});

const { selectedId, inputData, formList, contractOrchestration } = toRefs(props);

const formRef = ref<FormInstance>();
const formData = reactive({
  methodName: selectedId?.value,
  methodType: '',
  param1: 1,
  address: ''
});
const visible = ref(false);
const showMethod = ref(false);


const paramList = ref([
  {label: 'Select project contract', value: 1},
  {label: 'Manual input', value: 2},
])


const formRules = computed(() => {
  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  return {
    param1: [requiredRule('')],
    param2: [requiredRule('')],
    param3: [requiredRule('')],
  };
});

const moreContractMethod = () => {
  showMethod.value = true;
}

const changeParams = (val:any) => {
  Object.assign(formData, formList.value[val]);
}

const deleteBtn = () => {
}
const addCustomParamsBtn = () => {
  visible.value = true;
  console.log('add')
}
const doneSecret = (val: any) => {
  visible.value = false;
  let str = '';
  val.forEach((e: any) => {
    str += `${e.secretName}: ${e.secretValue}\n`
  });
  dynamicValidateForm.customParams = str;
  console.log('有值了：' + val)
}
const editCustom = (val: string) => {
  visible.value = true;
}



</script>

<style scoped lang="less">
#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
.custom-edit {
  position: absolute;
  right: 0;
  top: -30px;
  font-size: 16px;
  color: #E2B578;
  cursor: pointer;
}
</style>