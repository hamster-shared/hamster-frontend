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
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#ERC1155Burnable">Read more</a>
        </div>
        <div v-if="items.name === 'supply'">Keeps track of total supply of tokens.</div>
        <div v-if="items.name === 'pausable'">
          <div>Privileged accounts will be able to pause the functionality marked as <code>whenNotPaused</code>.</div>
          <div>Useful for emergency response.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable">Read more</a>
        </div>
        <div v-if="items.name === 'updatableUri'">
          <div>Privileged accounts will be able to set a new URI for all token types. Clients will replace any instance of {"{id}"} in the URI with the tokenId.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#ERC1155-_setURI-string-">Read more</a>
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
  { name: 'supply', label: 'Supply Tracking' },
  { name: 'pausable', label: 'Pausable'},
  { name: 'updatableUri', label: 'Updatable URI'},
]);

const checkboxClick = async (event: any) => {
  emit("checkboxClick", event);
}
</script>