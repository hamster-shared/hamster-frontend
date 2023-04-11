<template>
    <div class="text-[24px] font-bold">Basic Information</div>
    <div class="mt-[30px]">
        <p>
            <span class="name">ID</span>
            <span class="font-bold">{{detailInfo.id || "-"}}</span>
        </p>
        <p>
            <span class="name">currentName</span>
            <span class="font-bold">{{detailInfo.name || "-"}}</span>
        </p>
        <p>
            <span class="name">Admin</span>
            <span class="font-bold">{{detailInfo.admin || "-"}}</span>
        </p>
        <p>
            <span class="name">Created</span>
            <span class="font-bold">{{dayjs(detailInfo.created).format('YYYY-MM-DD HH:mm:ss') || "-"}}</span>
        </p>
        <p>
            <span class="name">TxID</span>
            <span style="color:#017AFF;border:1px solid #434343;border-radius: 4px;padding:10px">
                <span v-if="detailInfo.transactionTx" class="cursor-pointer font-bold mr-[10px]" @click="goTxSearch">{{detailInfo.transactionTx}}</span>
                <img v-if="detailInfo.transactionTx" src="@/assets/svg/Jump.png"/>
                <span v-if="!detailInfo.transactionTx">-</span>
            </span> 
        </p>
        <p>
            <span class="name">Status</span>
            <span class="font-bold color-[#29C57C ]" :style="{color:detailInfo.status?.toLowerCase()=='pending'?'#1890FF':(detailInfo.status?.toLowerCase()=='success' ? '#29C57C':'#FF4A4A')}">{{detailInfo.status || "-"}}</span>
        </p>
        <p>
            <span class="name">Consumers</span>
            <span class="font-bold">{{detailInfo.consumers}}</span>
        </p>
        <p>
            <span class="name">amount</span>
            <span class="text-[#FF4A4A] mr-1 font-bold">{{detailInfo.balance || "-"}}</span>link
        </p>
    </div>
    <div class="mt-[40px] pb-[16px] w-[100%]" style="border-bottom: 1px solid #434343;">
        <span class="cursor-pointer font-bold text-[16px] pb-[17px]" :style="{borderBottom: tab==1? '1px solid #E2B578':''}" @click="getExpense">Expense</span>
        <span class="cursor-pointer mx-[60px] font-bold text-[16px] pb-[17px]" :style="{borderBottom: tab==2? '1px solid #E2B578':''}" @click="getDeposit">Deposit</span>
        <span class="cursor-pointer font-bold text-[16px] pb-[17px]" :style="{borderBottom: tab==3? '1px solid #E2B578':''}" @click="getConsumers">Consumers</span>
    </div>
    <div v-if="tab==1" class="flex items-center mt-[20px]">
        <span class="mr-[10px]">Request</span>
        <a-input v-model:value="reqName" class="req-input" placeholder="Please input request name" allow-clear autocomplete="off"/>
        <a-button class="mx-[10px]" @click="getExpense">Search</a-button>
        <a-button style="background: transparent;color:#E2B578" @click="resetExpense">Reset</a-button>
    </div>
    <a-table :loading="loading" :dataSource="tableData.value" :columns="subDetailCol" class="mb-[64px] mt-[20px]" :pagination="pagination">
        <template #operation="{ record }">
            <span @click="delConsumer(record)" class="mr-16 text-[#FF4A4A] cursor-pointer">Delete</span>
        </template>
        <template #amount="{ record }">
            <span class="mr-16 text-[#FF4A4A]">{{ record.amount }}link</span>
        </template>
        <template #status="{ record }">
            <svg-icon v-if="record.status=='pending'" name="Pending" size="20"/>
            <svg-icon v-if="record.status=='failed'" name="chainFailed" size="20" />
            <span class=" text-[#FF4A4A] inline-block ml-[2px]" :style="{color:record.status?.toLowerCase()=='pending'?'#1890FF':(record.status?.toLowerCase()=='success' ? '#29C57C':'#FF4A4A')}">{{ record.status }}</span>
        </template>
        <template #transactionTx="{ record }">
            <img v-if="detailInfo.transactionTx" src="@/assets/svg/Jump.png" style="display:inline-block"/>
            <span @click="goTxSearch(record)" class="inline-block text-[#017AFF] cursor-pointer" :title="record.transactionTx">{{ record.transactionTx?.slice(0,10) }}...</span>
        </template>
    </a-table>
