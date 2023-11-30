<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <a-table :columns="columns" :data-source="tableData" :pagination="pagination" 
      @expand="getInnerTableData" :rowKey="(record: any) => { return record.method}"
      :expandedRowKeys="expandedRowKeys" >
      <template #expandedRowRender="{record, index, indent, expanded}">
        <a-table :rowKey="record.method" :columns="innerColumns" :data-source="innerData[record.method]" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'volume'">
              {{ record.HttpsNum }} Http , {{ record.WssNum }} WS
            </template>
        </template>
        </a-table>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
import { useRoute } from 'vue-router';
import { apiZanApiKeyRequestActivityStats, apiZanApiKeyRequestActivityStatsFail } from "@/apis/middlewareRPC";

const route = useRoute()
const theme = useThemeStore();
const props = defineProps({
  activityParam: {
    type: Object as any,
    default: {}
  },
});
const { activityParam } = toRefs(props);

const apiKeyId:any = route.query.apiKeyId || '';

const tableData = ref<any>([]);
const innerData = ref<any>([]);
const expandedRowKeys = ref<any>([]); // 展开的行，控制属性
const columns = reactive([
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Volume', dataIndex: 'totalNum', key: 'totalNum' },
  { title: 'Failled', dataIndex: 'failedNum', key: 'failedNum' },
]);
const innerColumns = reactive([
  { title: 'Status', dataIndex: 'Status', key: 'Status' },
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
const getTableData = async () => {

  let res = await apiZanApiKeyRequestActivityStats(apiKeyId, activityParam?.value.time, activityParam?.value.chain);
  console.log("res:", res);
  if (res.code == 200) {
    expandedRowKeys.value.length = 0; //清空展开的数据
    tableData.value = res.data;
  }
}
const getInnerTableData = async (expanded: any, record: any) => {
  console.log('expanded:',expanded, '  record:',record);
  if (expanded) {
    let res = await apiZanApiKeyRequestActivityStatsFail(apiKeyId, activityParam?.value.time, activityParam?.value.chain, record.method);
    console.log("res:", res);
    if (res.code == 200) {
      innerData.value[record.method] = res.data;
      expandedRowKeys.value.push(record.method);
    }
  } else {
    //折叠时，删除选中的值
    expandedRowKeys.value.splice(expandedRowKeys.value.indexOf(record.method),1)
  }
}
onMounted(() => {
  getTableData();
});
defineExpose({
  getTableData
});
</script>
<style scoped>
:deep(.ant-table-tbody>tr>td>.ant-table-expanded-row-fixed>.ant-table-wrapper:only-child .ant-table),
:deep(.ant-table-tbody>tr>td>.ant-table-wrapper:only-child .ant-table){
  margin: -16px;
}
:deep(.ant-table-thead > tr > th){
  color: #ffffff !important;
  font-weight: 600;
  font-size: 16px;
}
:deep(.ant-table-expanded-row .ant-table-container table > thead > tr:first-child th:first-child){
  border-top-left-radius: 0px!important;
}
:deep(.ant-table-expanded-row .ant-table-container table > thead > tr:first-child th:last-child){
  border-top-right-radius: 0px!important;
}
:deep(.ant-table-row:last-child .ant-table-cell:first-child),
:deep(.ant-table-row:last-child .ant-table-cell:last-child),
:deep(.ant-table-tbody .ant-table-cell:only-of-type){
  border-radius: 0px;
}
:deep(.ant-table-pagination.ant-pagination){
  padding: 16px 0;
  margin: 0px !important;
  background-color: #F6F6F6;
  border-radius: 0 0 12px 12px;
}
.dark-css{
  :deep(.ant-table-pagination.ant-pagination){
    background-color: #363636;
  }
}
:deep(.ant-table-row-expand-icon){
  color:#454545;
}
</style>

