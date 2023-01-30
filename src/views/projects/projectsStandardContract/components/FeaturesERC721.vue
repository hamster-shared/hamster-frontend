<template>
  <div class="font-bold text-[#818998] my-2">FEATURES</div>
  <div class="flex justify-between items-center" v-for="(items, index) in featuresList" :key="index">
    <div :class="{'pl-4':items.name === 'incremental'}">
      <a-checkbox v-if="items.name === 'mintable'" :checked="isChecked" :name="items.name" @click="checkboxClick"> {{ items.label }}</a-checkbox>
      <a-checkbox v-else :name="items.name" @click="checkboxClick"> {{ items.label }}</a-checkbox>
    </div>
    <a-tooltip placement="right">
      <template #title>
        <div v-if="items.name === 'mintable'">Privileged accounts will be able to emit new tokens.</div>
        <div v-if="items.name === 'incremental'">New tokens will be automatically assigned an incremental id.</div>
        <div v-if="items.name === 'burnable'">
          <div>Token holders will be able to destroy their tokens.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Burnable">Read more</a>
        </div>
        <div v-if="items.name === 'pausable'">
          <div>Privileged accounts will be able to pause the functionality marked as <code>whenNotPaused</code>.</div>
          <div>Useful for emergency response.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable">Read more</a>
        </div>
        <div v-if="items.name === 'votes'">
          <div>Keeps track of individual units for voting in on-chain governance, with a way to delegate one's voting power to a trusted account.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Votes">Read more</a>
        </div>
        <div v-if="items.name === 'enumerable'">
          <div>Allows on-chain enumeration of all tokens or those owned by an account. Increases gas cost of transfers.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Enumerable">Read more</a>
        </div>
        <div v-if="items.name === 'uriStorage'">
          <div>Allows updating token URIs for individual token IDs.</div>
          <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage">Read more</a>
        </div>
      </template>
      <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
    </a-tooltip>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue';

const props = defineProps({
  opts: Object,
});
const { opts } = toRefs(props);
const emit = defineEmits(["checkboxClick"]);

const isChecked = ref(false);
const featuresList = ref([
  { name: 'mintable', label: 'Mintable' },
  { name: 'incremental', label: 'Auto Increment Ids' },
  { name: 'burnable', label: 'Burnable' },
  { name: 'pausable', label: 'Pausable' },
  { name: 'votes', label: 'Votes' },
  { name: 'enumerable', label: 'Enumerable' },
  { name: 'uriStorage', label: 'URI Storage' },
]);

const checkboxClick = async (event: any) => {
  if (event.target.name === 'incremental' && event.target.checked === true) {
    isChecked.value = true;
  } 
  if (event.target.name === 'mintable') {
    isChecked.value = event.target.checked;
  }
  
  emit("checkboxClick", event);
}
</script>