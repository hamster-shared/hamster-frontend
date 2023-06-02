<template>
    <a-modal v-model:visible="props.showTestSub" title="Test" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Subscription" name="subscription" >
                <a-select dropdownClassName="modal-select-dropdown" @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Consumers" name="consumers" >
                <a-select dropdownClassName="modal-select-dropdown" @change="setConsumers" show-search v-model:value="formData.consumers" placeholder="Please input contract address" autocomplete="off"
                :options="conOptions" allow-clear></a-select>
                <div v-if="false" class="w-[100%] bg-[#FFF9F2] p-[10px] mt-[10px]" style="border:1px solid #E2B578;border-radius: 8px;">
                    The contract address needs to be added to the current Subsripion to complete the test, please ask whether to continue to complete the binding relationship.
                    <div class="open-link-css flex justify-end cursor-pointer" @click="bind">Binding</div>
                </div>
            </a-form-item>
            <a-form-item label="Secrets Loaction" name="secretsLoaction" >
                <a-select dropdownClassName="modal-select-dropdown" @change="setLoaction" v-model:value="formData.loaction" placeholder="Please select a loaction" autocomplete="off"
                :options="loactionOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item v-if="formData.loaction=='Inline'" label="Secrets" name="secrets" >
                <div>
                    <a-input-group>
                        <a-row :gutter="8" v-for="item in formData.secretArr" class="mt-[5px]">
                            <a-col :span="11">
                                <a-input v-model:value="item.secretName" allow-clear autocomplete="off" />
                            </a-col>
                            <a-col :span="11">
                                <a-input v-model:value="item.secretValue" allow-clear autocomplete="off" />
                            </a-col>
                            <a-col :span="2" class="cursor-pointer" @click="addSecret(item)">
                                <svg-icon style="border:#E2B578" :name="item.icon" size="40" class="mr-[10px]" />
                            </a-col>
                        </a-row>
                    </a-input-group>
                </div>
            </a-form-item>
            <a-form-item v-if="formData.loaction=='Remote'" label="SecretURL" name="secreturl" >
                <a-input v-model:value="formData.secreturl" allow-clear autocomplete="off" />
            </a-form-item>
            <a-form-item v-for="(item,index) in formData.args" :label="item.key" >
                <a-input v-model:value="item.value" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="background: transparent;color:#E2B578" @click="cancelFund">Cancel</a-button>
            <a-button class="done-btn" style="margin-left: 20px;" @click="handleSend">Send</a-button>
        </div>
    </a-modal>
    <a-modal v-model:visible="confirmShow" title="Confirm again" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelToCheck"/>
        </template>
        <div>Please confirm the information is correct.</div>
        <div class="text-center flex justify-center mt-[20px]">
            <a-button class="done-btn" style="margin-right: 20px;background: transparent;color:#E2B578" @click="cancelToCheck">Recheck</a-button>
            <a-button class="done-btn" @click="handleConfirm">Confirm</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="testSub">
