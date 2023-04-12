<template>
    <a-modal v-model:visible="props.showAddFund" title="Add Funds" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions" allow-clear></a-select>
            </a-form-item>
            <div class="flex justify-end -mt-[20px] mb-2">Blance:<span class="text-[#FF4A4A]">{{subBalance}}link</span></div>
            <a-form-item label="Amount" name="amount" >
                <a-input v-model:value="formData.amount" placeholder="Please enter the amount" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="flex justify-end -mt-[20px] mb-2">Blance:<span class="text-[#E2B578]">{{balance}}link</span></div>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="margin-right: 20px;" @click="handleFund">Confirm</a-button>
            <a-button class="done-btn" style="background: transparent;color:#E2B578" @click="cancelFund">Cancel</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="addFunds">
import { ref, onMounted, computed, reactive } from 'vue'
import { consumerSublist,apiPayFund,updateFund } from '@/apis/chainlink'
import { useContractApi } from "@/stores/chainlink";
import { ethers } from "ethers";
import { message } from 'ant-design-vue';
const subOptionsNet = ref('Network')
// 订阅id
const subId = ref()
// 主键id
const keyId = ref()
// Penning id
const temId = ref()
const contractApi = useContractApi()
const { registryApi, linkTokenApi, walletAddress } = useContractApi()
const props = defineProps({
    showAddFund:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subOptions = ref([])
const formData = reactive({
    subscription: null,
    amount: '',
});
// 订阅号余额
const subBalance = ref()
const balance = ref()
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        amount: [requiredRule('Amount')],
    };
});
const emit = defineEmits(['closeAddFund','getAddFundInfo'])
console.log('showAddFund',props.showAddFund)
// 获取订阅数据
const getSublistData = async()=>{
    const res = await consumerSublist()
    console.log('获取订阅数据',res)
    if(res.code===200 && res.data?.length){
        subOptions.value = res.data.map((item:any)=>{
            let tem = item.name+'('+item.chain+' '+item.network+')'+'_'+item.id
            return {
                label:tem,
                value:item.id
            }
        })
    }
}
// 设置订阅号
const setSubscription = (val:any,option:any)=>{
    subOptionsNet.value = option?.label?.substring(option?.label?.indexOf("(")+1,option?.label?.indexOf(")"));
    subId.value = option?.label?.substring(option?.label?.indexOf("_")+1,option?.label?.length);
    keyId.value = val
    console.log('设置订阅号',subOptionsNet.value,111111,subId.value)
    registryApi?.getSubscription(subId.value).then((t:any) => {
        subBalance.value = ethers.utils.formatEther(t.balance);
    })
}
// 给订阅号添加资金
const handleFund = async()=>{
    await formRef.value.validate();
    let data = ethers.utils.defaultAbiCoder.encode(["uint64"], [subId.value]);
    const weiValue = ethers.utils.parseEther(formData.amount.toString());
    if (contractApi.apiStatus) {
        linkTokenApi?.transferAndCall(registryApi?.contract.address, weiValue, data).then(async(tx:any)=>{
            const params = {
                transactionTx:tx.hash,
                incr:formData.amount
            }
            console.log('tx',tx,'params',params)
            const res = await apiPayFund(keyId.value,params)
            temId.value = res.data
            return tx.wait()
        }).then(async(receipt:any) => {
            console.log("receipt",receipt);
            const params = {
                id:temId.value,
                subscriptionId:keyId.value,
                transactionTx: receipt.transactionHash,
                newStatus:'success',
            }
            const res = await updateFund(params)
            if(res.code===200){
                message.success(res.message)
            }else{
                message.error(res.data)
            }
        })
    }
    emit('getAddFundInfo',formData)
    emit('closeAddFund',false)
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeAddFund',false)
}
// 获取钱包总金额
const totalMoney = ()=>{
    contractApi.apiStatus && linkTokenApi?.balanceOf(walletAddress).then((b:any) => {
        balance.value = ethers.utils.formatEther(b);
    })
}
onMounted(()=>{
    getSublistData()
    totalMoney()
})
</script>
<style lang="less" scoped>
.done-btn {
    width: 120px;
    height: 43px;
}
&:deep(.ant-select-selection-item){
    color:#36322D !important;
}
</style>