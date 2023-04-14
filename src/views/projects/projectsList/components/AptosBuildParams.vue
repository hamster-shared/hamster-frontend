<template>
  <a-modal v-model:visible="aptosBuildVisible" :footer="null" @cancel="hideVisible">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
    </template>
    <div class="text-[24px] text-[#151210] font-bold">Set Build Parameters</div>
    <div class="text-[#73706E] mb-4">set parameters of Aptos Contract for Build this Contract.</div>

    <a-form :model="formData" layout="vertical" ref="formRef">
      <template v-for="(item, index) in aptosBuildParams">
        <a-input type="hidden" :name="[index, 'key']" v-model:value="formData[index].key"></a-input>
        <a-form-item :label="item.key" :name="[index, 'value']" :rules="[{ required: true, trigger: 'change', message: 'Cannot be empty' }]" >
          <a-input v-model:value="formData[index].value" allowClear />
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
import { message } from 'ant-design-vue';

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
const formRef = ref()
const connectLoading = ref(false)
const doneLoading = ref(false)

const initFormData = () => {
  console.log("aptosBuildParams", aptosBuildParams)
  if (aptosBuildParams?.value) {
    formData.value = aptosBuildParams.value.map(obj => ({ ...obj }))
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

const copyInfo = async (_items: any) => {
  // 存储传递过来的数据
  let OrderNumber = _items;
  // 创建一个input 元素
  // createElement() 方法通过指定名称创建一个元素
  let newInput = document.createElement("input");
  // 讲存储的数据赋值给input的value值
  newInput.value = OrderNumber;
  // appendChild() 方法向节点添加最后一个子节点。
  document.body.appendChild(newInput);
  // 选中input元素中的文本
  // select() 方法用于选择该元素中的文本。
  newInput.select();
  // 执行浏览器复制命令
  try {
    //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
    await document.execCommand('Copy') // 执行浏览器复制命令
    // 清空输入框
    newInput.remove();
    message.success("copy success");
  } catch {
    message.error("copy failed");
  }
}

const checkAptosWalletInstalled = () => {
  if ('aptos' in window) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', `_blank`);
  }
};

const connectPetraWallet = async () => {
  connectLoading.value = true
  await checkAptosWalletInstalled()
  if (!wallet.isConnected()) {
    wallet.connect("Petra").then(() => {
      copyInfo(wallet.account?.address.slice(2))
    }).catch((err:any)=>{
      console.log('failed 00000', err)
    }).finally(() => {
      connectLoading.value = false
    })
  }else {
    copyInfo(wallet.account?.address.slice(2))
    connectLoading.value = false
  }
}

const handleDone = async () => {
  console.log("formData", formData)
  await formRef.value.validate()
  doneLoading.value = true

  try {
    const res = await apiPostAptosBuild(detailId?.value, { params: formData.value })
    console.log('res:::', res)
    emit("hideAptosBuildVisible");
    emit('aptosBuild', detailId)
  } catch (err: any) {
    console.log('err:', err)
  } finally {
    doneLoading.value = false
  }
}

</script>