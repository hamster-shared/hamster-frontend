<template>
  <div class="font-bold text-[#818998] mb-2">SETTINGS</div>
    <div>Name</div>
    <div>
      <a-input v-model:value="opts.name" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
    </div>
    <div class="mt-2">
      <div class="flex justify-between items-center">
        <label>URI</label>
        <a-tooltip placement="right">
          <template #title>
            <div>Location of the metadata. Clients will replace any instance of {"{id}"} in this string with the tokenId.</div>
          </template>
          <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
        </a-tooltip>
      </div>
      <div>
        <a-input v-model:value="opts.uri" @change="setContract()" placeholder="https://..." allow-clear autocomplete="off" />
      </div>
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
  emit("showContract");
}
</script>