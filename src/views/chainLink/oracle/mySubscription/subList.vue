<template>
    <p>My Subscription</p>
    <div class="flex justify-between items-center">
        <div>
            <span>Network</span>
            <a-select @change="setSubNetwork" v-model:value="netName" autocomplete="off"
            :options="netOptions.map((item:any) => ({ value: item }))" ></a-select>
            <a-button class="ml-2">Search</a-button>
        </div>
        <div>
            <a-button>Created</a-button>
            <a-button class="mx-2">Add Consumers</a-button>
            <a-button>Add Funds</a-button>
        </div>
    </div>
    <a-table :loading="loading" :dataSource="subListData" :columns="subListColumns" class="mb-[64px] mt-[20px]" :pagination="pagination">
        <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
            <a v-if="record.action" @click.stop="goSubDetail(record)">View</a>
            <span v-else>-</span>
        </template>
        </template>
    </a-table>
</template>
<script setup lang="ts" name="subList">
import { useRouter } from 'vue-router'
import { ref,reactive } from 'vue'
const router = useRouter();
const netOptions = ref<any>(['All','Ethereum Mainnet','Ethereum Testnet','BSC Mainnet','BSC Testnet'])
const netName = ref('All')
const loading = ref(false)
const setSubNetwork = ()=>{

}
const subListColumns:any = [
    {
        title: 'ID',
        dataIndex: 'id',
        key:'id',
        align:'center'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        align:'center'
    },
    {
        title: 'Created',
        dataIndex: 'time',
        align:'center'
    },
    {
        title: 'Network',
        dataIndex: 'network',
        align:'center'
    },
    {
        title: 'Consumers',
        dataIndex: 'consumers',
        align:'center',
        customRender: ({ text }:any) => {
            if (!text) {
                return '-'
            }
        },
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        align:'center',
        customRender: ({ text }:any) => {
            if (!text) {
                return '-'
            }
        },
    },
    {
        title: 'Action',
        key: 'action',
        align:'center'
    },
]
const subListData:any = [
    {
        key: '1',
        id: '1',
        name:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
        // consumers:'Jack',
        // balance:'12.2345 link',
        action:'View'
    },
    {
        key: '2',
        id: '2',
        name:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
        // consumers:'Jack',
        // balance:'12.2345 link',
        action:'View'
    },
    {
        key: '3',
        id: '3',
        name:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
        consumers:'Jack',
        balance:'12.2345 link',
        action:'View'
    },
    {
        key: '4',
        id: '4',
        name:'test',
        time:'2023-03-28 18:00:00',
        network:'Test',
        consumers:'Jack',
        balance:'12.2345 link',
        action:'View'
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
        getSublist();
    },
    onChange: (current: number) => {
        // 切换分页时的回调，
        pagination.current = current;
        getSublist();
    },
    // showTotal: total => `总数：${total}人`, // 可以展示总数
});
// 获取sub表单数据
const getSublist = ()=>{

}
const goSubDetail = (record:any)=>{
    console.log('goSubDetail',record)
    router.push('/chainlink/oracle/subListDetail')
}
</script>
<style scoped less>

</style>