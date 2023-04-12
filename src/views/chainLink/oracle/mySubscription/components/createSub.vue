<template>
    <a-modal v-model:visible="props.showCreateSub" title="Create Subscription" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelCreateSub"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Network" name="network" >
                <a-select @change="setSubNetwork" v-model:value="formData.network" placeholder="Choose" autocomplete="off"
                :options="subNetOptions" allow-clear></a-select>
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
// ETH
// networkData.value = [{ name: 'mainnet', id: '1' }, { name: 'Testnet/Goerli', id: '5' }, { name: 'Testnet/Sepolia', id: 'aa36a7' }, {name: 'Testnet/Hamster',networkName: 'Hamster Moonbeam', id: '501', url: 'https://rpc-moonbeam.hamster.newtouch.com'}]
const subNetOptions = ref([{ label: 'Ethereum Sepolia Testnet', value: 'aa36a7' },{ label: 'Polygon Mumbai Testnet', value: '13881' },{label: 'Hamster Moonbeam',networkName: 'Hamster Moonbeam', value: '501', url: 'https://rpc-moonbeam.hamster.newtouch.com'}])
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
    const network = `0x${formData.network}`
    console.log('~~~~',ethereum.chainId,network)
    // 如果网络id不一样，需要调小狐狸进行网络切换
    if (ethereum.chainId !== network) {
    // switchToChain(formData.network)
    } else {
        // setContractFactory('')
    }
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
// const switchToChain = async (chainId: string) => {
//   window.ethereum && window.ethereum.request({
//     method: "wallet_switchEthereumChain",
//     params: [{ chainId: `0x${chainId}` }],
//   }).then((res: any) => {
//     loading.value = false;
//     message.success('success');
//     // console.info(res, '成功')
//   }).catch((err: any) => {
//     if (err.code === 4902) {
//       message.info('Please add the network first');
//       addToChain(chainId)
//     } else {
//       message.error('faild')
//     }
//   })
// }
// const addToChain = (chainId: string) => {
//     window.ethereum && window.ethereum.request({
//     method: "wallet_addEthereumChain",
//     params: [
//         {
//         chainId: `0x${chainId}`,
//         chainName: chainName.value,
//         rpcUrls: [rpcUrl.value],
//         // nativeCurrency: {
//         //   name: 'Hm',
//         //   symbol: 'M',
//         //   decimals: 18,
//         // },
//         },
//     ],
//     }).then((res: any) => {
//     message.info('successfully added')
//     // console.log(res)
//     }).catch((err: any) => {
//     console.log(err.code, 'code')
//     if (err.code === 4001) {
//         message.info('Cancel adding a network')
//     } else {
//         message.info('faild')
//     }
//     }).finally(() => {
//     loading.value = false;
//     message.success('success')
//     }).catch((err: any) => {
//     message.success('faild')
//     })
// }
// const setContractFactory = async (nameData: any) => {
//   let promise: any = [];
//   nameData.map((item: number) => {
//     formState.name.push(item.id);
//     let selectItem: any = projectsContractData.find(val => { return val.id === item.id });
//     // console.log(selectItem, 'selectItem')
//     promise.push(contractFactory(selectItem.abiInfoData, selectItem.byteCode, argsMap.get(selectId.value), item.id));
//   })
//   const res = await Promise.all(promise)
//   loading.value = false;
//   const result = res.some(it => {
//     return it !== undefined
//   })
//   result ? router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`) : loading.value = false
// }
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