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
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1 cursor-pointer" />
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
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1 cursor-pointer" />
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
              <img src="@/assets/icons/info.svg" class="h-[16px] mr-1 cursor-pointer" />
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
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import {
  apiPostContainer,
  apiGetContainer
} from "@/apis/projects";
import { message } from "ant-design-vue";

const props = defineProps({
  containerVisible: Boolean,
  detailId: String,
  containerType: String,
});
const { containerVisible, detailId, containerType } = toRefs(props);
const emit = defineEmits(["hideContainerParam", "frontendContainerDeploy"]);

const loading = ref(false);
const formRef = ref();
const serviceProtocolList = ref(['TCP','UDP','SCTP']);
const formData = reactive({
  containerSize: '0.5 Core 0.5GB',
  containerPort: null,
  serviceProtocol: 'TCP',
  servicePort: null,
  serviceTargetPort: null,
});

const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    containerPort: [requiredRule('containerPort')],
    servicePort: [requiredRule('servicePort')],
    serviceTargetPort: [requiredRule('serviceTargetPort')],
  };
});

watch(containerVisible, (newVal) => {
  if (newVal === true && containerType?.value === 'update') {
    getContainer();
  }
 })

const setPortData = () => {
  if (formData.containerPort != null && formData.containerPort != "") {
    formData.servicePort = formData.serviceTargetPort = formData.containerPort;
  }
}
const hideVisible = () => {
  emit("hideContainerParam");
}
const paramDone = async () => {
  await formRef.value.validate();

  loading.value = true;

  try {
    const params = {
      containerPort: formData.containerPort - 0,
      serviceProtocol: formData.serviceProtocol,
      servicePort: formData.servicePort - 0,
      serviceTargetPort: formData.serviceTargetPort - 0,
    }
    updateContainer(params);
  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    loading.value = false;
    hideVisible();
  }
}

const updateContainer = async (apiContainerDeployParams: Object) => {
  try {
    const data = await apiPostContainer(detailId?.value, apiContainerDeployParams);
    if (containerType?.value === 'update') {
      message.success(data.message);
    } else {
      emit("frontendContainerDeploy", apiContainerDeployParams);
    }
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const getContainer = async () => {
  try {
    const { data } = await apiGetContainer(detailId?.value);

    formData.containerPort = data.containerPort === 0 ? '' : data.containerPort
    formData.servicePort = data.servicePort === 0 ? '' : data.servicePort
    formData.serviceTargetPort = data.serviceTargetPort === 0 ? '' : data.serviceTargetPort
    formData.serviceProtocol = data.serviceProtocol === '' ? 'TCP' : data.serviceProtocol
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
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