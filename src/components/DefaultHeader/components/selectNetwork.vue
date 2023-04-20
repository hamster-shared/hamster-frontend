<template>
  <div class="ml-[32px]">
    <a-select ref="select" v-model:value="networkValue" style="width: 160px" @change="handleChange">
      <a-select-option :value="item" v-for="item in networkList" :key="item">{{ item }}</a-select-option>
    </a-select>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted } from "vue";
const networkValue = ref('Ethereum Mainnet');
const networkList = ref(['Ethereum Mainnet', 'Ethereum Testnet', 'BSC Mainnet', 'BSC Testnet','Hamster Moonbeam']);

const handleChange = (val: string) => {
  localStorage.setItem('network', val)
}

onMounted(() => {
  localStorage.setItem('network', 'Ethereum Mainnet')
})
</script>
<style lang='less' scoped>
:deep(.ant-select-selector) {
  background-color: #E2B578 !important;
}

:deep(.ant-select-arrow svg) {
  color: #ffffff !important;
}

:deep(.ant-select-single.ant-select-open .ant-select-selection-item) {
  color: #ffffff;
}
</style>