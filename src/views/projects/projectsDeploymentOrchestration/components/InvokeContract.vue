<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Invoke Contract Method</div>
    <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Automatically call contract methods post-deployment, including its
      own init method or other contracts' methods
    </div>
    <div class="border border-solid border-[#6C6C6C] bg-[#191816] rounded-[12px] p-[20px]">
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
      <a-form ref="formRef" :rules="formRules" :model="dynamicValidateForm" layout="vertical">
        <a-form-item :name="dynamicValidateForm.param1" label="Method Name">
          <a-select v-model:value="dynamicValidateForm.param1" @change="changeParams" style="width: 45%;margin-right:5%"
            placeholder="Select project contract" :options="paramList.map(item => ({ value: item }))">
          </a-select>
          <a-select v-model:value="dynamicValidateForm.address" @change="changeParams" style="width: 50%"
            placeholder="Contract Address" :options="paramList.map(item => ({ value: item }))">
          </a-select>
        </a-form-item>
        <a-form-item :name="dynamicValidateForm.param1" label="Param1">
          <a-select v-model:value="dynamicValidateForm.param1" @change="changeParams" style="width: 45%;margin-right:5%"
            placeholder="Select project contract" :options="paramList.map(item => ({ value: item }))">
          </a-select>
          <label class="text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
          <a-select v-model:value="dynamicValidateForm.address" @change="changeParams" style="width: 50%"
            placeholder="Contract Address" :options="paramList.map(item => ({ value: item }))">
          </a-select>
        </a-form-item>
        <a-form-item label="Param2" name="param2">
          <a-input v-model:value="dynamicValidateForm.param2" placeholder="Please enter a value for string" allow-clear />
        </a-form-item>
        <a-form-item label="Param3" name="param3">
          <a-input v-model:value="dynamicValidateForm.param3" placeholder="Please enter a value for unit64" allow-clear />
        </a-form-item>
        <a-form-item label="Custom Params" name="Custom Params">
          <span class="custom-edit" @click="editCustom(dynamicValidateForm.customParams)">Edit</span>
          <a-textarea v-model:value="dynamicValidateForm.customParams" :rows="4" placeholder="please inter a value" />
        </a-form-item>
      </a-form>
    </div>
    <div v-if="true"
      class="h-[60px] leading-[60px] text-[16px] text-[#C3C4C7] text-center border border-dashed rounded-[12px] border-[#6C6C6C] bg-[#191816] mt-[30px] cursor-pointer">
      <img class="w-[28px] mr-[20px]" src="@/assets/images/Add.png" />
      <label class="cursor-pointer">Add More Contract Methods</label>
    </div>
  </div>

  <CustomParamsmodal :visible="visible" @showContract="visible = false" @doneSecret="doneSecret" />
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import CustomParamsmodal from "./CustomParamsmodal.vue";
import type { FormInstance } from 'ant-design-vue';
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive({
  param1: '',
  address: '',
  param2: '',
  param3: '',
  customParams: '',
});
const visible = ref(false);

const paramList = ref(['1', '2', '3'])


const formRules = computed(() => {
  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  return {
    param1: [requiredRule('')],
    param2: [requiredRule('')],
    param3: [requiredRule('')],
    customParams: [requiredRule('')],
  };
});

const changeParams = () => {

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