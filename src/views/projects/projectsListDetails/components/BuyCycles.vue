<template>
  <a-modal v-model:visible="props.visible" width="900px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Buy Cycles</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[40px]">
        <a-steps :current="currStep">
          <a-step title="Send ICP Tokens" />
          <a-step title="Convert ICP Tokens to Cycles" />
          <a-step title="verify wallet canister" />
        </a-steps>
        <div class="mt-[20px]">
          <div v-if="currStep === 0">
            <div class="text-[#A4A5A8]">Get the account identifier for your developer identity. Then, you can copy  your account number to send some ICP Tokens. When finished, click “Next” button.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex justify-between">
              <div>
                <span class="text-[#73706E] font-medium">Account-ID:</span>
                <span class="ml-[10px]">{{accountId}}</span>
              </div>
              <img @click="copyToClipboard(accountId)" src="@/assets/icons/copy.svg" class="h-[19px] ml-[10px] cursor-pointer" />
            </div>
            <div class="p-[20px] mt-[20px] bg-[#FFEEE8] rounded-[5px] flex">
              <img src="@/assets/images/Fail-2.png" class="h-[24px] mr-[20px]"/>
              <div>All ICP tokens deposited will be used to purchase cycle products. Please plan your capital allocation prudently.</div>
            </div>
          </div>
          <div v-else-if="currStep === 1">
            <div class="text-[#A4A5A8]">Check your account balance.Then, click ”Next” button to convert those ICP tokens to cycles and move them into a cycles wallet.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex">
              <div class="text-[#73706E] font-medium">
                <div>Account-ID:</div>
                <div class="mt-[10px]">Balance(ic):</div>
              </div>
              <div class="ml-[10px]">
                <div>{{accountId}}</div>
                <div class="mt-[10px]">{{icpBalance}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="currStep === 2">
            <div class="text-[#A4A5A8]">Check your account balance.Then, you can convert those ICP tokens to cycles and move them into a cycles wallet.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex">
              <div class="text-[#73706E] font-medium">
                <div>Wallet Canister: </div>
                <div class="mt-[10px]">Balance:</div>
              </div>
              <div class="ml-[10px]">
                <div>{{walletCanisterId}}</div>
                <div class="mt-[10px]">{{walletCyclesBalance}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-[32px]" :class="[currStep === 2 ? 'text-center' : currStep > 0 ? 'flex justify-between' : 'text-right']">
        <a-button v-if="currStep === 1" class="!w-[240px] !h-[43px]" ghost @click="handleLast">Previous</a-button>
        <a-button :loading="loading" v-if="currStep < 2" class="!w-[240px] !h-[43px]" @click="handleNext">Next</a-button>
        <a-button v-if="currStep == 2" class="!w-[240px] !h-[43px]" @click="handleDone">Done</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { copyToClipboard } from "@/utils/tool";
import { apiAccountInfo, apiWalletInfo, apiRechargeWallet } from '@/apis/canister'
import { message } from 'ant-design-vue';

const route = useRoute()
const id:any = route.params.id
const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  }
});
const emit = defineEmits(["handleCancel"])
const currStep = ref(0);
const accountId = ref()
const icpBalance = ref()
const walletCanisterId = ref()
const walletCyclesBalance = ref()
const loading = ref(false)
const handleLast = () => {
  currStep.value--;
  if(currStep.value==1 || currStep.value==0){
    getAccountInfo()
  }else if(currStep.value==2){
    getWalletInfo()
  }
}
const handleNext = async() => {
  if(currStep.value==0){
    getAccountInfo()
    currStep.value = 1;
  }else if(currStep.value==1){
    loading.value = true
    // getWalletInfo()
    await getRechargeWallet()
    loading.value = false
  }
}
const handleDone = () => {
  currStep.value = 0;
  emit('handleCancel')
}
const handleCancel = () => {
  currStep.value = 0;
  emit('handleCancel')
}

// 向钱包充钱
const getRechargeWallet = async()=>{
  try {
    const res = await apiRechargeWallet(id)
    walletCanisterId.value = res.data.canisterId
    walletCyclesBalance.value = res.data.cyclesBalance
    message.success(res.message)
    currStep.value = 2;
  } catch (error:any) {
    message.error(error.response.data.message)
  }
}

// 查询钱包罐信息
const getWalletInfo = async()=>{
  const res = await apiWalletInfo(id)
  walletCanisterId.value = res.data.canisterId
  walletCyclesBalance.value = res.data.cyclesBalance
}

// 查询账号信息
const getAccountInfo = async()=>{
  const res = await apiAccountInfo(id)
  accountId.value = res.data.accountId
  icpBalance.value = res.data.icpBalance
}

onMounted(()=>{
  getAccountInfo()
})
</script>
<style scoped lang="less">
:deep(.ant-form-item-label>label){
  width: 100%;
}
:deep(.ant-form-item){
  margin-bottom: 0px;
}
:deep(.ant-radio-wrapper-checked span){
  color: #151210;
}
:deep(.ant-radio-wrapper){
  color: #73706E;
}
</style>