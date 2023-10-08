<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Contract Parameters</div>
    <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Parameters the contract specifies to be passed in during deploymrnt
    </div>
    <div>
      <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm" layout="vertical">
        <a-space style="margin-bottom: 8px, width: 100%;">
          <a-form-item :name="dynamicValidateForm.param1" :rules="{
            required: true,
            message: 'Missing first name',
          }" label="param1">
            <a-select ref="select" v-model:value="dynamicValidateForm.param1" @change="changeParams" style="width: 50%"
              placeholder="Select project contract" :options="paramList.map(item => ({ value: item }))">
            </a-select>
          </a-form-item>
          <a-form-item label="address" :name="dynamicValidateForm.param2" :rules="{
            required: true,
            message: 'Missing last name',
          }" labelAlign="right">
            <a-select ref="select" v-model:value="dynamicValidateForm.param2" @change="changeParams" style="width: 100%"
              placeholder="Contract Address" :options="paramList.map(item => ({ value: item }))">
            </a-select>
            <!-- <a-input v-model:value="dynamicValidateForm.param2" placeholder="Last Name" /> -->
          </a-form-item>

        </a-space>
        <a-form-item label="param2" labelWrap>
          <a-input v-model:value="dynamicValidateForm.param2" placeholder="Please enter a value for string" allow-clear />
        </a-form-item>
        <a-form-item label="param3" labelWrap>
          <a-input v-model:value="dynamicValidateForm.param3" placeholder="Please enter a value for unit64" allow-clear />
        </a-form-item>

      </a-form>
    </div>
    <div
      class="h-[90px] leading-[90px] text-center border border-solid rounded-[12px] border-[#302D2D] bg-[#191816] text-[14px] text-[#666666] ">
      No Data
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

const labelColData = reactive({
  labelCol: { span: 3, offset: 12 }
})

const changeParams = () => {

}
</script>

<style scoped lang="less"></style>