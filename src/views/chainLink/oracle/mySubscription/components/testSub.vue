<template>
    <a-modal v-model:visible="props.showTestSub" title="Test" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Consumers" name="consumers" >
                <a-select @change="setSubscription" show-search v-model:value="formData.consumers" placeholder="Please input contract address" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
                <div class="w-[100%] bg-[#FFF9F2] p-[10px] mt-[10px]" style="border:1px solid #E2B578;border-radius: 8px;">
                    The contract address needs to be added to the current Subsripion to complete the test, please ask whether to continue to complete the binding relationship.
                    <div class="text-[#E2B578] flex justify-end cursor-pointer" @click="bind">Binding</div>
                </div>
            </a-form-item>
            <a-form-item label="Secrets Loaction" name="secretsLoaction" >
                <a-select @change="setLoaction" v-model:value="formData.loaction" placeholder="Please select a loaction" autocomplete="off"
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
            <a-form-item v-for="(item,index) in formData.args" :label="item" >
                <a-input v-model:value="item.args" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="margin-right: 20px;" @click="handleFund">Send</a-button>
            <a-button class="done-btn" style="background: transparent;color:#E2B578" @click="cancelFund">Cancel</a-button>
        </div>
    </a-modal>
    <a-modal v-model:visible="confirmShow" title="Confirm again" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelToCheck"/>
        </template>
        <div>Please confirm the information is correct.</div>
        <div class="text-center flex justify-center mt-[20px]">
            <a-button class="done-btn" style="margin-right: 20px;" @click="cancelToCheck">Recheck</a-button>
            <a-button class="done-btn" @click="handleConfirm">Confirm</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="testSub">
import { ref, onMounted, computed, reactive } from 'vue'
const props = defineProps({
    showTestSub:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subOptions = ref(['Ethererum Mainnet','Ethererum Testnet','BSC Mainnet','BSC Testnet'])
const loactionOptions = ref(['Inline','Remote'])
const addIcon = ref("@/assets/svg/add.svg")
const confirmShow = ref(false)
const formData = reactive<any>({
    subscription: null,
    consumers: '',
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
    args: ['Arg1','Arg2','Arg3'],
});
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        consumers: [requiredRule('Consumers')],
    };
});
const emit = defineEmits(['closeTestSub','getTestSubInfo'])
console.log('showTestSub',props.showTestSub)
// 绑定
const bind = ()=>{}
// 设置订阅号
const setSubscription = (val:any)=>{
    console.log('设置订阅号',val)
    formData.subscription = val
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
        console.log('aaaaa',formData.secretArr)
    }
    
}
// 减少secret
const removeSecret = ()=>{}
// 设置loaction
const setLoaction = (val:any)=>{
    console.log('设置loaction',val)
    formData.loaction = val
}
// 给订阅号添加资金
const handleFund = async()=>{
    await formRef.value.validate();
    confirmShow.value = true
}
// 返回检查
const cancelToCheck = ()=>{
    confirmShow.value = false
}
// 确定提交
const handleConfirm = ()=>{
    emit('getTestSubInfo',formData)
    emit('closeTestSub',false)
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeTestSub',false)
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
&:deep(.ant-form){
    padding-right: 44px !important;
}
</style>