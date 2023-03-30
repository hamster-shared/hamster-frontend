<template>
    <a-modal v-model:visible="props.showAddFund" title="Add Funds" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Amount" name="amount" >
                <a-input v-model:value="formData.amount" placeholder="Please enter the amount" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="margin-right: 20px;" @click="handleFund">Confirm</a-button>
            <a-button class="done-btn" @click="cancelFund">Cancel</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="createSub">
import { ref, onMounted, computed, reactive } from 'vue'
const props = defineProps({
    showAddFund:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subOptions = ref(['Ethererum Mainnet','Ethererum Testnet','BSC Mainnet','BSC Testnet'])
const formData = reactive({
    subscription: null,
    amount: '',
});
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        amount: [requiredRule('Amount')],
    };
});
const emit = defineEmits(['closeAddFund','getAddFundInfo'])
console.log('showAddFund',props.showAddFund)
// 设置订阅号
const setSubscription = (val:any)=>{
    console.log('设置订阅号',val)
    formData.subscription = val
}
// 给订阅号添加资金
const handleFund = async()=>{
    await formRef.value.validate();
    emit('getAddFundInfo',formData)
    emit('closeAddFund',false)
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeAddFund',false)
}
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