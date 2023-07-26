<template>
  <a-modal v-model:visible="props.visible" width="760px" :footer="null" @cancel="handleCancel">
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
                    <a-radio :style="radioStyle" value="2">Send some ICP token to get Cycles </a-radio>
                  </a-radio-group>
                </a-form-item>
                <div class="h-[19px] w-full"></div>
                <div class="p-[20px] flex bg-[#FFF9F2] rounded-[5px]" v-if="formData.cyclesType === '2'">
                  <div class="font-medium text-[#73706E]">
                    <div>Account-ID:</div>
                    <div class="mt-[10px]">Balance(ic): </div>
                  </div>
                  <div class="ml-[10px] text-[#000000]">
                    <div>e213184a54…535130a0a4
                      <img @click="copyToClipboard('')" src="@/assets/icons/copy.svg" class="h-[19px] ml-[10px] cursor-pointer" />
                    </div>
                    <div class="mt-[10px] flex items-center">0.0000000 ICP
                      <img @click="reloadBalance" src="@/assets/icons/reload.svg" class="h-[19px] ml-[10px] cursor-pointer" />
                      <label class="text-[12px] text-[#FF4A4A] ml-[10px]">Please send some ICP token to get Cycles</label>
                    </div>
                  </div>
                </div>
                <a-form-item name="couponCode" v-if="formData.cyclesType === '1'">
                  <template v-slot:label>
                    <div class="!w-full flex justify-between">
                      <div class="text-[#151210]">Coupon code</div>
                      <a>How to get Coupon code?</a>
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
                  <div>r3dpl-2yaaa-aaaam-abpsa-cai</div>
                  <div class="mt-[10px]">0.00 T Cycles</div>
                </div>
              </div>
            </template>
          </a-step>
        </a-steps>
      </div>
      <div class="text-center mt-[32px]">
        <a-button class="!w-[240px] !h-[43px]" @click="handleNext">Next</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import{ copyToClipboard } from "@/utils/tool";


const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  }
});
const emit = defineEmits(["CancelDeployIC"])
const currStep = ref(4);
const formRef = ref();
const formData = reactive({
  cyclesType: '1',
  couponCode: '',
});
const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });

const formRules = computed(() => {

  const checkCouponCode = async () => {
    try {
      //校验 couponCode 是否正确
      const res = false;
      if (!res) {
        return Promise.reject("Coupon code not found,please verify that Coupon code is right.");
      } else {
        return Promise.resolve()
      }
    } catch (error: any) {
      console.log("erro:", error)
      return Promise.reject("Coupon code not found,please verify that Coupon code is right.");
    }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    couponCode: [requiredRule('Please enter coupon code'), { validator: checkCouponCode, trigger: "change" }],
  };
});
const reloadBalance = () => {
  console.log("");
}
const handleNext = async () => {
  await formRef.value.validate();
}
const handleCancel = ()=>{
  emit('CancelDeployIC')
}
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