<template>
    <a-modal v-model:visible="props.showTestSub" title="Test" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Consumers" name="consumers" >
                <a-select @change="setSubscription" show-search v-model:value="formData.subscription" placeholder="Please input contract address" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item label="Secrets Loaction" name="secretsLoaction" >
                <a-select @change="setLoaction" v-model:value="formData.loaction" placeholder="Please select a loaction" autocomplete="off"
                :options="loactionOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            <a-form-item v-if="formData.loaction=='Inline'" label="Secrets" name="secrets" >
                <div>
                    <a-input-group>
                        <a-row :gutter="8">
                            <a-col :span="11">
                                <a-input v-model:value="formData.secretName" allow-clear autocomplete="off" />
                            </a-col>
                            <a-col :span="11">
                                <a-input v-model:value="formData.secretValue" allow-clear autocomplete="off" />
                            </a-col>
                            <a-col :span="2" class="mt-[5px] cursor-pointer" @click="addSecret">
                                <span>+</span>
                            </a-col>
                        </a-row>
                    </a-input-group>
                </div>
            </a-form-item>
            <a-form-item v-if="formData.loaction=='Remote'" label="SecretURL" name="secreturl" >
                <a-input v-model:value="formData.secreturl" allow-clear autocomplete="off" />
            </a-form-item>
            <a-form-item label="args1" name="args1" >
                <a-input v-model:value="formData.args" allow-clear autocomplete="off" />
            </a-form-item>
        </a-form>
        <div class="text-center flex justify-center">
            <a-button class="done-btn" style="margin-right: 20px;" @click="handleFund">Send</a-button>
            <a-button class="done-btn" @click="cancelFund">Cancel</a-button>
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
const formData = reactive({
    subscription: null,
    consumers: '',
    loaction: 'Inline',
    secrets: '',
    secretName:'',
    secretValue:'',
    secreturl:'',
    args: ''
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
// 设置订阅号
const setSubscription = (val:any)=>{
    console.log('设置订阅号',val)
    formData.subscription = val
}
// 添加secret
const addSecret = ()=>{

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