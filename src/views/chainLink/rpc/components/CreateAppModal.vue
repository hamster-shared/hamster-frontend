<template>
  <a-modal :footer="null" width="760px" centered="true" v-model:visible="createVisible">
    <div class="text-[24px] text-[#151210] font-bold mb-[32px]">
      <label v-if="modalType == 'create'">Create App</label>
      <label v-else>Edit App Info</label>
    </div>
    <template #closeIcon>
      <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
    </template>
    <a-form class="modal-form" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item label="Name" name="name">
        <a-input class="modal-input" v-model:value="formData.name" placeholder="Please enter name" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
    <div class="mt-8 text-center">
      <a-button type="primary" class="w-[240px] !h-[43px] mr-[24px]" ghost @click="hideVisible">Cancel</a-button>
      <a-button type="primary" class="w-[240px] !h-[43px]" :loading="createLoading" @click="handleOk">Confirm</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue';
import { apiZanCreateApiKey } from "@/apis/middlewareRPC"
import { message } from 'ant-design-vue';

const props = defineProps({
  createVisible: Boolean,
  modalType: {
    type: String,
    default: 'create',
  }
});
const { createVisible, modalType } = toRefs(props);
const emits = defineEmits(['hiddenCreateModal']);

const formRef = ref();
const createLoading = ref(false);
const formData = reactive({
  name: '',
});
let reg = /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/
const formRules = computed(() => {

  const checkDupName = async () => {
    // try {
    //   //校验仓库名称是否存在
    //   const params = {
    //     owner: JSON.parse(userInfo)?.username,
    //     name: formData.name,
    //   }
    //   // console.log('formdataName:', params)
    //   const res = await apiDupProjectName(params);
    //   if (formData.name && !reg.test(formData.name)) {
    //     return Promise.reject("Please enter correct name");
    //   } else if (res.data === false) {
    //     return Promise.reject("Project Name duplication");
    //   } else {
    //     return Promise.resolve()
    //   }
    // } catch (error: any) {
    //   console.log("erro:", error)
    //   return Promise.reject("Project Name check failure");
    // }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter name!'), { validator: checkDupName, trigger: "change" }],
  };
});
const handleOk = async () => {
  
  try {
    await formRef.value.validate();
    createLoading.value = true;
    let res:any = {};
    if (modalType.value == 'create') {
      res = await apiZanCreateApiKey(formData.name);
      console.log("res:", res);
    }
    if (res.code == 200) {
      message.success(res.message)
    }
  } catch (error: any) {
    console.log("error:",error);
    message.error(error.message)
  } finally {
    createLoading.value = false;
    hideVisible();
  }
}
const hideVisible = () => {
  emits('hiddenCreateModal');
}
</script>
<style scoped lang="less"></style>