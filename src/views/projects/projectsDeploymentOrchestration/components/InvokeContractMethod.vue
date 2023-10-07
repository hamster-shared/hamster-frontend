<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Invoke Contract Method</div>
    <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Automatically call contract methods post-deployment, including its
      own init method or other contracts' methods
    </div>
    <div class="border border-solid border-[#6C6C6C] rounded-[12px] p-[20px]">
      <div class="flex justify-between">
        <div class="text-[21px] font-bold">Contract Method</div>
        <div>
          <a-popover placement="left">
            <template #content>
              <p>Delete</p>
            </template>
            <a-button type="primary">Hover me</a-button>
          </a-popover>
        </div>

      </div>
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm" layout="vertical">
        <a-space style="display: flex; margin-bottom: 8px" align="baseline">
          <a-form-item :name="dynamicValidateForm.param1" :rules="{
            required: true,
            message: 'Missing first name',
          }" label="Method Name">
            <a-select ref="select" v-model:value="dynamicValidateForm.param1" @change="changeParams"
              placeholder="Select project contract" :options="paramList.map(item => ({ value: item }))">
            </a-select>
          </a-form-item>
          <a-form-item label=" " :name="dynamicValidateForm.param2" :rules="{
            required: true,
            message: 'Missing last name',
          }" labelAlign="right">
            <a-select ref="select" v-model:value="dynamicValidateForm.param2" @change="changeParams"
              placeholder="Please select method" :options="paramList.map(item => ({ value: item }))">
            </a-select>
            <!-- <a-input v-model:value="dynamicValidateForm.param2" placeholder="Last Name" /> -->
          </a-form-item>

        </a-space>

      </a-form>
    </div>
    <div
      class="h-[60px] leading-[60px] text-[16px] text-[#C3C4C7] text-center border border-dashed rounded-[12px] border-[#6C6C6C] bg-[#191816]">
      <img>
      <label>Add More Contract Methods</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from 'ant-design-vue';
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive({
  param1: '',
  param2: '',
  param3: '',
});

const paramList = ref(['1', '2', '3'])


</script>

<style scoped lang="less">
#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>