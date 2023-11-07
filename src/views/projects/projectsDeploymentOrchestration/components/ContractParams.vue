<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Contract Parameters</div>
    <div class="mb-[20px] text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Parameters the contract specifies to be passed in during deploymrnt
    </div>
    <div v-if="selectedName">
      <a-form ref="formContractRef" :rules="formRules" :model="formData" layout="vertical">
        <div v-for="(item, key) in inputData" :key="key">
          <div class="grid grid-cols-2 gap-4" v-if="item.type == 'address'">
            <a-form-item :label="item.name" :name="item.name+'param'" :rules="[{ required: true }]" >
              <a-select @change="checkFiledChange" v-model:value="formData[item.name+'param']" 
                placeholder="Select project contract" :options="paramList">
              </a-select>
            </a-form-item>
            <a-form-item class="form-noLabel" :name="item.name" :rules="[{ required: true }]">
              <label class="text-[#73706E] dark:text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
              <a-select v-if="formData[item.name+'param'] == 1" v-model:value="formData[item.name]" @change="checkFiledChange"
                placeholder="Contract Address" :options="contractOrchestration.map((opItem:any) => ({ value: opItem.name, label:opItem.name }))">
              </a-select>
              <a-input v-else @change="checkFiledChange" v-model:value="formData[item.name]" :placeholder="'Please input ' + item.type" autoComplete="off" allowClear />
            </a-form-item>  
          </div>
          <a-form-item v-else :label="item.name" :name="item.name" :rules="[{ required: true }]">
            <a-input @change="checkFiledChange" v-model:value="formData[item.name]" :placeholder="'Please input ' + item.type" autoComplete="off" allowClear />
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div v-else
    class="h-[90px] leading-[90px] text-center border border-solid rounded-[12px] border-[#D2D2D2] dark:border-[#302D2D] bg-[#FCFCFC] dark:bg-[#191816] text-[14px] text-[#666666] ">
      No Data
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";

const props = defineProps({
  selectedName: String,
  inputData: Array as any,
  formData: Object as any,
  contractOrchestration:{
    type:Array as any,
    default:()=>[]
  }
});

const { selectedName, inputData, formData, contractOrchestration } = toRefs(props);

const formContractRef = ref();
const paramList = ref([
  {label: 'Select project contract', value: 1},
  {label: 'Manual input', value: 2},
])
const isChange = ref(false);

const formRules = computed(() => {
  // const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  // return {
  //   param1: [requiredRule('')],
  //   param2: [requiredRule('')],
  //   param3: [requiredRule('')],
  // };
});

const checkFiledChange = (val:any) => {
  isChange.value = true;
}

defineExpose({
  formContractRef,
  isChange,
})

</script>

<style scoped lang="less"></style>