<template>
  <a-modal v-model:visible="props.visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Deploy Project</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[30px] text-[14px] bg-[#FFEEE8] border border-solid border-[#F6662B] rounded-[5px] p-[20px]">
        Insufficient cycle, Please top up.
      </div>
      <div class="mt-[10px] text-[#73706E] leading-[19px]">
        Cycle power Internet Computer with computational payment and network security, please top up. 
      </div>
      <div class="text-center mt-[32px]">
        <a-button class="!w-[240px] !h-[43px]">Top Up</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">

const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  }
});
const emit = defineEmits(["CancelDeployIC"])

const handleCancel = ()=>{
  emit('CancelDeployIC')
}
</script>