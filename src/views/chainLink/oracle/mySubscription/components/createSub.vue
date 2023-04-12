<template>
    <a-modal v-model:visible="props.showCreateSub" title="Create Subscription" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelCreateSub"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Network" name="network" >
                <a-select @change="setSubNetwork" v-model:value="formData.network" placeholder="Choose" autocomplete="off"
                :options="subNetOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Subscription Name" name="name" >
                <a-input v-model:value="formData.name" placeholder="Please input Subscription Name" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="margin-right: 20px;" @click="handleCreateSub">Confirm</a-button>
            <a-button class="done-btn" style="background: transparent;color:#E2B578" @click="cancelCreateSub">Cancel</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="createSub">
import { ref, onMounted, computed, reactive } from 'vue'
import { useContractApi } from "@/stores/chainlink";
import { apiCreateSub,updateSub } from '@/apis/chainlink'
import { message } from 'ant-design-vue';
// 用于后端映射创建和更新订阅
const id = ref<number>()
const contractApi = useContractApi()
const props = defineProps({
    showCreateSub:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subNetOptions = ref(['Ethereum Sepolia Testnet','Polygon Mumbai Testnet'])
const formData = reactive({
    network: null,
    name: '',
});
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        name: [requiredRule('Name')],
        network: [requiredRule('Network')],
    };
});
const emit = defineEmits(['closeCreateSub','getCreateSubInfo'])
console.log('showCreateSub',props.showCreateSub)
// 设置订阅网络
const setSubNetwork = (val:any)=>{
    console.log('设置订阅网络',val)
    formData.network = val
}
// 创建订阅
const handleCreateSub = async()=>{
    await formRef.value.validate();
    if (contractApi.apiStatus) {
    // spinning.value = true;
    // 钱包地址
    const walletAd = localStorage.getItem('walletAccount');
    const tx = contractApi.registryApi?.createSubscription().then(async(tx:any)=>{
        const chainNetArr = formData?.network?.split(' ')
        const params = {
            chain:chainNetArr[0],
            network:chainNetArr.slice(1,chainNetArr.length).join(' '),
            name:formData.name,
            // subscriptionId:'',
            admin:walletAd,
            transactionTx:tx.hash
        } 
        console.log('tx111111',tx)
        // 创建订阅存入后端接口   
        const res = await apiCreateSub(params)
        console.log('创建订阅存入后端接口',res)
        id.value = res.data
        return tx.wait()
    }).then(async(receipt:any) => {
      const events = contractApi.registryApi?.contract.interface.parseLog(receipt.logs[0]);
        // 订阅id
      const currentsubscriptionId = events.args[0].toNumber();
      const chainNetArr = formData?.network?.split(' ')
      console.log("receipt:",currentsubscriptionId,receipt.transactionHash,chainNetArr,receipt);
      const params = {
        chain:chainNetArr[0],
        network:chainNetArr.slice(1,chainNetArr.length).join(' '),
        id:id.value,
        chainSubscriptionId:currentsubscriptionId,
        newStatus:'success',
        transactionTx:receipt.transactionHash
      }
      console.log('params',params)
      const res = await updateSub(params)
      if(res.code===200){
            message.success(res.message)
        }else{
            message.error(res.data)
        }
    }, (error:any) => {
      console.log('error',error)
    //   spinning.value = false;
    });
    } else{
        console.log(123456)
    }
    // emit('getCreateSubInfo',formData)
    emit('closeCreateSub',false)
}
// 取消订阅
const cancelCreateSub = ()=>{
    emit('closeCreateSub',false)
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