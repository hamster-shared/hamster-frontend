<template>
  <Breadcrumb :currentName="contractName" :isClick="false"></Breadcrumb>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="ERC20" tab="ERC20">
          <div class="flex">
            <div class="p-4 w-1/4">
              <div class="font-bold text-[#818998] mb-2">SETTINGS</div>
              <div class="flex">
                <div class="w-2/3">
                  <div>Name</div>
                  <div class="mr-2">
                    <a-input v-model:value="optsERC20.name" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
                  </div>
                </div>
                <div class="w-1/3">
                  <div>Symbol</div>
                  <div>
                    <a-input v-model:value="optsERC20.symbol" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex justify-between items-center">
                  <label>Premint</label>
                  <a-tooltip placement="right">
                    <template #title>
                      <div>Create an initial amount of tokens for the deployer.</div>
                    </template>
                    <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
                  </a-tooltip>
                </div>
                <div>
                  <a-input v-model:value="optsERC20.premint" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
                </div>
              </div>
              <div class="font-bold text-[#818998] my-2">FEATURES</div>
              <div class="flex justify-between items-center" v-for="(items, index) in featuresList" :key="index">
                <div>
                  <input type="checkbox" :checked="items.checked" :name="items.name" @click="checkboxClick" /> {{ items.label }}
                </div>
                <a-tooltip placement="right">
                  <template #title>
                    <div v-if="items.name === 'mintable'">Privileged accounts will be able to create more supply.</div>
                    <div v-if="items.name === 'burnable'">
                      <div>Token holders will be able to destroy their tokens.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Burnable">Read more</a>
                    </div>
                    <div v-if="items.name === 'pausable'">
                      <div>Privileged accounts will be able to pause the functionality marked as <code>whenNotPaused</code>. </div>
                      <div>Useful for emergency response.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable">Read more</a>
                    </div>
                    <div v-if="items.name === 'permit'">
                      <div>Without paying gas, token holders will be able to allow third parties to transfer from their account.</div>
                      <div><a target="_blank" href="https://eips.ethereum.org/EIPS/eip-2612">EIP</a> is still Draft and may change.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/security#ERC20Permit">Read more</a>
                    </div>
                    <div v-if="items.name === 'votes'">
                      <div>Keeps track of historical balances for voting in on-chain governance, with a way to delegate one's voting power to a trusted account.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes">Read more</a>
                    </div>
                    <div v-if="items.name === 'flashmint'">
                      <div>Built-in flash loans. Lend tokens without requiring collateral as long as they're returned in the same transaction.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20FlashMint">Read more</a>
                    </div>
                    <div v-if="items.name === 'snapshots'">
                      <div>Privileged accounts will be able to store snapshots of balances that can be retrieved later.</div>
                      <div>For on-chain voting, the Votes option is preferable.</div>
                      <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Snapshot">Read more</a>
                    </div>
                  </template>
                  <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
                </a-tooltip>
              </div>
              <AccessControl :opts="optsERC20" @showContract="setContract" />
              <Upgradeability :opts="optsERC20" @showContract="setContract" />
              <InfoSection :opts="optsERC20" @showContract="setContract" />
            </div>
            <div class="p-4  w-3/4 h-[600px]">
              <CodeEditor :readOnly="true" :value="contractERC20"></CodeEditor>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="ERC721" tab="ERC721">
          ERC721
        </a-tab-pane>
        <a-tab-pane key="ERC1155" tab="ERC1155">
          ERC1155
        </a-tab-pane>
      </a-tabs>
    </div>
  <a-button type="primary" class="mt-4" :loading="loading" @click="createProject">Creat by Code</a-button>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { message } from 'ant-design-vue';
import Breadcrumb from "../components/Breadcrumb.vue";
import { erc20, infoDefaults } from '@openzeppelin/wizard';
import type { KindedOptions } from '@openzeppelin/wizard';
import CodeEditor from '@/components/CodeEditor.vue';
import InfoSection from './components/InfoSection.vue';
import Upgradeability from './components/Upgradeability.vue';
import AccessControl from './components/AccessControl.vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const optsERC201: Required<KindedOptions['ERC20']> = {
  kind: 'ERC20',
  ...erc20.defaults,
  premint: '', // default to empty premint in UI instead of 0
  info: { ...infoDefaults }, // create new object since Info is nested
};
console.log("optsERC201:",optsERC201);
const optsERC20 = ref({
  kind: 'ERC20',
  ...erc20.defaults,
  premint: '', // default to empty premint in UI instead of 0
  info: { ...infoDefaults }, // create new object since Info is nested
});
const contractERC20 = ref();
const featuresList = ref([
  { checked: false, name: 'mintable', label: 'Mintable' },
  { checked: true, name: 'burnable', label: 'Burnable' },
  { checked: false, name: 'pausable', label: 'Pausable' },
  { checked: false, name: 'permit', label: 'Permit'},
  { checked: false, name: 'votes', label: 'Votes'},
  { checked: false, name: 'flashmint', label: 'Flash Minting'},
  { checked: false, name: 'snapshots', label: 'Snapshots'},
]);

const { params } = useRoute();
const contractName = ref(params.contractName);
const activeKey = ref(contractName);
const loading = ref(false);

onMounted(async () => {
  
  contractERC20.value = erc20.print({
    name: 'ExampleToken',
    symbol: 'ETK',
    burnable: true,
    premint: '1000000',
    // upgradeable: 'uups',
  });
})

const setContract = async () => {
  console.log("optsERC20:", optsERC20.value);
  if (activeKey.value === 'ERC20') {
    contractERC20.value = erc20.print(optsERC20.value);
  }
}
const checkboxClick = async (event: any) => {
  optsERC20.value[event.target.name] = event.target.checked;
  setContract();
}
const checkRadioClick = async (event: any) => {
  if (event.target.checked === true) {
    optsERC20.value[event.target.name] = event.target.value;
  } else {
    optsERC20.value[event.target.name] = event.target.checked;
  }
  setContract();
}

const createProject = async () => {
  
}
</script>
<style lang='less' scoped>

:deep(.dark-css .ant-tabs){
  color: #E0DBD2;
} 
:deep(.dark-css .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  color: #FFFFFF;
}
:deep(.ant-tabs-tab-btn){
  width: 100px;
  text-align: center;
} 
</style>