<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="text-[32px] font-bold mb-4">
        <img
          src="@/assets/icons/apps-list.svg"
          class="h-[40px]"
        />
        Apps
      </div>
      <a-button type="primary" @click="showCreate=true">Create App</a-button>
    </div>
    <a-table
      :loading="loading"
      :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
      :columns="tableColumns"
      :dataSource="appsList"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'daylyRequests'">
          <Echarts :echartsId="`darkcharts${record.id}`" :echartsData="record.dayly_requests_7days" />
        </template>
        <template v-if="column.dataIndex === 'network'">
          {{ record.chain }}-{{ record.network }}
        </template>
        <template v-if="column.dataIndex === 'DaysOnHamster'">
          {{ dayjs( record.DaysOnHamster).diff(new Date(),'day') }}
          {{ dayjs( record.DaysOnHamster).diff(new Date(),'day') > 1 ? 'Days' : 'Day' }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="text-[#E2B578] cursor-pointer" @click="showView(record)">View API Key</div>
        </template>
      </template>
    </a-table>
  </div>  
  <CreateApp :isApps="true" :showCreate="showCreate" @setShowCreate="showCreate=false" @getApps="getApps" @setPage="setPage" />
  <a-modal v-model:visible="visibleView" :footer="null" :closable="false" width="600px">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Connent to Hamster</div>
    <a-form :model="appInfo" layout="vertical">
      <a-form-item label="API KEY" name="api_key" >
        <a-input disabled="true" v-model:value="appInfo.api_key">
          <template #suffix>
            <img @click="copyInfo(appInfo.api_key)"
              src="@/assets/icons/copy.svg"
              class="h-[19px] cursor-pointer"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="HTTPS" name="http_link" >
        <a-input disabled="true" v-model:value="appInfo.http_link">
          <template #suffix>
            <img @click="copyInfo(appInfo.http_link)"
              src="@/assets/icons/copy.svg"
              class="h-[19px] cursor-pointer"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="WEBSOCKETS" name="websocket_link" >
        <a-input disabled="true" v-model:value="appInfo.websocket_link">
          <template #suffix>
            <img @click="copyInfo(appInfo.websocket_link)"
              src="@/assets/icons/copy.svg"
              class="h-[19px] cursor-pointer"
            />
          </template>
        </a-input>
      </a-form-item>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="JavaScript">
          <div v-for="(item, index) in appInfo.code_examples.js" :key="index">
            <div class="flex justify-between text-[#000000] font-bold" :class="index === 0 ? 'mb-2' : 'my-2'">
              <div class="font-bold">{{ item.title }}</div>
              <img @click="copyInfo(item.code)"
                src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer"
              />
            </div>
            <div :style="item.style">
              <CodeEditor :readOnly="true" :value="item.code"></CodeEditor>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="CLI">
          <div v-for="(item, index) in appInfo.code_examples.cli" :key="index">
            <div class="flex justify-between text-[#000000] font-bold" :class="index === 0 ? 'mb-2' : 'my-2'">
              <div class="font-bold">{{ item.title }}</div>
              <img @click="copyInfo(item.code)"
                src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer"
              />
            </div>
            <div :style="item.style">
              <CodeEditor :readOnly="true" :value="item.code"></CodeEditor>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Python">
          <div v-for="(item, index) in appInfo.code_examples.python" :key="index">
            <div class="flex justify-between text-[#000000] font-bold" :class="index === 0 ? 'mb-2' : 'my-2'">
              <div class="font-bold">{{ item.title }}</div>
              <img @click="copyInfo(item.code)"
                src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer"
              />
            </div>
            <div :style="item.style">
              <CodeEditor :readOnly="true" :value="item.code"></CodeEditor>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Go">
          <div v-for="(item, index) in appInfo.code_examples.go" :key="index">
            <div class="flex justify-between text-[#000000] font-bold" :class="index === 0 ? 'mb-2' : 'my-2'">
              <div class="font-bold">{{ item.title }}</div>
              <img @click="copyInfo(item.code)"
                src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer"
              />
            </div>
            <div :style="item.style">
              <CodeEditor :readOnly="true" :value="item.code"></CodeEditor>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-form>
    <div class="text-center mt-4">
      <a-button type="primary" @click="visibleView=false" ghost>Learn More</a-button>
      <a-button class="ml-4" type="primary" @click="visibleView=false">Close</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
  import { useRouter } from "vue-router";
  import { apiGetApps } from "@/apis/apps";
  import Echarts from "@/components/Echarts.vue";
  import CreateApp from "./components/CreateApp.vue"
  import CodeEditor from "@/components/CodeEditor.vue"
  import { message } from 'ant-design-vue';
  import { useThemeStore } from "@/stores/useTheme";
import dayjs from 'dayjs';
  const theme = useThemeStore()

  const router = useRouter();
  const showCreate = ref(false);
  const appsList = ref([]); //app列表
  const appInfo = reactive({
    api_key: '',
    http_link: '',
    websocket_link: '',
    code_examples: {
      js: '',
      cli: '',
      python: '',
      go: '',
    }
  });
  const visibleView = ref(false)
  const loading = ref(false);
  const activeKey = ref("1");

  const tableColumns = computed<any[]>(() => [
    {
      title: 'App',
      dataIndex: 'name',
      align: 'center',
      ellipsis: 'fixed',
      key: 'name',
    },
    {
      title: 'Network',
      dataIndex: 'network',
      align: 'center',
      ellipsis: 'fixed',
      key: 'network',
    },
    {
      title: 'Total Requests（24h）',
      dataIndex: 'total_requests_today',
      key: 'total_requests_today',
      ellipsis: 'fixed',
      align: 'center',
    },
    {
      title: 'Dayly Requests（7days）',
      dataIndex: 'daylyRequests',
      align: 'center',
      ellipsis: 'fixed',
      key: 'daylyRequests',
      width: '200px'
    },
    {
      title: 'Days on Hamster',
      dataIndex: 'DaysOnHamster',
      align: 'center',
      ellipsis: 'fixed',
      key: 'DaysOnHamster',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '150px',
    },
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
      getApps();
    },
    onChange: (current: number) => {
      // 切换分页时的回调，
      pagination.current = current;
      getApps();
    },
    // showTotal: total => `总数：${total}人`, // 可以展示总数
  });

  onBeforeMount(() => {
    const connectedWallets = window.localStorage.getItem('alreadyConnectedWallets')
    // 如果 local storage 里没有保存的钱包，直接返回
    if (connectedWallets == null || connectedWallets === '[]') {
      router.push("/node-service/RPCs");
    } 
  });

  onMounted(async () => {
    getApps();
  });

  const setPage = async (val: number) => {
    pagination.current = val;
  }

  const getApps = async () => {
    loading.value = true;
    try {
      const account = window.localStorage.getItem("walletAccount");
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
      }
      const data = await apiGetApps(account, params);
      appsList.value = data.result;
      pagination.total = data.pagination.total;
      
    } catch (error: any) {
      console.log("erro:",error)
    } finally {
      loading.value = false;
    }
  };
  const showView = async (_items: any) => {
    visibleView.value = true;
    setCodeHeight(_items.code_examples.js);
    setCodeHeight(_items.code_examples.cli);
    setCodeHeight(_items.code_examples.go);
    setCodeHeight(_items.code_examples.python);
    Object.assign(appInfo, _items); //赋值
  } 
