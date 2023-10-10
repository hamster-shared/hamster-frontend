<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Contract Parameters</div>
    <div class="mb-[20px] text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Parameters the contract specifies to be passed in during deploymrnt
    </div>
    <div>
      <a-form ref="formRef" :rules="formRules" :model="dynamicValidateForm" layout="vertical">
        <a-form-item :name="dynamicValidateForm.param1" label="param1">
          <a-select v-model:value="dynamicValidateForm.param1" @change="changeParams" style="width: 45%;margin-right:5%"
            placeholder="Select project contract" :options="paramList.map(item => ({ value: item }))">
          </a-select>
          <label class="text-[#73706E] dark:text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
          <a-select v-model:value="dynamicValidateForm.address" @change="changeParams" style="width: 50%"
            placeholder="Contract Address" :options="paramList.map(item => ({ value: item }))">
          </a-select>
        </a-form-item>
        <a-form-item label="param2" name="param2">
          <a-input v-model:value="dynamicValidateForm.param2" placeholder="Please enter a value for string" allow-clear />
        </a-form-item>
        <a-form-item label="param3" name="param3">
          <a-input v-model:value="dynamicValidateForm.param3" placeholder="Please enter a value for unit64" allow-clear />
        </a-form-item>

      </a-form>
    </div>
    <div v-if="false"
      class="h-[90px] leading-[90px] text-center border border-solid rounded-[12px] border-[#302D2D] bg-[#191816] text-[14px] text-[#666666] ">
      No Data
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { FormInstance } from 'ant-design-vue';
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive({
  param1: '',
  address: '',
  param2: '',
  param3: '',
});

const paramList = ref(['1', '2', '3'])

const labelColData = reactive({
  labelCol: { span: 3, offset: 12 }
})

const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        param1: [requiredRule('')],
        param2: [requiredRule('')],
        param3: [requiredRule('')],
    };
});

const changeParams = () => {

}
</script>

<style scoped lang="less"></style>