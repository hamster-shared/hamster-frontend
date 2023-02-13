<template>
  <div class="font-bold text-[#818998] my-2">INFO</div>
  <div>
    <div class="flex justify-between items-center">
      <label>Security Contact</label>
      <a-tooltip placement="right">
        <template #title>
          <div>Where people can contact you to report security issues. Will only be visible if contract metadata is verified.</div>
          <a target="_blank" href="https://github.com/ethereum-lists/contracts/blob/main/README.md#tracking-new-deployments">Read more</a>
        </template>
        <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
      </a-tooltip>
    </div>
    <div>
      <a-input @change="setContract" v-model:value="opts.info.securityContact" placeholder="security@example.com" allow-clear autocomplete="off" />
    </div>
  </div>
  <div class="mt-2">
    <div>License</div>
    <a-input v-model:value="opts.info.license" :placeholder="infoDefaults.license" allow-clear autocomplete="off" />
  </div>
</template>
<script setup lang="ts">
import { infoDefaults } from '@openzeppelin/wizard';
import { toRefs } from 'vue';

const props = defineProps({
  opts: Object,
});
const { opts } = toRefs(props);
const emit = defineEmits(["showContract"]);

const setContract = () => {
  emit("showContract");
}
</script>