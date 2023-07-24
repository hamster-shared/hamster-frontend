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
        <label v-if="type === 'download'">dfx.json file not found, please download the dfx.json file template.</label>
        <label v-else>Insufficient cycle, Please top up.</label>
      </div>
      <div class="mt-[10px] text-[#73706E] leading-[19px]">
        <label v-if="type === 'download'">
        The dfx.json file is the configuration manifest for Internet Computer projects, user to define basic project information and deployment settings.<br>
        Please download the dfx.json file template, and place it in the root directory of your project, so that Hamster can locate and read the configuration.
        </label>
        <label v-else>Cycle power Internet Computer with computational payment and network security, please top up.</label>
      </div>
      <div class="text-center mt-[32px]">
        <a-button class="!w-[240px] !h-[43px]">{{ type === 'download' ? 'Download' : 'Top Up' }}</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">

const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  },
  type:{
      type:String,
      default:''
  }
});
const emit = defineEmits(["CancelDeployIC"])

const handleCancel = ()=>{
  emit('CancelDeployIC')
}
</script>