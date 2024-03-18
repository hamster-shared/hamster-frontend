<template>
  <a-modal v-model:visible="visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
      <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="iconBox">
        <div>
          <img src="@/assets/images/ICPTips.png" alt="">
        </div>
        <div class="desc" v-if="type==='confirm'">
          If the controller managed on the Hamster platform is deleted, the Hamster platform will lose the ability to control the container. Please operate carefully!
        </div>
        <div class="desc" v-else>
          At least 1 controller needs to be retained for container operations!
        </div>

      </div>
      <div class="text-center mt-[32px]" v-if="type==='confirm'">
        <a-button class="!w-[240px] !h-[43px]" ghost @click="handleCancel">Cancel</a-button>
        <a-button :loading="topLoading" class="!w-[240px] !h-[43px] ml-[24px]" @click="handleConfirm">Delete</a-button>
      </div>
      <div class="text-center mt-[32px]" v-else>
        <a-button :loading="topLoading" class="!w-[240px] !h-[43px] ml-[24px]"  @cancel="handleCancel">Done</a-button>
      </div>

    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";
import { computed, reactive, ref, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiWalletInfo, apiRechargeCanister } from '@/apis/canister'
import {deleteController} from "@/apis/icp";

const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  canisterId:{
    type:String,
    default:''
  },
  controllerId:{
    type:String,
    default:''
  },
  type:{
    type:String,
    default:'confirm'
  },
});
const route = useRoute()
const id:any = route.params.id
const { visible, canisterId,controllerId,type } = toRefs(props)
const emit = defineEmits(["handleCancel", 'showBuyCycles', 'showBuyCycleMsg', 'refreshCanister'])
const formRef = ref();
const formData = reactive({
  canisterId: canisterId.value,
  controllerId: controllerId.value,
});
const walletCanisterId = ref()
const walletCyclesBalance = ref()
const topLoading = ref(false)

const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    amount: [requiredRule('Please enter Amount')],
  };
});

const handleConfirm = async() => {
  console.log('handleConfirm',formData)
  try {
    topLoading.value = true
    const params = {
      canisterId: formData.canisterId,
      Controller: formData.controllerId
    }
    const res = await deleteController(params)
    topLoading.value = false
    message.success(res.message)
    emit('handleCancel')
    emit('refreshCanister')
  } catch (error:any) {
    console.log('error:',error)
    if(error.response.data.message.indexOf('out of cycles')!=-1){
      emit('showBuyCycleMsg')
    }else{
      message.error(error.response.data.message)
    }
    topLoading.value = false
  }
}

const handleCancel = ()=>{
  emit('handleCancel')
}

onMounted(async()=>{
  formData.canisterId = canisterId.value
})
</script>
<style scoped lang="less">
:deep(.ant-form-item-label > label){
  font-size: 14px;
  font-weight: 400;
}
:deep(.modal-input-suffix .ant-input-suffix){
  display: flex;
}
:deep(.modal-input-suffix .ant-input-suffix .anticon-close-circle){
  order: 2;
}
.ant-upload-text{
  width: 100%;
  height: 101px;
  background: #FBF9F5;
  border-radius: 8px;
  border: 1px dashed #D2D2D2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: #9D9D9D;
  line-height: 19px;
  span{
    margin-right: 16px;
  }
}
.uploader{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.iconBox{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  img{
    width: 77px;
  }
  .desc{
    width: 648px;
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
    margin-top: 30px;
    text-align: center;
  }
}
</style>
