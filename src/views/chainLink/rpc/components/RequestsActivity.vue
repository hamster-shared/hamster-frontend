<template>
  <a-table :columns="columns" :data-source="tableData" class="components-table-demo-nested">
    <template #expandedRowRender>
      <a-table :columns="innerColumns" :data-source="innerData" :pagination="false">
      </a-table>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';


const tableData = ref([{'method':'testhie mehto', 'volume':40, 'failled':5}]);
const innerData = ref([{'status':405, 'failled':5}]);
const columns = reactive([
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Volume', dataIndex: 'volume', key: 'volume' },
  { title: 'Failled', dataIndex: 'failled', key: 'failled' },
]);
const innerColumns = reactive([
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Volume', dataIndex: 'volume', key: 'volume' },
]);

</script>

