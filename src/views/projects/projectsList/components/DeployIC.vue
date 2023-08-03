<template>
  <a-modal v-model:visible="visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Identity verification (IC)</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[10px] text-[14px] text-[#73706E]">
        When executing a deployment on the Internet Computer for the first time, you need to create a developer identity and acquire cycles. 
      </div>
      <div class="mt-[20px]">
        <a-steps :current="currStep" direction="vertical">
          <a-step title="Create a new identity（Auto）" description="The first time you use the Internet Computer, we will automatically create a developer identity for you. Afterwards, whenever you deploy a DApp, you will use this developer identity." />
          <a-step title="Get your cycles">
            <template v-slot:description>
              <div class="mb-[20px]">On the Internet Computer, a cycle is the unit of measurement for resources consumed in the form of processing, memory, storage, and network bandwidth.The Internet Computer’s utility token (ICP) can be converted to cycles.</div>
              
              <a-form class="modal-form]" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
                <a-form-item name="cyclesType">
                  <a-radio-group class="!pl-[1px]" v-model:value="formData.cyclesType">
                    <a-radio :style="radioStyle" value="1">Claim your Free Cycles</a-radio>
                    <a-radio :style="radioStyle" value="2">
                      <div class="w-[100%] flex justify-between">
                        <span>Send some ICP token to get Cycles</span>
                        <a class="text-[16px] font-bold" href="javascript:;" @click="getIcp">How to get ICP?</a>
                      </div>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
                <div class="h-[19px] w-full"></div>
                <div class="p-[20px] flex bg-[#FFF9F2] rounded-[5px]" v-if="formData.cyclesType === '2'">
                  <div class="font-medium text-[#73706E]">
                    <div>Account-ID:</div>
                    <div class="mt-[10px]">Balance(ic): </div>
                  </div>
                  <div class="ml-[10px] text-[#000000]">
                    <div>{{accountId}}
                      <img @click="copyToClipboard(accountId)" src="@/assets/icons/copy.svg" class="h-[19px] ml-[10px] cursor-pointer" />
                    </div>
                    <div class="mt-[10px] flex items-center">{{icpBalance}}
                      <img @click="reloadBalance" src="@/assets/icons/reload.svg" class="h-[19px] ml-[10px] cursor-pointer" />
                      <label v-if="icpBalance.slice(0,-3)==0" class="text-[12px] text-[#FF4A4A] ml-[10px]">Please send some ICP token to get Cycles</label>
                    </div>
                  </div>
                </div>
                <div v-if="formData.cyclesType === '2'" class="px-[20px] py-[10px] flex items-center bg-[#FFEEE8] rounded-[5px] mt-[10px]">
                  <img src="@/assets/images/Fail-2.png" class="h-[24px] mr-[20px]"/>
                  <div>
                    All ICP tokens deposited will be used to purchase cycle products. Please plan your capital allocation prudently.
                  </div>
                </div>
                <a-form-item name="couponCode" v-if="formData.cyclesType === '1'">
                  <template v-slot:label>
                    <div class="!w-full flex justify-between">
                      <div class="text-[#151210]">Coupon code</div>
                      <a href="javascript:;" @click="getCouponCode">How to get Coupon code?</a>
                    </div>
                  </template>
                  <a-input class="modal-input" v-model:value="formData.couponCode" placeholder="Please enter coupon code" allow-clear autocomplete="off" />
                </a-form-item>
              </a-form>
            </template>
          </a-step>
          <a-step title="Verify wallet canister">
            <template v-slot:description>
              <div>Manage the distribution and ownership of cycles through a special type of canister called a cycles wallet. The cycles wallet holds the cycles required to perform operations such as creating new canisters. These operations are executed using the canister principal of the cycles wallet.</div>
              <div class="mt-[20px] flex">
                <div class="font-medium text-[#73706E]">
                  <div>Wallet Canister:</div>
                  <div class="mt-[10px]">Current Balance: </div>
                </div>
                <div class="ml-[10px] text-[#000000]">
                  <div>{{canisterId}}</div>
                  <div class="mt-[10px]">{{cyclesBalance}}</div>
                </div>
              </div>
            </template>
          </a-step>
        </a-steps>
      </div>
      <div class="text-center mt-[32px]">
        <a-button v-if="currStep<3" class="!w-[240px] !h-[43px]" @click="handleNext">Next</a-button>
        <a-button v-else class="!w-[240px] !h-[43px]" @click="showDfxFn">Configure dfx.json</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRefs, onMounted } from 'vue';
