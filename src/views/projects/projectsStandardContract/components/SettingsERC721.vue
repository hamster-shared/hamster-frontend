<template>
  <div class="font-bold text-[#818998] mb-2">SETTINGS</div>
    <div class="flex">
      <div class="w-2/3">
        <div>Name</div>
        <div class="mr-2">
          <a-input v-model:value="opts.name" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
        </div>
      </div>
      <div class="w-1/3">
        <div>Symbol</div>
        <div>
          <a-input v-model:value="opts.symbol" @change="setContract()" placeholder="" allow-clear autocomplete="off" />
        </div>
      </div>
    </div>
    <div class="mt-2">
      <div class="flex justify-between items-center">
        <label>Base URI</label>
        <a-tooltip placement="right">
          <template #title>
            <div>Will be concatenated with token IDs to generate the token URIs.</div>
          </template>
          <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
        </a-tooltip>
      </div>
      <div>
        <a-input v-model:value="opts.baseUri" @change="setContract()" placeholder="https://..." allow-clear autocomplete="off" />
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