<template>
  <div class="my-2 flex justify-between items-center">
    <div class="font-bold text-[#818998]">UPGRADEABILITY
      <a-checkbox value="transparent" :checked="opts.upgradeable" name="upgradeable" @click="checkRadioClick" ></a-checkbox>
    </div>
    <a-tooltip placement="right">
      <template #title>
        <div>Smart contracts are immutable by default unless deployed behind an upgradeable proxy.</div>
        <a target="_blank" href="https://docs.openzeppelin.com/openzeppelin/upgrades">Read more</a>
      </template>
      <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
    </a-tooltip>
  </div>
  <div>
    <a-radio-group class="w-full" v-model:value="opts.upgradeable" name="upgradeable" @change="setContract">
      <div class="flex justify-between items-center">
        <a-radio value="transparent">Transparent</a-radio>
        <a-tooltip placement="right">
          <template #title>
            <div>Uses more complex proxy with higher overhead, requires less changes in your contract. Can also be used with beacons.</div>
            <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/proxy#TransparentUpgradeableProxy">Read more</a>
          </template>
          <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
        </a-tooltip>
      </div>
      <div class="flex justify-between items-center">
        <a-radio value="uups">UUPS</a-radio>
        <a-tooltip placement="right">
          <template #title>
            <div>Uses simpler proxy with less overhead, requires including extra code in your contract. Allows flexibility for authorizing upgrades.</div>
            <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable">Read more</a>
          </template>
          <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
        </a-tooltip>
      </div>
    </a-radio-group>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  opts: Object,
});
const { opts } = toRefs(props);
const emit = defineEmits(["showContract"]);

const setContract = () => {
  if (opts.value.upgradeable === 'uups') {
    opts.value.access = 'ownable';
  }
  emit("showContract");
}
const checkRadioClick = (event: any) => {
  if (event.target.checked === true) {
    opts.value[event.target.name] = event.target.value;
  } else {
    opts.value[event.target.name] = event.target.checked;
  }
  setContract();
}
</script>