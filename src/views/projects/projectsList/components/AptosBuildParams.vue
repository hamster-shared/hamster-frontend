<template>
  <a-modal v-model:visible="aptosBuildVisible" :footer="null" @cancel="hideVisible">
    <div class="text-[24px] text-[#151210] font-bold">Set Build Parameters</div>
    <div class="text-[#73706E] mb-4">set parameters of Aptos Contract for Build this Contract.</div>

    <!-- <a-form :model="formData" layout="vertical" ref="formRef" v-if="aptosBuildParams?.length">
      <template v-for="(item, index) in aptosBuildParams">
        <a-input type="hidden" :name="`[${index}].key`" v-model:value="formData[index].key"></a-input>
        <a-form-item  :label="item.key" :name="`[${index}].value`">
          <a-input v-model:value="formData[index].value" :disabled="item.value != '_'" allowClear></a-input>
        </a-form-item>
      </template>
    </a-form> -->

    <a-form :model="formData" layout="vertical" ref="formRef">
      <template v-for="(item, index) in aptosBuildParams">
        <a-input type="hidden" :name="`[${index}].key`" v-model:value="formData[index].key"></a-input>
        <a-form-item :label="item.key" :name="`[${index}].value`">
          <a-input v-model:value="formData[index].value" allowClear></a-input>
        </a-form-item>
      </template>
    </a-form>

    <div class="flex justify-between">
      <a-button @click="connectPetraWallet" :loading="connectLoading">Connect Petra Wallet to get address</a-button>
      <a-button @click="handleDone" :loading="doneLoading">Done</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, ref, watch } from 'vue'
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletCore } from '@aptos-labs/wallet-adapter-core'
import { apiPostAptosBuild } from '@/apis/projects'

const arr = [new PetraWallet()];
const wallet = new WalletCore(arr)

const props = defineProps({
  aptosBuildVisible: Boolean,
  detailId: String,
  aptosBuildParams: Array
});
const { aptosBuildVisible, detailId, aptosBuildParams } = toRefs(props);
const emit = defineEmits(["hideAptosBuildVisible", "aptosBuild"]);

const formData = ref([])
const connectLoading = ref(false)
const doneLoading = ref(false)

const initFormData = () => {
  console.log("aptosBuildParams", aptosBuildParams)
  if (aptosBuildParams?.value) {
    formData.value = aptosBuildParams.value.map( obj => ({...obj}))
  } else {
    formData.value = []
  }
}

watch(aptosBuildParams, initFormData)

const hideVisible = () => {
  emit("hideAptosBuildVisible");
  connectLoading.value = false
  doneLoading.value = false
}

const checkAptosWalletInstalled = () => {
  if ('aptos' in window) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', `_blank`);
  }
};

const connectPetraWallet = async()=>{
  connectLoading.value = true
  await checkAptosWalletInstalled()
  if(!wallet.isConnected()){
    wallet.connect("Petra").then(() => {
      console.log(wallet.account?.address)

    }).catch((err:any)=>{
      console.log('failed 00000', err)
    }).finally(()=>{
      connectLoading.value = false
    })
  }else {
    console.log('66666',wallet.account?.address)
    connectLoading.value = false
  }
}

const handleDone = async()=>{
  // console.log("formData", formData)
  doneLoading.value = true

  try {
    const res = await apiPostAptosBuild(detailId?.value, { params:formData.value })
    console.log('res:::', res)
    emit("hideAptosBuildVisible");
    emit('aptosBuild', detailId)
  } catch(err:any){
    console.log('err:', err)
  } finally {
    doneLoading.value = false
  }
}

</script>