<template>
  <div>
    <a-modal v-model:visible="visiblePayment" :footer="null" :closable="false">
      <template #closeIcon>
        <img src="@/assets/icons/closeIcon.svg" @click="closePayModal" />
      </template>
      <div>
        <div></div>
        <a-button type="primary"></a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang='ts' setup>
import { ref } from "vue";
const visiblePayment = ref(false);

const closePayModal = () => {

}
</script>
<style lang='less' scoped></style>