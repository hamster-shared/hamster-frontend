<template>
    <div>Basic Information</div>
    <div>
        <p>
            <span class="name">number</span>
            <span>21</span>
        </p>
        <p>
            <span class="name">currentName</span>
            <span>token_price</span>
        </p>
        <p>
            <span class="name">Admin</span>
            <span>0xdqw423q34wbfdqobfdqobfdqo</span>
        </p>
        <p>
            <span class="name">Created</span>
            <span>2023-03-15 15:12:14</span>
        </p>
        <p>
            <span class="name">TxID</span>
            <span class="cursor-pointer" @click="goTxSearch">0x836aa7a4d8bfc58d1c1af93a6218cecc661e098a8d9d4102d4053d56597546ac</span>
        </p>
        <p>
            <span class="name">Consumers</span>
            <span>13</span>
        </p>
        <p>
            <span class="name">amount</span>
            <span>21.132 link</span>
        </p>
    </div>
    <div class="mt-[20px]">
        <span class="cursor-pointer" @click="getExpense">Expense</span>
        <span class="cursor-pointer mx-[20px]" @click="getDeposit">Deposit</span>
        <span class="cursor-pointer" @click="getConsumers">Consumers</span>
    </div>
    <div v-if="tab==1" class="flex items-center mt-[10px]">
        <span class="mr-[10px]">Request</span>
        <a-input v-model:value="reqName" class="req-input" placeholder="Please input request name" allow-clear autocomplete="off"/>
        <a-button class="mx-[10px]">Search</a-button>
        <a-button>Reset</a-button>
    </div>
    <a-table :loading="loading" :dataSource="expenseData" :columns="expenseColumns" class="mb-[64px] mt-[20px]" :pagination="pagination">
        <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
            <a>View</a>
        </template>
        </template>
    </a-table>
</template>
<script setup lang="ts" name="subListDetail">
import {reactive,ref} from 'vue'
import { expenseColumns,depositColumns,consumersColumns } from './utils/colDetail'
const loading = ref(false)
const reqName = ref('')
const tab = ref(1)
const expenseData:any = [
    {
        key: '1',
        number: '1',
        name:'test',
        time:'2023-03-28 18:00:00',
        consumers:'0x8F7248783003c2c23A78f98CAa2052423573887d',
        amount:'12.2345 link',
    },
    {
        key: '2',
        number: '2',
        name:'test',
        time:'2023-03-28 18:00:00',
        consumers:'0x8F7248783003c2c23A78f98CAa2052423573887d',
        amount:'12.2345 link',
    },
    {
        key: '3',
        number: '3',
        name:'test',
        time:'2023-03-28 18:00:00',
        consumers:'0x8F7248783003c2c23A78f98CAa2052423573887d',
        amount:'12.2345 link',
    },
    {
        key: '4',
        number: '4',
        name:'test',
        time:'2023-03-28 18:00:00',
        consumers:'0x8F7248783003c2c23A78f98CAa2052423573887d',
        amount:'12.2345 link',
    },
]
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
        getExpense();
    },
    onChange: (current: number) => {
        // 切换分页时的回调，
        pagination.current = current;
        getExpense();
    },
    // showTotal: total => `总数：${total}人`, // 可以展示总数
});
// 跳到以太坊的交易记录
const goTxSearch = ()=>{
    // window.open(`https://etherscan.io/tx/${}`)
}
// Expense 表单数据
const getExpense = ()=>{
    tab.value = 1
    console.log('Expense 表单数据')
}
// Deposit 表单数据
const getDeposit = ()=>{
    tab.value = 2
    console.log('Deposit 表单数据')
}
// Consumers 表单数据
const getConsumers = ()=>{
    tab.value = 3
    console.log('Consumers 表单数据')
}
</script>
<style scoped less>
.name{
    width:100px;
    display:inline-block;
    text-align: right;
    margin-right: 30px;
}
.req-input{
    width:220px;
    height: 32px;
}
:deep(.ant-input){
    height: 32px;
}
</style>