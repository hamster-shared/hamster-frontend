<template>
    <a-modal v-model:visible="props.showCreateSub" title="Create Subscription" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelCreateSub"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Network" name="network" >
                <a-select @change="setSubNetwork" v-model:value="formData.network" placeholder="Choose" autocomplete="off"
                :options="subNetOptions" allow-clear class="sel"></a-select>
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
import { message } from 'ant-design-vue'
import { switchToChain } from '@/utils/changeNetwork'
import { useRouter  } from 'vue-router';
const { ethereum } = window;
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
const chainName = ref()
const rpcUrl = ref()
const router = useRouter()
// ETH
// 经产品要求，隐藏掉这个网络{label: 'Hamster Moonbeam Testnet',networkName: 'Hamster Moonbeam', value: '501', url: 'https://rpc-moonbeam.hamster.newtouch.com'}
// networkData.value = [{ name: 'mainnet', id: '1' }, { name: 'Testnet/Goerli', id: '5' }, { name: 'Testnet/Sepolia', id: 'aa36a7' }, {name: 'Testnet/Hamster',networkName: 'Hamster Moonbeam', id: '501', url: 'https://rpc-moonbeam.hamster.newtouch.com'}]
const subNetOptions = ref([{ label: 'Ethereum Sepolia Testnet', value: 'aa36a7',url:'https://eth-sepolia.g.alchemy.com/v2/demo' },{ label: 'Polygon Mumbai Testnet', value: '13881',url:'https://rpc-mumbai.maticvigil.com' }])
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
const setSubNetwork = (val:any,option:any)=>{
    console.log('设置订阅网络',val,option)
    formData.network = option.label
    const network = `0x${val}`
    chainName.value = option.label
    rpcUrl.value = option.url
    console.log('~~~~',ethereum.chainId,network)
    // 如果网络id不一样，需要调小狐狸进行网络切换
    if (ethereum.chainId !== network) {
        switchToChain(network,chainName.value,rpcUrl.value)
    }
}
// 创建订阅
const handleCreateSub = async()=>{
    await formRef.value.validate();
    // 钱包地址
    const walletAdr = localStorage.getItem('walletAccount');
    console.log('walletAdr',walletAdr,contractApi)
    const tx = contractApi.registryApi?.createSubscription().then(async(tx:any)=>{
        const chainNetArr = formData?.network?.split(' ')
        const params = {
            chain:chainNetArr[0],
            network:chainNetArr.slice(1,chainNetArr.length).join(' '),
            name:formData.name,
            // subscriptionId:'',
            admin:walletAdr,
            transactionTx:tx.hash
        } 
        console.log('tx111111',tx)
        // 创建订阅存入后端接口   
        const res = await apiCreateSub(params)
        if(res.code===200){
            message.success(res.message)
        }else{
            message.error('Failed')
        }
        emit('closeCreateSub',false)
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
            emit('getCreateSubInfo',true)
        }else{
            message.error('Failed '+res.data)
        }
    }, (error:any) => {
      message.error('Failed')
      emit('closeCreateSub',false)
      console.log('error',error)
    });
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