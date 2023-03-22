<template>
  <a-modal v-model:visible="aptosVisible" :footer="null" @cancel="hideVisible">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
    </template>
    <div class="text-[24px] text-[#151210] font-bold">Set Build Parameters</div>
    <div class="text-[#73706E] mb-4">set parameters of Aptos Contract for Build this Contract.</div>
    <a-form :model="formData" layout="vertical" ref="formRef">
      <a-form-item v-for="item in paramList" :label="item.name"
        :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="formData.name" placeholder="name" autocomplete="off" allowClear />
      </a-form-item>
    </a-form>
    <div class="btn-box">
      <a-button class="mr-[24px]">Connect Petra Wallet to get address</a-button>
      <a-button class="w-[120px]" @click="submit">Done</a-button>
    </div>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref, reactive, toRefs } from "vue";
const formData = reactive({
  name: '',
});
const formRef = ref();


const props = defineProps<{
  aptosVisible: Boolean,
}>()

const { aptosVisible } = toRefs(props);

const paramList = ref([{ name: 'name' }, { name: 'id' }, { name: 'token' }])

const emit = defineEmits(["hideAptosParam"]);

const hideVisible = () => {
  emit("hideAptosParam");
}

const submit = async () => {
  await formRef.value.validate();
}
</script>
<style lang='less' scoped>
.btn-box {
  text-align: center;

  .ant-btn {
    height: 40px;
  }
}
</style>