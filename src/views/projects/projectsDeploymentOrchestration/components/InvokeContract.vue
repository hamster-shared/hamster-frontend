<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Invoke Contract Method</div>
    <div class="text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automatically call contract methods post-deployment, including its
      own init method or other contracts' methods
    </div>
    <div v-if="selectedId && showMethod" 
      v-for="(methodItem, methodKey) in methodList" :key="methodKey"
      class="mt-[20px] border border-solid border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816] rounded-[12px] p-[20px]">
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
      <a-form ref="formRef" :rules="formRules" :model="methodItem.formData" layout="vertical">
        <div class="grid grid-cols-2 gap-4">
          <a-form-item name="methodName" label="Method Name">
            <a-select v-model:value="methodItem.formData.methodName" @change="changeMethodName($event, methodKey)" 
              placeholder="Contract Address" :options="contractOrchestration.map((item: any) => ({ value: item.id, label:item.name }))">
            </a-select>
          </a-form-item>
          <a-form-item class="form-noLabel" name="methodType" :rules="[{ required: true }]">
            <a-select v-model:value="methodItem.formData.methodType" @change="changeMethodType($event, methodKey)"
              placeholder="Contract method Type" :options="methodMap.get(methodItem.formData.methodName).functionData.map((item: any) => ({ value: item }))">
            </a-select>
          </a-form-item>  
        </div>
        <div v-if="methodItem.formData.methodType">
          <div class="grid grid-cols-2 gap-4">
            <a-form-item name="param1" label="param1" :rules="[{ required: true }]" >
              <a-select v-model:value="methodItem.formData.param1" 
                placeholder="Select project contract" :options="paramList">
              </a-select>
            </a-form-item>
            <a-form-item class="form-noLabel" name="address" :rules="[{ required: true }]">
              <label class="text-[#73706E] dark:text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
              <a-select v-if="methodItem.formData.param1 == 1" v-model:value="methodItem.formData.address"  
                placeholder="Contract Address" :options="contractOrchestration.map((item: any) => ({ value: item.id, label:item.name }))">
              </a-select>
              <a-input v-else v-model:value="methodItem.formData.address" placeholder="Please input address" allowClear />
            </a-form-item>  
          </div>
          <a-form-item :label="item.name" :name="item.name" :rules="[{ required: true }]" v-for="(item, key) in methodMap.get(methodItem.formData.methodName).inputData[methodItem.formData.methodType]" :key="key">
            <a-input v-model:value="methodItem.formData[item.name]" :placeholder="'Please input ' + item.type" allowClear />
          </a-form-item>
          <a-form-item label="Custom Params" name="Custom Params">
            <span class="custom-edit" @click="editCustom(methodItem.formData.customParams, methodKey)">Edit</span>
            <a-textarea v-model:value="methodItem.formData.customParams" :rows="4" placeholder="please inter a value" />
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
  <CustomParamsmodal :visible="visible" :customKey="customKey" @showContract="visible = false" @doneSecret="doneSecret" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import YAML from "yaml";
import CustomParamsmodal from "./CustomParamsmodal.vue";
import type { FormInstance } from 'ant-design-vue';

const props = defineProps({
  selectedId: String,
  methodMap:{
    type: Map as any,
    required: true,
  },
  contractOrchestration:{
    type:Array as any,
    default:()=>[]
  }
});

const { selectedId, methodMap, contractOrchestration } = toRefs(props);
const emits = defineEmits(['setAbiInfo', 'setDisabledSave']);

const visible = ref(false);
const customKey = ref(0);
const showMethod = ref(false);
const formRef = ref<FormInstance>();
const formDataDemo = reactive<any>({
  methodName: selectedId?.value,
  methodType: '',
  param1: 1,
  address: '',
  customParams: '',
}); 
const methodList = reactive<any>([
  {
    formData: formDataDemo
  }
]);


const paramList = ref([
  {label: 'Select project contract', value: 1},
  {label: 'Manual input', value: 2},
])


const formRules = computed(() => {
  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  return {
    methodType1: [requiredRule('')],
    // param2: [requiredRule('')],
    // param3: [requiredRule('')],
  };
});

const moreContractMethod = () => {
  if (selectedId?.value) {
    if (showMethod.value) {
      methodList.push({
        formData: {
          methodName: selectedId?.value,
          methodType: '',
          param1: 1,
          address: '',
          customParams: '',
        }
      });
    } else {
      methodList[methodList.length-1].formData.methodName = selectedId?.value
      showMethod.value = true;
    }
    emits('setDisabledSave', false);
    
  }
}
//选择合同
const changeMethodName = (val: any, methodKey: number) => {
  
  methodList[methodKey].formData.methodType = '';
  methodList[methodKey].formData.address = '';
  methodList[methodKey].formData.customParams = '';
  if (!methodMap.value.get(val)) {
    contractOrchestration.value.forEach((element: any) => {
      if (element.id === val) {
        emits('setAbiInfo', element.abiInfo, val, 'method');
      }
    });
  }
}
//选择function类型
const changeMethodType = (val: any, methodKey: number) => {
  methodList[methodKey].formData = Object.assign({}, methodList[methodKey].formData, methodMap.value.get(methodList[methodKey].formData.methodName).formList[val]);
  console.log("methodList:::",methodList);
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
  methodList[customKey.value].formData.customParams = str;
  console.log('有值了：' + val)
}
const editCustom = (val: string, methodKey: number) => {
  visible.value = true;
  customKey.value = methodKey;
}


defineExpose({
  methodList,
})

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