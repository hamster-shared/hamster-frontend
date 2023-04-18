<template>
    <a-modal v-model:visible="props.showAddConsumers" width="600px" title="Add Consumers" :footer="null">
        <template #closeIcon>
            <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelFund"/>
        </template>
        <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Subscription" name="subscription" >
                <a-select @change="setSubscription" v-model:value="formData.subscription" placeholder="Please select a subscription" autocomplete="off"
                :options="subOptions" allow-clear></a-select>
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
            <a-select class="inline-block" style="margin-right:10px;width: 220px;" @change="setProject" v-model:value="formData.project" placeholder="Please select a subscription" autocomplete="off"
                allow-clear :options="projectOptions"></a-select>
            <a-select class="inline-block" :placeholder="subOptionsNet" disabled></a-select>
            <a-table class="mt-[16px]" :loading="loading" :columns="consumersColumns" :dataSource="consumersData" :pagination="pagination">
                <template #address="{ record }">
                    <a-radio class="inline-block w-[20px] radio-normal" v-model:checked="record.checked" @click="getProjectInfo(record.address)"></a-radio>
                    <span :title="record.address">{{ record.address.slice(0,10) }}</span>
                </template>
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
import { ref, onMounted, computed, reactive,watch } from 'vue'
import { consumerSublist,consumerProjects,consumerTable,apiConsumerAdd,updateConsumer } from '@/apis/chainlink'
import type { consumerInTableParams } from '@/apis/utils/chainlinkInterface'
import dayjs from "dayjs";
import { message } from 'ant-design-vue';
import { useContractApi } from "@/stores/chainlink";
import { switchToChain } from '@/utils/changeNetwork'
const { ethereum } = window;
const contractApi = useContractApi()
const { registryApi, linkTokenApi, walletAddress } = useContractApi()
const consumersColumns:any = [
    {
        title: 'Address',
        dataIndex: 'address',
        key:'address',
        align:'center',
        slots: { customRender: 'address' },
    },
    {
        title: 'Network',
        dataIndex: 'network',
        align:'center'
    },
    {
        title: 'Deploy Time',
        dataIndex: 'deployTime',
        align:'center',
        customRender: ({ text }:any) => {
            return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
          },
    },
]
const consumersData = ref([])
const pagination = reactive({
    // 分页配置器
    pageSize: 3, // 一页的数据限制
    current: 1, // 当前页
    total: 0, // 总数
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
const subOptions = ref<any>([])
const subOptionsNet = ref()
const projectOptions = ref<any>([])
const formData = reactive({
    subscription: null,
    project:undefined,
    consumer: '',
});
const loading = ref(false)
const isOrigin = ref(true)
// 订阅id
const subId = ref()
// 主键id
const keyId = ref()
// Penning id
const temId = ref()
const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        subscription: [requiredRule('Subscription')],
        consumer: [{ required: true, trigger: 'change', message: 'The address is invalid, please re-enter' }],
    };
});
const emit = defineEmits(['closeAddConsumers','getAddConsumersInfo'])
console.log('showAddConsumers',props.showAddConsumers)
// 获取订阅数据
const getSublistData = async()=>{
    const res = await consumerSublist()
    if(res.code===200 && res.data?.length){
        subOptions.value = res.data.map((item:any)=>{
            let tem = item.name+'('+item.chainAndNetwork+')'+'_'+item.chainSubscriptionId
            return {
                label:tem,
                value:item.id,
                subNetName:item.chainAndNetwork,
                subNetId:item.networkId
            }
        })
    }
    console.log('获取订阅数据',res)
}
// 获取项目名称
const getProjectsData = async(network:any)=>{
    const net = network.split(' ')
    const params = {
        chain:net.slice(0,1).join(' '),
        network:net.slice(1,net.length).join(' '),
    }
    const res = await consumerProjects(params)
    if(res.code===200 && res.data?.length){
        projectOptions.value = res.data.map((item:any)=>{
            return {
                label:item.name,
                value:item.id
            }
        })
    }
    console.log('获取项目名称',res)
}
watch(()=>[formData.project,subOptionsNet.value],([n1,n2],[o1,o2])=>{
    if(n2!=o2 || n1!=o1){
        getlistData() 
    }
})
// 获取表单数据
const getlistData = async()=>{
    loading.value = true
    console.log('获取表单数据',formData.subscription)
    const net = subOptionsNet.value.split(' ') 
    const params:consumerInTableParams = {
        page:pagination.current,
        size:pagination.pageSize,
        chain:net.slice(0,1).join(' '),
        network:net.slice(1,net.length).join(' '),
    }
    console.log('121212',params)
    const res = await consumerTable(formData.project,params)
    console.log('res',res.data.data)
    if(res.code===200){
        consumersData.value = res.data.data
        pagination.total = res.data.total
    }else{
        consumersData.value = []
    }
    loading.value = false
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
const setSubscription = (val:any,option:any)=>{
    // formData.subscription = val
    subOptionsNet.value = option?.label?.substring(option?.label?.indexOf("(")+1,option?.label?.indexOf(")"));
    getProjectsData(subOptionsNet.value)
    subId.value = option?.label?.substring(option?.label?.indexOf("_")+1,option?.label?.length);
    keyId.value = val
    const netId = `0x${option.subNetId}`
    if (ethereum.chainId !== netId) {
        switchToChain(netId,option.subNetName,option.networkUrl)
    }
    console.log('设置订阅号',subOptionsNet.value,111111,subId.value,option)
}
// 设置项目名称
const setProject = (val:any,option:any)=>{
    console.log('设置项目名称',val,option)
    formData.project = val
}
// 跳转hamster
const goHamster = ()=>{
    emit('closeAddConsumers',false)
    window.open('/projects', '_blank')
}
// 给订阅号添加资金
const handleFund = async()=>{
    await formRef.value.validate();
    console.log(' id 是订阅Id addConsumerAddress 合约地址',parseInt(subId.value),formData.consumer)
    if (contractApi.apiStatus) {
        // id 是订阅Id addConsumerAddress 合约地址
        registryApi?.addConsumer(parseInt(subId.value), formData.consumer).then(async(tx:any)=>{
            console.log('tx~~~~~',tx)
            const params = {
                subscriptionId:keyId.value,
                consumerAddress:formData.consumer,
                transactionTx:tx.hash
            }
            const res = await apiConsumerAdd(params)
            if(res.code===200){
                temId.value = res.data
                message.success(res.message)
            }else{
                message.error(res.message)
            }
            return tx.wait()
        }).then(async(receipt:any) => {
            const params = {
                id:temId.value,
                subscriptionId:keyId.value,
                transactionTx:receipt.transactionHash,
                consumerAddress:formData.consumer,
                newStatus:'success'
            }
            const res = await updateConsumer(params)
            if(res.code===200){
                message.success(res.message)
            }else{
                message.error(res.data)
            }
            console.log("addConsumer", receipt);
            emit('getAddConsumersInfo',formData)
            emit('closeAddConsumers',false)
        }).catch((err:any)=>{
            console.log('err111111',err)
        })
    }
}
// 取消订阅
const cancelFund = ()=>{
    emit('closeAddConsumers',false)
}
// 选中表格中的项目
const getProjectInfo = (add:string)=>{
    formData.consumer = add
    console.log('选中表格中的项目',add)
}
onMounted(()=>{
    getSublistData()
})

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
&:deep(.ant-radio-wrapper){
    display: inline-block;
}
</style>