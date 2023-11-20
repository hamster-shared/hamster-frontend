<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="visibleNoSave" :maskClosable="false">
      <!-- <div class="text-[24px] text-[#151210] font-bold">Custom Params</div> -->
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="handleCancel" />
      </template>
      <div class="py-[26px] px-[40px]">
        <div class="text-[24px] text-[#000000]">
          <div class="text-center">
            <img class="w-[100px]" src="@/assets/images/noSaveContract.png" />
          </div>
          <div class="pt-[30px]">
            The following contracts have required parameters: 
          </div>
          <div class="my-[10px]">
            <div class="bg-[#FFF8EC] rounded-[8px] p-[20px] h-[200px] overflow-y-auto">
              <div class="font-bold" v-for="(item, key) in noSaveContract" :key="key">- {{ item }}</div>
            </div>
          </div>
          <div class="mb-[30px]">
            Please fill in the required parameters before trying again.
          </div>
        </div>
        <div class="text-center">
          <a-button class="done-btn !w-[240px]" @click="handleCancel">Confirm</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps({
  visibleNoSave: Boolean,
  noSaveContract: Array,
});

const { visibleNoSave, noSaveContract } = toRefs(props);
const emit = defineEmits(["handleCancel"]);

const handleCancel = () => {
  emit('handleCancel')
}
</script>

<style lang="less" scoped>
.ant-btn {
  width: 24%;
  height: 43px;
}

.add-btn {
  background-color: #ffffff;
  color: #E2B578;
  margin-right: 20px;
}
</style>