<template>
    <a-modal v-model:visible="props.showAddConsumers" title="Add Consumers" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            </a-form-item>
            
            <a-form-item label="Consumer" :name="!isOrigin ? 'consumer':''" >
                <div >
                    <a-radio :checked="isOrigin" :value="1" @change="selectOrigin">Select consumer from Hamster</a-radio>
                    <div class="ml-[25px] text-gray-400 text-[12px]">You can create and depoly consumer contracts by Hamster</div>
                </div>
                <div>
                    <a-radio :checked="!isOrigin" :value="2" @change="selectManul">Manual input</a-radio>
                    <div class="ml-[25px] text-gray-400 text-[12px]">Input your consumer contract address for using funds of this subscription</div>
                </div>
                <div v-if="!isOrigin">
                    <a-input class="mt-[10px]" v-model:value="formData.consumer" placeholder="Please input consumer" allow-clear autocomplete="off" />
                </div>
            </a-form-item>
        </a-form>
        <div v-if="isOrigin" class="-mt-[10px]">
            <a-select class="inline-block" style="margin-right:10px" @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            <a-select class="inline-block" @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select the network" autocomplete="off"
                :options="subOptions.map((item:any) => ({ value: item }))" allow-clear></a-select>
            <a-table class="mt-[16px]" :columns="consumersColumns" :dataSource="consumersData" :pagination="pagination">
            </a-table>
        </div>
        <div class="text-center flex justify-between mt-[16px]">
            <a-button style="margin-right: 20px;background: transparent;color:#E2B578" @click="goHamster">Create Consumer by Hamster</a-button>
            <a-button @click="handleFund">Confirm</a-button>
        </div>
    </a-modal>
</template>
<script setup lang="ts" name="addConsumers">
import router from '@/router';
import { renderTableText } from '@/utils/customRender'
import { ref, onMounted, computed, reactive } from 'vue'
const consumersColumns:any = [
    {
        title: 'Address',
        dataIndex: 'address',
        key:'address',
        align:'center',
        customRender: renderTableText(30)
    },
    {
        title: 'Network',
        dataIndex: 'network',
        align:'center'
    },
    {
        title: 'Deploy Time',
        dataIndex: 'time',
        align:'center'
    },
]
const consumersData:any = [
    {
        key: '1',
        id: '1',
        address:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
    },
    {
        key: '2',
        id: '2',
        address:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
    },
    {
        key: '3',
        id: '3',
        address:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
    },
    {
        key: '4',
        id: '4',
        address:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
    },
]
const pagination = reactive({
    // 分页配置器
    pageSize: 3, // 一页的数据限制
    current: 1, // 当前页
    // total: 10, // 总数
    size: 'small',
    position: ['bottomCenter'], //指定分页显示的位置
    hideOnSinglePage: false, // 只有一页时是否隐藏分页器
    showQuickJumper: false, // 是否可以快速跳转至某页
    showSizeChanger: false, // 是否可以改变 pageSize
    onShowSizeChange: (current: number, pagesize: number) => {
        // 改变 pageSize时的回调
        pagination.current = current;
        pagination.pageSize = pagesize;
        getlistData();
    },
    onChange: (current: number) => {
        // 切换分页时的回调，
        pagination.current = current;
        getlistData();
    },
});
const props = defineProps({
    showAddConsumers:{
        type:Boolean,
        default:false
    }
})
const formRef = ref();
const subOptions = ref(['Ethererum Mainnet','Ethererum Testnet','BSC Mainnet','BSC Testnet'])
const formData = reactive({
    subscription: null,
    consumer: '',
});
const isOrigin = ref(true)
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        consumer: [{ required: true, trigger: 'change', message: 'The address is invalid, please re-enter' }],
    };
});
const emit = defineEmits(['closeAddConsumers','getAddConsumersInfo'])
console.log('showAddConsumers',props.showAddConsumers)
// 获取表单数据
const getlistData = ()=>{
    console.log('获取表单数据')
}
// 选择consumer来源于接口
const selectOrigin = (val:any)=>{
    isOrigin.value = true
    formData.consumer = '0'
    console.log('selectOrigin',val.target.value) 
}
// 手动输入地址
const selectManul = (val:any)=>{
    isOrigin.value = false
    formData.consumer = ''
    console.log('selectManul',val.target.value)
}
// 设置订阅号
const setSubscription = (val:any)=>{
    console.log('设置订阅号',val)
    formData.subscription = val
}
// 跳转hamster
const goHamster = ()=>{
    emit('closeAddConsumers',false)
    router.push('/projects')
}
// 给订阅号添加资金
const handleFund = async()=>{
    await formRef.value.validate();
    emit('getAddConsumersInfo',formData)
    emit('closeAddConsumers',false)
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeAddConsumers',false)
}

</script>
<style lang="less" scoped>
.done-btn {
    width: 120px;
    height: 43px;
}
&:deep(.ant-radio-wrapper){
    color:#36322D !important;
    display: block;
}
&:deep(.ant-radio-inner){
    border-radius: 50%;
}
&:deep(.ant-radio-inner::after){
    border-radius: 50%;
}
&:deep(.ant-select-selection-item){
    color:#36322D !important;
}
</style>