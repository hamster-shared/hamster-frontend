<template>
    <bread-crumb class="!text-[24px]" :routes="breadCrumbInfo"/>

    <!-- <div class="text-[24px] font-bold">My Subscription</div> -->
    <div class="content">
        <div class="flex justify-between items-center mt-[30px]">
            <div>
                <span class="mr-[10px]">Network</span>
                <a-select class="w-[200px]" v-model:value="netName" autocomplete="off"
                :options="netOptions.map((item:any) => ({ value: item }))" ></a-select>
                <a-button class="ml-2 mt-2" @click="getSublist">Search</a-button>
            </div>
            <div>
                <a-button @click="createSubPop" class="mt-1">Create</a-button>
                <a-button @click="addConsumerPop" class="mx-2 mt-1">Add Consumers</a-button>
                <a-button @click="addFundsPop" class="mt-1">Add Funds</a-button>
            </div>
        </div>
        <a-table :loading="loading" :dataSource="subListData" :columns="subListColumns" :pagination="pagination" class="table">
            <template #operation="{ record }">
                <a @click="goSubDetail(record)" class="mr-16 !text-[#E2B578]">View</a>
            </template>
            <template #network="{ record }">
                <span>{{record.chain}} {{record.network}}</span>
            </template>
            <template #id="{ record }">
                <span v-if="record.status?.toLowerCase()=='success'">{{record.id}}</span>
                <span v-else>
                    <svg-icon v-if="record.status?.toLowerCase()=='pending'" name="Pending" size="20" class="ml-[8px] mr-[12px] inline-block" />
                    <svg-icon v-if="record.status?.toLowerCase()=='failed'" name="chainFailed" size="20" class="ml-[8px] mr-[12px] inline-block" />
                    <span class=" text-[#FF4A4A] inline-block" :style="{color:record.status?.toLowerCase()=='pending'?'#1890FF':(record.status?.toLowerCase()=='success' ? '#29C57C':'#FF4A4A')}">{{ record.status }}</span>
                </span>
            </template>
        </a-table>
    </div>
    <createSub v-if="showCreateSub" :showCreateSub="showCreateSub" @getCreateSubInfo="getCreateSubInfo" @closeCreateSub="closeCreateSub"/>
    <addFunds v-if="showAddFund" :showAddFund="showAddFund" @getAddFundInfo="getAddFundInfo" @closeAddFund="closeAddFund"/>
    <addConsumers v-if="showAddConsumers" :showAddConsumers="showAddConsumers" @getAddConsumersInfo="getAddConsumersInfo" @closeAddConsumers="closeAddConsumers"/>
</template>
<script setup lang="ts" name="subList">
import { useRouter } from 'vue-router'
import { ref,reactive,onMounted } from 'vue'
import BreadCrumb from "@/components/BreadCrumb.vue";
import createSub from './components/createSub.vue'
import addFunds from './components/addFunds.vue'
import addConsumers from './components/addConsumers.vue'
import { apiSublist } from '@/apis/chainlink'
import dayjs from "dayjs";
const router = useRouter();
// 'Hamster Moonbeam Testnet'经产品要求，隐藏掉这个网络
const netOptions = ref<any>(['All','Ethereum Sepolia Testnet','Polygon Mumbai Testnet'])
const netName = ref('All')
const loading = ref(false)
const breadCrumbLoading = ref(false)
const showCreateSub = ref(false)
const showAddFund = ref(false)
const showAddConsumers = ref(false)
const showTestSub = ref(false)

const breadCrumbInfo = ref<any>([])

const subListColumns:any = [
    {
        title: 'ID',
        dataIndex: 'id',
        key:'id',
        align:'center',
        slots: { customRender: 'id' },
    },
    {
        title: 'Name',
        dataIndex: 'name',
        align:'left'
    },
    {
        title: 'Created',
        dataIndex: 'created',
        align:'left',
        customRender: ({ text }:any) => {
            return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
          },
    },
    {
        title: 'Network',
        dataIndex: 'network',
        align:'left',
        slots: { customRender: 'network' },
    },
    {
        title: 'Consumers',
        dataIndex: 'consumers',
        align:'center',
        customRender: ({ text }:any) => {
            if (typeof text == 'number') {
                return text
            }else{
                return '-'
            }
        },
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        align:'center',
        customRender: ({ text }:any) => {
            if (typeof text == 'number') {
                return text
            }else{
                return '-'
            }
        },
    },
    {
        title: 'Action',
        dataIndex: 'operation',
        slots: { customRender: 'operation' },
    }
]
const subListData = ref<any>([])
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
const getSublist = async()=>{
    loading.value = true
    const net = netName.value.split(' ')
    // console.log(11111,net.slice(1,net.length).join(' '))
    const params = {
        page:pagination.current,
        size:pagination.pageSize,
        network:netName.value=='All' ? '':net.slice(1,net.length).join(' '),
        chain:netName.value=='All' ? '':net.slice(0,1).join(' '),
    }
    const res = await apiSublist(params)
    if(res.code === 200&& res.data?.data?.length){
        subListData.value = res.data?.data
        pagination.total = res.data.total
    }else{
        subListData.value = []
    }
    loading.value = false
}

// 新增订阅弹框
const createSubPop = ()=>{
    btnChange()
    showCreateSub.value = true
}
// 订阅数据接收
const getCreateSubInfo = (info:any)=>{
    showCreateSub.value = false
    getSublist()
    console.log('订阅数据接收',info)
}
// 关闭订阅
const closeCreateSub = (bool:boolean)=>{
    showCreateSub.value = bool
    router.push('/middleware/dashboard/oracle/sublist')
}

// 添加消费者弹框
const addConsumerPop = ()=>{
    btnChange()
    showAddConsumers.value = true
}
// 添加消费者数据接收
const getAddConsumersInfo = (consumersInfo:any)=>{
    console.log('添加消费者数据接收',consumersInfo)
    showAddConsumers.value = false
    getSublist()
}
// 关闭消费者
const closeAddConsumers = (bool:boolean)=>{
    showAddConsumers.value = bool
}

// 添加资金弹框
const addFundsPop = ()=>{
    btnChange()
    showAddFund.value = true
}
// 添加资金数据接收
const getAddFundInfo = (fundInfo:any)=>{
    console.log('添加消费者数据接收',fundInfo)
    showAddFund.value = false
    getSublist()
}
// 关闭资金
const closeAddFund = (bool:boolean)=>{
    showAddFund.value = bool
}

// 获取testsub数据
const getTestSubInfo = (testSub:any)=>{
    console.log('添加消费者数据接收',testSub)
}
// 关闭testsub弹框
const closeTestSub = (bool:boolean)=>{
    showTestSub.value = bool
}

// 切换按钮改变状态,先关闭所有弹框，再开点击的弹框
const btnChange = ()=>{
    showCreateSub.value = false
    showAddFund.value = false
    showAddConsumers.value = false
}
const goSubDetail = (record:any)=>{
    console.log('goSubDetail',record)
    router.push(`/middleware/dashboard/oracle/subList/sublist-detail?subId=${record.id}`)
}
onMounted(async()=>{
    getSublist()
    breadCrumbInfo.value = [
      {
        breadcrumbName:'Hamslink',
        path:'/middleware/dashboard/oracle'
      },
      {
        breadcrumbName:'My Subscription',
        path:''
      },
    ]
})
</script>
<style scoped less>
.content{
    min-height: 810px;
}
.table{
    width: 100%;
    margin-bottom: 64px;
    margin-top: 20px;
}

</style>