</template>
<script setup lang="ts" name="subListDetail">
import dayjs from "dayjs";
import { renderTableText } from '@/utils/customRender'
import { reactive, ref, onMounted } from 'vue'
import { expenseColumns,depositColumns,consumersColumns } from './chainApi/colDetail'
import {apiSublistDetail,apiExpenseList,apiDepositList,apiConsumerList,apiDelConsumer} from '@/apis/chainlink'
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
const route = useRoute()
const id:any = route.query.subId
console.log('router~~~~~',route.query.subId)
const loading = ref(false)
const reqName = ref('')
const tab = ref(1)
const subDetailCol = ref<any>([])
const tableData:any = []
const detailInfo = ref<any>({})
const pagination = reactive({
    // 分页配置器
    pageSize: 10, // 一页的数据限制
    current: 1, // 当前页
    total: 10, // 总数
    size: 'small',
    position: ['bottomCenter'], //指定分页显示的位置
    hideOnSinglePage: false, // 只有一页时是否隐藏分页器
    showQuickJumper: false, // 是否可以快速跳转至某页
    showSizeChanger: false, // 是否可以改变 pageSize
    pageSizeOptions: ['10', '20', '30'], // 指定每页可以显示多少条
    onShowSizeChange: (current: number, pagesize: number) => {
        // 改变 pageSize时的回调
        pagination.current = current;
        pagination.pageSize = pagesize;
        // 默认拿Expense表单数据，点击tab切换回调
        if(tab.value==1){
            getExpense()
        }else if(tab.value==2){
            getDeposit()
        }else if(tab.value==3){
            getConsumers()
        }
    },
    onChange: (current: number) => {
        // 切换分页时的回调，
        pagination.current = current;
        if(tab.value==1){
            getExpense()
        }else if(tab.value==2){
            getDeposit()
        }else if(tab.value==3){
            getConsumers()
        }
    },
    // showTotal: total => `总数：${total}人`, // 可以展示总数
});
// 跳到以太坊的交易记录
const goTxSearch = (record?:any)=>{
    if(record.transactionTx){
        window.open(`https://etherscan.io/tx/${record.transactionTx}`)
    }else{
        window.open(`https://etherscan.io/tx/${detailInfo.value.transactionTx}`)
    }
}
// Expense 表单数据
const getExpense = async()=>{
    // debugger
    tab.value = 1
    loading.value = true
    subDetailCol.value = expenseColumns
    const params:any = {
        page:pagination.current,
        size:pagination.pageSize,
        requestName: reqName.value 
    }
    const res = await apiExpenseList(id,params)
    if(res.code === 200&& res.data?.data?.length){
        tableData.value = res?.data?.data
        console.log(1121221,tableData.value)
    }else{
        tableData.value = []
    }
    loading.value = false
}
const resetExpense = async()=>{
    loading.value = true
    const params:any = {
        page:pagination.current,
        size:pagination.pageSize,
        requestName: ''
    }
    const res = await apiExpenseList(id,params)
    if(res.code === 200 && res.data?.data?.length){
        tableData.value = res?.data?.data
    }else{
        tableData.value = []
    }
    reqName.value = ''
    loading.value = false
}
// Deposit 表单数据
const getDeposit = async()=>{
    tab.value = 2
    loading.value = true
    subDetailCol.value = depositColumns
    const params = {
        page:pagination.current,
        size:pagination.pageSize
    }
    const res = await apiDepositList(id,params)
    if(res.code === 200&& res.data?.data?.length){
        tableData.value = res?.data?.data
    }else{
        tableData.value = []
    }
    loading.value = false
}
// Consumers 表单数据
const getConsumers = async()=>{
    tab.value = 3
    loading.value = true
    subDetailCol.value = consumersColumns
    const params = {
        page:pagination.current,
        size:pagination.pageSize
    }
    const res = await apiConsumerList(id,params)
    if(res.code === 200&& res.data?.data?.length){
        tableData.value = res?.data?.data
    }else{
        tableData.value = []
    }
    loading.value = false
}
// 删除consumer
const delConsumer = async(record:any)=>{
    const delRes = await apiDelConsumer(id,record.id)
    if(delRes.code===200){
        getConsumers()
        message.success('删除成功')
    }else{
        message.error(delRes.data)
    }
}
// 头部详情数据
const getDetailInfo = async()=>{
    const detailRes = await apiSublistDetail(id)
    console.log('detailRes',detailRes)
    if(detailRes.code === 200){
        // 从接口中取订阅状态
        // subStatus.value = 'success'
        detailInfo.value = detailRes.data
        // Object.assign(detailInfo.detailRes.data)
        console.log(1111,detailInfo.value)
    }
}
onMounted(async()=>{
    console.log(111111,expenseColumns,depositColumns,consumersColumns)
    subDetailCol.value = expenseColumns
    getDetailInfo()
    getExpense()
})
</script>
<style scoped less>
.name{
    width:100px;
    display:inline-block;
    text-align: right;
    margin-right: 30px;
    font-size: 14px;
}
.req-input{
    width:220px;
    height: 32px;
}
:deep(.ant-input){
    height: 32px;
}
</style>