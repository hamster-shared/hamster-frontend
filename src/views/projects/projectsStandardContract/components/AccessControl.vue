<template>
  <div class="my-2 flex justify-between items-center">
    <div class="font-bold text-[#818998]">ACCESS CONTROL
      <a-checkbox value="ownable" :checked="opts.access" name="access" @click="checkRadioClick"></a-checkbox>
    </div>
    <a-tooltip placement="right">
      <template #title>
        <div>Restrict who can access the functions of a contract or when they can do it.</div>
        <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/access">Read more</a>
      </template>
      <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
    </a-tooltip>
  </div>
  <div>
    <a-radio-group class="w-full" v-model:value="opts.access" name="access" @change="setContract">
      <div class="flex justify-between items-center">
        <a-radio value="ownable">Ownable</a-radio>
        <a-tooltip placement="right">
          <template #title>
            <div>Simple mechanism with a single account authorized for all privileged actions.</div>
            <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable">Read more</a>
          </template>
          <img src="@/assets/icons/mark.svg" class="h-[16px] cursor-pointer" />
        </a-tooltip>
      </div>
      <div class="flex justify-between items-center">
        <a-radio value="roles">Roles</a-radio>
        <a-tooltip placement="right">
          <template #title>
            <div>Flexible mechanism with a separate role for each privileged action. A role can have many authorized accounts.</div>
            <a target="_blank" href="https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl">Read more</a>
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