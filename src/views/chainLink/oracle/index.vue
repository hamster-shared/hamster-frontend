<template>
  <div class="flex flex-col w-full px-6">
    <div class="mb-6 text-2xl font-bold">Chainlink Functions</div>
    <oracleChart></oracleChart>
    <div class="flex flex-col self-center w-full mt-[32px] container-border">
      <div class="flex justify-between my-4">
        <div class="font-bold text-[20px]">Create Request</div>
        <div>
          <a-button @click="router.push('/chainlink/oracle/create-request')">Create Request</a-button>
          <a-button v-if="false" class="ml-2" @click="toDocs">Docs</a-button>
        </div>
      </div>
      <div>
        <a-table :dataSource="oracleListData" :columns="oracleColumns" :pagination="pagination" style="width:100%">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button class="table-btn" @click="showTestSubBtn(record)">Test</a-button>
              <a-button class="mx-2 table-btn-disable" @click="editRequest(record)">Edit</a-button>
              <a-button class="table-btn-disable" @click="downloadRequest(record)">Download</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <testSub v-if="showTestSub" :column="column" :showTestSub="showTestSub" @getTestSubInfo="getTestSubInfo" @closeTestSub="closeTestSub"/>
  <a-modal v-model:visible="showMessage" :footer="null">
      <p style="font-weight: 700;font-size: 16px;">Success</p>
      <template #closeIcon>
          <img class="" src="@/assets/icons/closeIcon.svg" @click="closeMessageModal"/>
      </template>
      <p>The test request has been sent successfully, and the result will be sent to your email address mailbox, please check it.</p>
      <div style="width:100%;display:flex;justify-content: center;margin-top: 20px;">
          <a-button @click="closeMessageModal">Got it</a-button>
      </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import { apiGetOracleTableParams } from '@/apis/chainlink'
  import { formatDateToLocale } from '@/utils/dateUtil';
  import oracleChart from './oracleChart/index.vue'
  import testSub from './mySubscription/components/testSub.vue'

  const router = useRouter();
  const oracleListData = ref<{
    id: number,
    name: string,
    created: string
  }[]>([])
  const showTestSub = ref(false)
  const column = ref<any>({})
  const showMessage = ref(false)

  const oracleColumns = reactive([
    {
      title: 'Number',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      customRender: ({ index }:any) => index+1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      align: 'center',
      customRender: ({ text: date }) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center'
    },
  ])

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
      getTableData(current, pagesize)
    },
    onChange: (current: number) => {
      // 切换分页时的回调，
      pagination.current = current;
      getTableData(current, pagination.pageSize)
    },
  });

  const getTableData = async(page:number = pagination.current, size:number = pagination.pageSize) => {
    const token = localStorage.getItem('token')
    const params = {
      page,
      size,
      token
    }
    try {
      const { data } = await apiGetOracleTableParams(params)
      pagination.total = data.total
      pagination.current = data.page
      pagination.pageSize = data.pageSize
      oracleListData.value = data.data
      console.log('tableData:', oracleListData.value)
    } catch(err:any) {
      console.log('tableDataErr:', err)
    }
  }
  // 关闭邮件提醒弹框
  const closeMessageModal = ()=>{
    showMessage.value = false
  }

  const toDocs = () => {
    window.open('https://hamsternet.io/docs/')
  }

  onMounted(()=>{
    getTableData()
  })
  // 点击表格中的test按钮
  const showTestSubBtn = (record:any)=>{
    // 每次点击要先清除缓存中的数据，保证数据的准确性
    localStorage.removeItem('record')
    column.value = record
    localStorage.setItem('record',JSON.stringify(record))
    console.log('点击表格中的test按钮',column.value)
    showTestSub.value = true
  }
  // 跳转编辑请求页面（创建共用一个页面）
  const editRequest = (record:any)=>{
    console.log('跳转编辑请求页面（创建共用一个页面）',record)
    router.push(`/chainlink/oracle/create-request?id=${record.id}`)
  }

  // 下载请求
  const downloadRequest = (record:any)=>{
    const str = record.script;
    const url = `data:,${str}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.name}.js`;
    a.click();
    a.remove();
  }

  // 获取testsub数据
  const getTestSubInfo = (testSub:any)=>{
      console.log('添加消费者数据接收',testSub)
      showMessage.value = true
  }
  // 关闭testsub弹框
  const closeTestSub = (bool:boolean)=>{
      showTestSub.value = bool
  }
</script>

<style lang="less" scoped>
 .container-border {
  border: 1px solid #EBEBEB;
  border-radius: 12px;
  padding: 20px;
 }
 .table-btn {
    background-color: unset;
    color: #E2B578;
    border-radius: 32px;
  }
  .table-btn-disable {
    background-color: unset;
    color: #d9d9d9;
    border-radius: 32px;
    border-color: #E2B578;
    color: #E2B578;
  }
</style>

