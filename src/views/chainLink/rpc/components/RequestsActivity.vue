<template>
  <a-table :columns="columns" :data-source="tableData" :pagination="pagination">
    <template #expandedRowRender>
      <a-table :columns="innerColumns" :data-source="innerData" :pagination="false">
      </a-table>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';


const tableData = ref([{'method':'testhie mehto', 'volume':40, 'failled':5}]);
const innerData = ref([{'status':405, 'volume':5}]);
const columns = reactive([
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Volume', dataIndex: 'volume', key: 'volume' },
  { title: 'Failled', dataIndex: 'failled', key: 'failled' },
]);
const innerColumns = reactive([
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Volume', dataIndex: 'volume', key: 'volume' },
]);
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
    getTableData()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getTableData()
  },
});
const getTableData = () => {

}

</script>