const setCodeHeight = (codeList: any[]) => {
    codeList.forEach((element,index) => {
      let style = 'height: 220px';
      let codeIndex = element.code.split('\n').length;
      if (codeIndex < 9) {
        style = 'height: ' + codeIndex * 22 + 'px';
      }
      codeList[index]['style'] = style;
    });
  }
  
  const copyInfo = async (_items: any) => {
    // 存储传递过来的数据
      let OrderNumber = _items;
      // 创建一个input 元素
      // createElement() 方法通过指定名称创建一个元素
      let newInput = document.createElement("input");
      // 讲存储的数据赋值给input的value值
      newInput.value = OrderNumber;
      // appendChild() 方法向节点添加最后一个子节点。
      document.body.appendChild(newInput);
      // 选中input元素中的文本
      // select() 方法用于选择该元素中的文本。
      newInput.select();
      // 执行浏览器复制命令
      try {
        //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
        await document.execCommand('Copy') // 执行浏览器复制命令
        // 清空输入框
        newInput.remove();
        message.success("copy success");
      } catch {
        message.error("copy failed");
      }
  }
</script>
<style scoped lang="less">
@baseColor: #E2B578;
:deep(.ant-tabs){
  color: #BBBAB9;
}
.codeScrollHeight {
  height: 220px;
}
:deep(.ant-tabs-nav-list){
  width: 100%;
}
:deep(.ant-tabs-tab){
  width: 25%;
  display: flex;
  justify-content: center;
}
:deep(.ant-tabs-top>.ant-tabs-nav:before){
  border-color: #F4F4F4 !important;
}
:deep(.ant-input-affix-wrapper-disabled){
  background-color: transparent;
  border-color: #EBEBEB;
  color: #BBBAB9;
}
:deep(.ant-btn-primary){
  width: 120px;
  height: 40px;
}
:deep(.ant-table){
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  color: #BBBAB9;
}
:deep(.ant-table-thead > tr > th) {
  color: #FFFFFF;
  font-weight: 400;
  border-bottom: none;
}
:deep(.white-css .ant-table-thead > tr > th) {
  background: #151210;
  color: #FFFFFF;
}
:deep(.dark-css .ant-table-thead > tr > th) {
  background: #4E4841;
  color: #FFFFFF;
}
:deep(.white-css .ant-table-tbody > tr > td){
  border-bottom: 1px solid #F4F4F4;
  color: #BBBAB9;
  background-color: #FFFFFF;
}
:deep(.dark-css .ant-table-tbody > tr > td){
  border-bottom: 1px solid #302D2D;
  color: #8A8A8A;
  background-color: #1D1C1A;
}
:deep(.dark-css .ant-table-tbody > tr.ant-table-row:hover > td),
:deep(.dark-css .ant-table-tbody > tr >td.ant-table-cell-row-hover){
  background-color: #1D1C1A ;
}
:deep(.ant-table-container table > thead > tr:first-child th:first-child){
  border-top-left-radius: 12px;
}
:deep(.ant-table-container table > thead > tr:first-child th:last-child){
  border-top-right-radius: 12px;
}
:deep(.ant-table-row:last-child .ant-table-cell:last-child),
:deep(.ant-table-row:last-child .ant-table-cell:first-child){
  border-radius: 0;
}
:deep(.ant-pagination-prev button),:deep(.ant-pagination-next button){
  color: #8A8A8A;
}
:deep(.ant-table-pagination.ant-pagination){
  margin: 0 0;
  padding: 16px 0;
  // background: #fff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
:deep(.white-css .ant-table-pagination.ant-pagination){
  background: #fff;
}
:deep(.dark-css .ant-table-pagination.ant-pagination){
  background: #1D1C1A;
}
:deep(.ant-pagination-item a){
  color: #8A8A8A;
}

:deep(.ant-pagination-disabled .ant-pagination-item-link), :deep(.ant-pagination-disabled:hover .ant-pagination-item-link) {
  color: #8A8A8A !important;
  cursor: not-allowed !important;
}
:deep(.ant-pagination-item a:hover), :deep(.ant-pagination-item-link:hover){
  color: #E2B578 !important;
}
:deep(.ant-pagination-item-active a){
  color: #fff !important;
}
:deep(.ant-pagination-item-active:hover){
  border-color: #E2B578 !important;
}
:deep(.ant-pagination-item-active a:hover){
  color: #fff !important;
}
:deep(.ant-pagination-item-active){
  border-radius: 4px;
  background: #E2B578;
  border-color: #E2B578;
}
</style>