import { ref, onMounted, computed, reactive,watch,shallowRef } from 'vue'
import { consumerSublist,testConsumerSub,apiExecSub,updateTestSub } from '@/apis/chainlink'
import { ConsumerApi } from '../chainApi/consumerApi'
import {  useContractApi } from "@/stores/chainlink";
// import { encryptWithPublicKey } from "@/utils/encryptSecrets";
import { networkConfig } from "../chainApi/contractConfig";
import { ethers } from "ethers";
import { message } from 'ant-design-vue';
import { switchToChain } from '@/utils/changeNetwork'
const { ethereum } = window;
const props = defineProps({
    showTestSub:{
        type:Boolean,
        default:false
    },
    column:{
        type:Object,
        required:true
    }
})
const contractApi = useContractApi();
const consumerApi = shallowRef();
const formRef = ref();
const subOptions = ref([])
const conOptions = ref([])
const loactionOptions = ref(['Inline','Remote'])
const addIcon = ref("@/assets/svg/add.svg")
const confirmShow = ref(false)
// 订阅id
const subId = ref()
// 主键id
const keyId = ref()
// 临时id
const temId = ref()
const consumerAddress = ref()
const network = ref()
// record表单数据
const record = ref<any>({})
const formData = reactive<any>({
    subscription: null,
    consumers: null,
    loaction: 'Inline',
    secrets: '',
    secretArr: [
        {
            secretName:'',
            secretValue:'',
            icon:'add'
        }
    ],
    secreturl:'',
    args: [],
});
watch(()=>props.column.value,(newVal,oldVal)=>{
    console.log('watch',newVal)
})
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        consumers: [requiredRule('Consumers')],
    };
});
const emit = defineEmits(['closeTestSub','getTestSubInfo'])
console.log('showTestSub',props.showTestSub,props.column.value)
// 获取订阅数据
const getSublistData = async()=>{
    const res = await consumerSublist()
    if(res.code===200 && res.data?.length){
        subOptions.value = res.data.map((item:any)=>{
            let tem = item.name+'('+item.chainAndNetwork+')'+'_'+item.id
            return {
                label:tem,
                value:item.id,
                subNetName:item.chainAndNetwork,
                subNetId:item.networkId,
                subId:item.chainSubscriptionId
            }
        })
    }
    console.log('获取订阅数据',res)
}
// 绑定
const bind = ()=>{}
// 设置订阅号
const setSubscription = (val:any,option:any)=>{
    const subOptionsNet = option?.label?.substring(option?.label?.indexOf("(")+1,option?.label?.indexOf(")"));
    const net = subOptionsNet.split(' ') 
    network.value=net.slice(1,net.length).join(' '),
    subId.value = option?.subId
    keyId.value = val
    const netId = `0x${option.subNetId}`
    if (ethereum.chainId !== netId) {
        switchToChain(netId,option.subNetName,option.networkUrl)
    }
    getTestConsumerSub(keyId.value)
    console.log('设置订阅号',val,option,network.value)
}
// 获取consumer数据
const getTestConsumerSub = async(id:string|number)=>{
    const res = await testConsumerSub(id)
    if(res.code===200 && res.data.length){
        conOptions.value = res.data.map((item:any)=>{
            return {
                label:item,
                value:item
            }
        })
    }else{
        conOptions.value = []
    }
}
// 设置consumer地址
const setConsumers = (val:string,option:any)=>{
    consumerAddress.value = val
    console.log('设置consumer地址',val,option)
    consumerApi.value = new ConsumerApi(contractApi.provider, val);
    console.log('11111111设置consumer地址',consumerApi.value)
}
// 添加secret
const addSecret = (item:any)=>{
    if(item.icon=='add'){
        formData.secretArr.push({
            secretName:'',
            secretValue:'',
            icon:'reduce'
        })
    }else if(item.icon=='reduce' && formData.secretArr.length>1){
        console.log('~~~~~',item,formData.secretArr)
        formData.secretArr= formData.secretArr.filter((i:any)=>{
            if(i.secretName == item.secretName){

            }else{
                return item
            }
        })
        if(formData.secretArr.length==0){
            formData.secretArr.push({
                secretName:'',
                secretValue:'',
                icon:'add'
            })
        }
        console.log('aaaaa',formData.secretArr)
    }
    
}
// 设置loaction
const setLoaction = (val:any)=>{
    console.log('设置loaction',val)
    formData.loaction = val
}
// 发送
const handleSend = async()=>{
    await formRef.value.validate();
    console.log('handleSend',formData,network.value)
    confirmShow.value = true
}
// 返回检查
const cancelToCheck = ()=>{
    confirmShow.value = false
}
// const buildSecrets = async (secrets:string, secretsURLs:string, secretsLocation:number) => {
//   const DONPublicKey = networkConfig[contractApi.networkId].functionsPublicKey;
//   const provider = new ethers.providers.Web3Provider(contractApi.provider)
//   const singer = provider.getSigner();
//   if (secretsLocation === 0) {
//     console.log("secrets", secrets)
//     if (Array.isArray(secrets) && secrets.length > 0 && secrets[0].key) {
//       console.log("secrets", secrets)
//       const obj = secrets.reduce((acc, cur) => {
//         acc[cur.key] = cur.value;
//         return acc;
//       }, {});
//       const message = JSON.stringify(obj);
//       const messageHash = ethers.utils.solidityKeccak256(['string'], [message])
//       const signature = await singer.signMessage(ethers.utils.arrayify(messageHash))
//       const payload = {
//         message,
//         signature,
//       };
//       return "0x" + await encryptWithPublicKey(DONPublicKey, JSON.stringify(payload));
//     }
//   }
//   if (secretsLocation === 1) {
//     if (Array.isArray(secretsURLs) && secretsURLs.length > 0) {
//       return "0x" + await encryptWithPublicKey(DONPublicKey, secretsURLs.join(" "))
//     }
//   }
//   return "0x";
// }
// 确定提交
const handleConfirm = async()=>{
    const gasLimit = 100000;
    console.log('确定提交')
    let secretsloction = formData.loaction == 'Inline' ? 0:1
    const argsArray = formData.args.map((item:any)=>{
        return item.value
    })
    const secretArr = formData.secretArr.map((item:any)=>{
        return {
            secretName:item.secretName,
            secretValue:item.secretValue,
        }
    })
    // secretUrl 根据secretsloction 判断
    // 如果secretsloction='Inline' secretUrl是页面的key:value，Json.strifgy转成字符串
    // 如果secretsloction='Remote' secretUrl是页面的input框收集的数据
    // 多个请求参数是用 ，分隔开，拼成一个字符串
    let secretUrl = ''
    if(formData.loaction == 'Inline'){
        secretUrl = JSON.stringify(secretArr)
    }else{
        secretUrl = formData.secreturl
    }
    consumerApi.value.executeRequest(record.value.script, '0x', secretsloction, argsArray, subId.value, gasLimit).then((tx:any)=>{
        const params = {
            subscriptionId:parseInt(keyId.value),
            secretsloction,
            secretUrl,
            args:argsArray.length ? argsArray.join(','):'',
            requestName:record.value.name,
            requestId:'',
            amount:0,
            transactionTx: tx.hash,
            consumerAddress: consumerAddress.value,
            network:network.value
        }
       apiExecSub(params).then((res)=>{
            if(res.code===200){
                temId.value = res.data
                message.success(res.message)
            }else{
                message.error('Failed '+res.message)
            }
            emit('closeTestSub',false)
            console.log("~~~~~tx",tx)
        })
        return tx.wait()
    }).then((receipt:any) => {
        console.log('receipt~~~~~',receipt)
        consumerApi.value.latestRequestId().then(async(execId:any) => {
            console.log('execId',execId)
            const params = {
                requestId:execId,
                network:network.value
            }
            const res = await updateTestSub(temId.value,params)
            if(res.code===200){
                message.success('The test request has been sent successfully, and the result will be sent to your email address mailbox, please check it.')
                emit('getTestSubInfo',formData)
            }else{
                message.error(res.data)
            }
        })
    }).catch((err:any)=>{
        message.error("Failed")
        emit('closeTestSub',false)
        console.log(err)
    })
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeTestSub',false)
}
onMounted(()=>{
    getSublistData()
    record.value = JSON.parse(localStorage.getItem('record'))
    for(let i=1;i<=record.value.paramsCount;i++){
        formData.args.push({
            key:'Arg'+i,
            value:''
        })
    }
    console.log(11212121,formData.args,record.value)
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
&:deep(.ant-form){
    padding-right: 44px !important;
}
</style>