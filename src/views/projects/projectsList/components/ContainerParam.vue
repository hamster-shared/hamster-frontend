<template>
  <a-modal v-model:visible="containerVisible" :footer="null" @cancel="hideVisible">
    <div class="text-[24px] text-[#151210] font-bold">Set Container Parameters</div>
    <div class="text-[#73706E] mb-4">set parameters to create Container for deploy this FrontEnd on.</div>
    <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item label="containerSize" name="containerSize">
        <a-input v-model:value="formData.containerSize" placeholder="containerSize" disabled="true" autocomplete="off" />
      </a-form-item>
      <div>

      </div>
      <a-form-item name="containerPort">
        <span slot="label">
          <div class="flex justify-between pb-[8px] items-center">
            <span><label class="item-required">*</label>containerPort</span>
            <a-tooltip placement="right">
              <template #title>The application running in the container can be used to receive and process network requests on a specific port.</template>
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1" />
            </a-tooltip>
          </div>
        </span>
        <a-input onchange="" @change="setPortData" v-model:value="formData.containerPort" placeholder="containerPort" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="serviceProtocol" name="serviceProtocol">
        <a-select v-model:value="formData.serviceProtocol" placeholder="serviceProtocol" autocomplete="off"
        :options="serviceProtocolList.map(item => ({ value: item }))">
        </a-select>
      </a-form-item>
      <a-form-item name="servicePort">
        <span slot="label">
          <div class="flex justify-between pb-[8px] items-center">
            <span><label class="item-required">*</label>servicePort</span>
            <a-tooltip placement="right">
              <template #title>It is a logical port abstracted from a Service.</template>
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1" />
            </a-tooltip>
          </div>
        </span>
        <a-input v-model:value="formData.servicePort" placeholder="servicePort" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item name="serviceTargetPort">
        <span slot="label">
          <div class="flex justify-between pb-[8px] items-center">
            <span><label class="item-required">*</label>serviceTargetPort</span>
            <a-tooltip placement="right">
              <template #title>It is the Pod port to be accessed by the Service.</template>
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1" />
            </a-tooltip>
          </div>
        </span>
        <a-input v-model:value="formData.serviceTargetPort" placeholder="serviceTargetPort" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
    <div class="mt-4 text-center">
      <a-button class="ml-4" type="primary" :loading="loading" @click="paramDone">Done</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { emit } from 'process';
import { computed, reactive, ref, toRefs } from 'vue';

const props = defineProps({
  containerVisible: Boolean,
});
const { containerVisible } = toRefs(props);
const emit = defineEmits(["hideContainerParam", "frontendDeploying"]);

const loading = ref(false);
const formRef = ref();
const serviceProtocolList = ref(['TCP','UDP','SCTP']);
const formData = reactive({
  containerSize: '0.5 Core 0.5GB',
  containerPort: '',
  serviceProtocol: 'TCP',
  servicePort: '',
  serviceTargetPort: '',
});

const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    containerPort: [requiredRule('containerPort')],
    servicePort: [requiredRule('servicePort')],
    serviceTargetPort: [requiredRule('serviceTargetPort')],
  };
});
const setPortData = () => {
  if (formData.containerPort != null && formData.containerPort != "") {
    formData.servicePort = formData.serviceTargetPort = formData.containerPort;
  }
}
const hideVisible = () => {
  emit("hideContainerParam");
}
const paramDone = async () => {
  console.log("formData:", formData);
  await formRef.value.validate();

  loading.value = true;

  try {
    // const data = await apiAddApp(formData);
  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    loading.value = false;
    hideVisible();
    emit("frontendDeploying");
  }
}
</script>
<style lang='less' scoped>

:deep(.ant-select-selection-item){
  color: #8A8A8A !important;
}

:deep(.ant-btn-primary) {
  width: 120px;
  height: 40px;
}

.item-required {
  color: #ff4d4f;
  content: "*";
  display: inline-block;
  font-family: SimSun,sans-serif;
  font-size: 14px;
  line-height: 1;
  margin-right: 4px;
}
</style>