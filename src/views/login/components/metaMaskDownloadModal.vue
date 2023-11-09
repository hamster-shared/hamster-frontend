<template>
  <a-modal v-model:visible="metaMaskVisible" :footer="null" title="Warning" width="760px" :dialogStyle="dialogStyle">
    <template #closeIcon>
      <img src="@/assets/icons/closeIcon.svg" @click="closeMetaMaskModal" />
    </template>
    <div class="text-[24px] mt-[50px] mb-[100px] text-center">Don't have Chrome Extension of MetaMask wallet.</div>
    <div class="text-center mb-[20px]">
      <a-button class="mr-[24px]" type="primary" ghost @click="closeMetaMaskModal">Cancel</a-button>
      <a-button type="primary" @click="downloadMetaMask">Download</a-button>
    </div>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  metaMaskVisible: {
    type: Boolean,
    default: false,
  }
});

const dialogStyle = ref({ top: "280px" });
const { metaMaskVisible } = toRefs(props);

const emit = defineEmits(["closeMetaMaskModal"])

const closeMetaMaskModal = () => {
  emit('closeMetaMaskModal')
}

const downloadMetaMask = () => {
  // window.open()
  emit('closeMetaMaskModal')
}

</script>
<style lang='less' scoped>
.ant-btn {
  width: 240px;
  height: 43px;
}
</style>