import { copyToClipboard } from "@/utils/tool";
import { apiCreateICPIdentity, apiAccountInfo, apiRedeemCoupon, apiWalletInfo, apiRechargeWallet } from '@/apis/canister'
import { message } from 'ant-design-vue'

const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  accountIdFlag:{
    type:Boolean,
    default:false
  },
  walletIdFlag:{
    type:Boolean,
    default:false
  },
  detailId:{
    type:String,
    default:''
  },
});
const { visible, accountIdFlag, walletIdFlag, detailId } = toRefs(props)
const emit = defineEmits(["CancelDeployIC","showDfxFn"])
const currStep = ref(0);
const formRef = ref();
const formData = reactive({
  cyclesType: '1',
  couponCode: '',
});
const accountId = ref()
const icpBalance = ref()
const canisterId = ref()
const cyclesBalance = ref()
const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });

const formRules = computed(() => {
  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message});
  return {
    couponCode: [requiredRule('Please enter coupon code')],
  };
});
const reloadBalance = () => {
  getAccountInfo()
}

const getIcp = ()=>{
//  window.open()
}

const getCouponCode = ()=>{
//  window.open()
}

// 向钱包充钱
const getRechargeWallet = async()=>{
  try {
    const res = await apiRechargeWallet(detailId.value)
    message.success(res.message)
  } catch (error:any) {
    message.error(error.response.data.message)
  }
}

// 通过优惠卷生成钱包罐
const getRedeemCoupon = async()=>{
  try {
    const params:any = {
      coupon: formData.couponCode
    }
    const res = await apiRedeemCoupon(detailId.value,params)
    canisterId.value = res.data.canisterId
    cyclesBalance.value = res.data.cyclesBalance
    message.success(res.message)
  } catch (error:any) {
    message.error(error.response.data.message)
  }
}

const handleNext = async () => {
  if(currStep.value == 0){
    const res = await apiCreateICPIdentity(detailId.value)
    accountId.value = res.data.accountId
    icpBalance.value = res.data.icpBalance
    if(res.code==200){
      currStep.value = 1
    }
  }else if(currStep.value == 1){
    if(formData.cyclesType === '1'){
      await formRef.value.validate();
      await getRedeemCoupon()
      currStep.value = 2
    }else if(formData.cyclesType === '2'){
      getRechargeWallet()
      currStep.value = 2
    }
  }else if(currStep.value == 2){
    // 查询钱包罐信息
    const res = await apiWalletInfo(detailId.value)
    canisterId.value = res.data.canisterId
    cyclesBalance.value = res.data.cyclesBalance
  }else if(currStep.value == 2){

  }
}
const showDfxFn = ()=>{
  emit('showDfxFn')
}
const handleCancel = ()=>{
  emit('CancelDeployIC')
}
// 查询icp信息accountId和余额
const getAccountInfo = async()=>{
  const res = await apiAccountInfo(detailId.value)
  accountId.value = res.data.accountId
  icpBalance.value = res.data.icpBalance
}
onMounted(async()=>{
  // 如果没有icp身份，先创建
  if(!accountIdFlag.value){
    currStep.value = 0
  }else{
    currStep.value = 1
    getAccountInfo()
  }
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
  color: #73706E !important;
  margin-right: 0;
}
:deep(#form_item_cyclesType){
  width: 100%;
}
:deep(span.ant-radio+*){
  padding-right: 0;
  width: 100%;
}
</style>