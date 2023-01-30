<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="text-[32px] font-bold mb-4">
      <img
        src="@/assets/icons/chain.svg"
        class="h-[30px] hidden dark:inline-block"
      />
      <img
        src="@/assets/icons/chain-b.svg"
        class="h-[30px] dark:hidden"
      />
      Support Chain</div>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(item, index) in chainList" :key="index" class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
        <div class="text-[24px] font-bold mb-[32px] flex items-center">
          <img :src="getImageURL(`${item.name}.png`)"
            class="h-[32px] rounded-full mr-2"
          />
          {{ item.name }}
        </div>
        <div class="flex items-center mb-[32px]">
          <div class="w-1/3 font-normal">HTTPS</div>
          <div class="w-full">
            <a-input v-model:value="item.http_address" disabled="true" />
          </div>
          <!-- <div class="hidden w-full dark-input dark:inline-block">
            <a-input v-model:value="item.http_address" disabled="true" />
          </div>
          <div class="w-full white-input dark:hidden">
            <a-input v-model:value="item.http_address" disabled="true"  />
          </div> -->
        </div>
        <div class="flex items-center mb-[32px]">
          <div class="w-1/3 font-normal">WEBSOCKETS</div>
          <div class="w-full">
            <a-tooltip>
              <template #title v-if="item.websocket_address === ''">This chain has no websockets rpc address</template>
              <div class="w-full">
                <a-input v-model:value="item.websocket_address" disabled="true" />
              </div>
            </a-tooltip>
          </div>
        </div>
        <div class="text-center">
          <a-button type="primary" @click="userNow( item.name, item.networks)">Use Now</a-button>
        </div>
      </div>
    </div>
  </div>
  <CreateApp :isRPCs="isRPCs" :showCreate="showCreate" :defaultChain="defaultChain" :defaultNetwork="defaultNetwork" @setShowCreate="showCreate=false" />
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { apiGetChains } from "@/apis/rpcs";
import CreateApp from "../apps/components/CreateApp.vue"
import useAssets from "@/stores/useAssets";
import { message } from 'ant-design-vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const { getImageURL } = useAssets()
const showCreate = ref(false);
const isRPCs = ref(true);
const defaultChain = ref('');
const defaultNetwork = ref('');
const chainList = ref([]); //链列表

onMounted(async () => {
  getChains();
});

const getChains = async () => {
  try {
    const data = await apiGetChains();
    chainList.value = data.result;
    data.result.forEach((item: { networks: any[]; name: string; }, key: any) => {
      
      item.networks.forEach((ele: any, index: any) => {
        if (ele.name === 'Mainnet') {
          chainList.value[key].http_address = ele.http_address;
          chainList.value[key].websocket_address = ele.websocket_address;
        }
      })
    });
    // Object.assign(chainList, data.result); //赋值
    
  } catch (error: any) {
    console.log("erro:",error)
  }
};

const userNow = async (chain: any, networks: any) => {
  const connectedWallets = window.localStorage.getItem('alreadyConnectedWallets')
  // 如果 local storage 里没有保存的钱包，直接返回
  if (connectedWallets == null || connectedWallets === '[]') {
    message.info("Please operate Connect Wallet");
  } else {
    showCreate.value = true;
    defaultChain.value = chain;
    defaultNetwork.value = networks[0]['name'];
  }
}
</script>
<style scoped lang="less">
@btnColor: #E2B578;
:deep(.ant-input[disabled]){
  background-color: transparent;
  border-radius: 8px;
  height: 40px;
}
:deep(.dark-css .ant-input){
  color: #8A8A8A;
  border-color: #434343;
}
:deep(.white-css .ant-input){
  color: #BBBAB9;
  border-color: #EBEBEB;
}
:deep(.ant-btn){
  border-radius: 8px;
}
:deep(.ant-btn-primary){
  width: 120px;
  height: 40px;
}
:deep(.ant-btn-primary), :deep(.ant-btn-primary:hover), :deep(.ant-btn-primary:focus){
  border-color: @btnColor;
  background: @btnColor;
}
</style>