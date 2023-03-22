<template>
  <a-modal v-model:visible="aptosBuildVisible" :footer="null" @cancel="hideVisible">
    <div class="text-[24px] text-[#151210] font-bold">Set Build Parameters</div>
    <div class="text-[#73706E] mb-4">set parameters of Aptos Contract for Build this Contract.</div>

    <a-form :model="formData" layout="vertical" ref="formRef">
      <a-form-item v-for="item in aptosBuildParams" :label="item.key"
        :rules="[{ required: true, trigger: 'change', message: 'can not be empty!' }]">
        <a-input v-model:value="item.value" :disabled="item.value != '_'" :allowClear="item.value == '_'"></a-input>
      </a-form-item>
    </a-form>

    <div class="flex justify-between">
      <a-button @click="connectPetraWallet" :loading="connectLoading">Connect Petra Wallet to get address</a-button>
      <a-button @click="handleDone" :loading="doneLoading">Done</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, ref, onMounted } from 'vue';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletCore } from '@aptos-labs/wallet-adapter-core';
import { apiPostAptosBuild } from '@/apis/projects';

const arr = [new PetraWallet()];
const wallet = new WalletCore(arr);
// const aptosBuildParams = ref([]);

const props = defineProps({
  aptosBuildVisible: Boolean,
  detailId: String,
  aptosBuildParams: Array
});
const { aptosBuildVisible, detailId, aptosBuildParams } = toRefs(props);
const emit = defineEmits(["hideAptosBuildVisible", "aptosBuild"]);

const connectLoading = ref(false)
const doneLoading = ref(false)

const hideVisible = () => {
  emit("hideAptosBuildVisible");
  connectLoading.value = false
  doneLoading.value = false
}

// const connectPetraWallet = () => {

//   connectLoading.value = true
//   if (!wallet.isConnected()) {
//     wallet.connect("Petra").then(() => {
//       console.log(wallet.account?.address)

//       aptosBuildParams?.value?.forEach(item => {
//         if (item.value == '_') {
//           item.value = wallet.account.address
//         }
//       })
//     }).catch((err: any) => {
//       console.log('failed 00000', err)
//     }).finally(() => {
//       connectLoading.value = false
//     })
//   } else {
//     aptosBuildParams?.value?.forEach(item => {
//       if (item.value == '_') {
//         item.value = wallet.account.address
//       }
//     })
//     console.log('66666', wallet.account?.address)
//     connectLoading.value = false
//   }
// }

const connectPetraWallet = () => {
  if ('aptos' in window) {
    connectLoading.value = true
    if (!wallet.isConnected()) {
      wallet.connect("Petra").then(() => {
        console.log(wallet.account?.address)

        aptosBuildParams?.value?.forEach(item => {
          if (item.value == '_') {
            item.value = wallet.account.address
          }
        })
      }).catch((err: any) => {
        console.log('failed 00000', err)
      }).finally(() => {
        connectLoading.value = false
      })
    } else {
      aptosBuildParams?.value?.forEach(item => {
        if (item.value == '_') {
          item.value = wallet.account.address
        }
      })
      console.log('66666', wallet.account?.address)
      connectLoading.value = false
    }
  } else {
    window.open('https://petra.app/', `_blank`);
  }
}

// const checkAptosWalletInstalled = () => {
//   if ('aptos' in window) {
//     return window.aptos;
//   } else {
//     window.open('https://petra.app/', `_blank`);
//   }
// };

const handleDone = async () => {
  doneLoading.value = true

  try {
    const res = await apiPostAptosBuild(detailId?.value, { params: aptosBuildParams.value })
    console.log('res:::', res)
    emit("hideAptosBuildVisible");
    emit('aptosBuild', detailId)
  } catch (err: any) {
    console.log('err:', err)
  } finally {
    doneLoading.value = false
  }
}

// const initAptosBuildParams = async () => {
//   const { data } = await apiCheckSetAptosBuildParams(props.detailId);
//   if (data.needsParams) {
//     const { data } = await apiGetAptosBuildParams(props.detailId);
//     aptosBuildParams.value = data;
//     aptosBuildVisible.value = true;
//   }
// }

// onMounted(() => {
//   initAptosBuildParams()
// })

</script>