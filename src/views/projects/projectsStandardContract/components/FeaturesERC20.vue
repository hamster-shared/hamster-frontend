<template>
  <div class="font-bold text-[#818998] my-2">FEATURES</div>
  <div class="flex justify-between items-center" v-for="(items, index) in featuresList" :key="index">
    <div>
      <a-checkbox :name="items.name" @click="checkboxClick"> {{ items.label }}</a-checkbox>
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
</template>
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(["checkboxClick"]);

const featuresList = ref([
  { name: 'mintable', label: 'Mintable' },
  { name: 'burnable', label: 'Burnable' },
  { name: 'pausable', label: 'Pausable' },
  { name: 'permit', label: 'Permit'},
  { name: 'votes', label: 'Votes'},
  { name: 'flashmint', label: 'Flash Minting'},
  { name: 'snapshots', label: 'Snapshots'},
]);

const checkboxClick = async (event: any) => {
  console.log("event:",event);
  emit("checkboxClick", event);
}
</script>