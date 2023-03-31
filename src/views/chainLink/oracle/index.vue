<template>
  <div class="flex flex-col w-full px-6">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="MainNet"><oracleChart></oracleChart></a-tab-pane>
      <a-tab-pane key="2" tab="TestNet"><oracleChart></oracleChart></a-tab-pane>
    </a-tabs>

    <div class="flex flex-col w-[1096px] self-center">
      <div class="my-4">
        <div class="mb-4">Create Request</div>
        <a-button>Create Request</a-button>
        <a-button class="ml-2">Docs</a-button>
      </div>
      <div>
        <a-table :dataSource="oracleListData" :columns="oracleColumns" :pagination="pagination" style="width:100%">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button type="link">Details</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import oracleChart from '../components/oracleChart.vue'

  const activeKey = ref('1')

  const oracleListData = reactive([
    {
      key: '1',
      number: '1',
      name: 'Weather',
      time: 32,
    },
    {
      key: '2',
      number: '2',
      name: 'Price_PTC',
      time: 42,
    },
  ])

  const oracleColumns = reactive([
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Created',
      dataIndex: 'time',
      key: 'time',
      align: 'center'
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
    },
    onChange: (current: number) => {
      // 切换分页时的回调，
      pagination.current = current;
    },
  });
</script>

