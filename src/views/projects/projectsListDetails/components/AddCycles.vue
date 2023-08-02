<template>
  <a-modal v-model:visible="visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Add Cycles</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[30px]">
        <a-form class="modal-form" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
          <a-form-item name="canisterID" label="Canister ID">
              <a-input disabled="true" class="modal-input" v-model:value="formData.canisterId" placeholder="Please enter Canister Name" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item name="amount" label="Amount">
              <a-input class="modal-input" v-model:value="formData.amount" suffix="T Cycles" placeholder="Please enter amount" allow-clear autocomplete="off" />
          </a-form-item>
        </a-form>
        <div class="bg-[#FFF9F2] rounded-[5px] p-[20px]">
          <div>Cycles Wallet Info</div>
          <div class="flex mt-[10px]">
            <div class="font-medium text-[#73706E]">
              <div>Wallet Canister:</div>
              <div class="mt-[10px]">Current Balance: </div>
            </div>
            <div class="ml-[10px] text-[#000000]">
              <div>{{walletCanisterId}}</div>
              <div class="mt-[10px]">{{walletCyclesBalance}} T Cycles</div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-[32px]">
        <a-button class="!w-[240px] !h-[43px]" ghost @click="showBuyCycles">Buy Cycles</a-button>
        <a-button class="!w-[240px] !h-[43px] ml-[24px]" @click="handleTopUp">Top Up</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { computed, reactive, ref, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiWalletInfo, apiRechargeCanister } from '@/apis/canister'
  
const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  canisterId:{
    type:String,
    default:''
  },
  cycles:{
    type:String,
    default:''
  }
});
const route = useRoute()
const id:any = route.params.id
const { visible, canisterId, cycles } = toRefs(props)
const emit = defineEmits(["handleCancel", 'showBuyCycles'])
const formRef = ref();
const formData = reactive({
  canisterId: 'r3dpl-2yaaa-aaaam-abpsa-cai',
  amount: 0.1,
});
const walletCanisterId = ref()
const walletCyclesBalance = ref()

const formRules = computed(() => {

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    amount: [requiredRule('Please enter Amount')],
  };
});

const handleTopUp = async() => {
  const res = await apiRechargeCanister(id,formData)
  if(res.code==200){
    message.success(res.message)
  }else{
    message.error(res.message)
  }
}
const showBuyCycles = () => {
  emit('handleCancel')
  emit('showBuyCycles')

}
const handleCancel = ()=>{
  emit('handleCancel')
}

const getWalletInfo = async()=>{
  const res = await apiWalletInfo(id)
  walletCanisterId.value = res.data.canisterId
  walletCyclesBalance.value = res.data.walletCyclesBalance
}

onMounted(()=>{
  formData.canisterId = canisterId.value
  // formData.amount = cycles.value
  getWalletInfo()
})
</script>
<style scoped lang="less">
:deep(.ant-form-item-label > label){
  font-size: 14px;
  font-weight: 400;
}
</style>