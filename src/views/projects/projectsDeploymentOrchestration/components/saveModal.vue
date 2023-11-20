<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="visibleSave" :maskClosable="false">
      <!-- <div class="text-[24px] text-[#151210] font-bold">Custom Params</div> -->
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="handleCancel" />
      </template>
      <div class="py-[26px]">
        <div class="text-center">
          <img class="w-[100px]" src="@/assets/images/saveModal.png" />
        </div>
        <div class="text-[#000000] text-[24px] pt-[10px] px-[80px] pb-[30px] text-center">You have unsaved content. Please save immediately, otherwise data will be lost.</div>
        <div class="text-center">
            <a-button class="add-btn" @click="handleCancel">Cancel</a-button>
            <a-button class="done-btn" @click="handleSave">Save</a-button>
          </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
const props = defineProps({
  visibleSave: Boolean,
});

const { visibleSave } = toRefs(props);
const emit = defineEmits(["handleCancel", "handleSave"]);

const handleCancel = () => {
  emit('handleCancel')
}

const handleSave = () => {
  emit('handleSave')
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