<template>
    <a-modal v-model:visible="props.showCreateSub" title="Create Subscription" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelCreateSub"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Network" name="network" >
                <a-select @change="setSubNetwork" v-model:value="formData.network" placeholder="Please select Network" autocomplete="off"
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
import { ethers } from 'ethers';
const props = defineProps({
    showCreateSub:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subNetOptions = ref(['Ethererum Mainnet','Ethererum Testnet','BSC Mainnet','BSC Testnet'])
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
    // await formRef.value.validate();
    // 判断是否安装小狐狸钱包
    if (window.ethereum) {
        try{
            // 请求用户授权
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.enable();
            console.log('成功连接 MetaMask！');
        }catch(error:any){
            console.error('无法连接 MetaMask: ', error);
        }
    } else {
        window.open('https://chrome.google.com/webstore/search/metamask')
    }
    emit('getCreateSubInfo',formData)
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