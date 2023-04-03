<template>
  <div class="rpc-detail">
    <Breadcrumb :currentName="projectName" :isClick="loading"></Breadcrumb>
    <div
      class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="">
        <svg-icon name="rpc-icon" size="30" class="mr-[10px] cursor-default" />
        <span class="font-bold text-[24px] mr-[20px] align-middle">Ethereum</span>
        <span class="text-[#E2B578] border border-solid border-[#E2B578] rounded-[32px] px-[15px] py-[6px]">Add
          Network</span>
      </div>
      <a-tabs v-model:activeKey="tabNetwork">
        <a-tab-pane key="Mainnet" tab="Mainnet"></a-tab-pane>
        <a-tab-pane key="Testnet" tab="Testnet" force-render></a-tab-pane>
      </a-tabs>
      <div>
        <div>
          <div class="grid grid-cols-3 gap-1">
            <div>Chain ID</div>
            <div>Native Token</div>
            <div>Explorers</div>
          </div>
          <div class="grid grid-cols-3 gap-1 font-bold mt-[10px] dark:text-[#E0DBD2] text-[#383B46]">
            <div>1</div>
            <div>ETH</div>
            <div>https://etherscan.io</div>
          </div>
        </div>
        <div>
          <div class="text-[16px] mb-[12px] mt-[32px]">RPC</div>
          <div
            class="flex justify-between p-[16px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
            <div class="font-bold">111</div>
            <div class="text-[#E2B578] cursor-pointer">
              <svg-icon name="copy" size="18" class="mr-[4px]" />
              <span class="text-[16px]">Copy</span>
            </div>
          </div>
        </div>
        <div>
          <div class="text-[16px] mb-[12px] mt-[24px]">Websocket</div>
          <div
            class="flex justify-between p-[16px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
            <div class="font-bold">222</div>
            <div class="text-[#E2B578] cursor-pointer">
              <svg-icon name="copy" size="18" class="mr-[4px]" />
              <span class="text-[16px]">Copy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="font-bold text-[20px]">Choose a language</div>
      <a-tabs v-model:activeKey="tabLanguage">
        <a-tab-pane :tab="item" v-for="item in languageList" :key="item"></a-tab-pane>
      </a-tabs>
      <div class="text-right">
        <span class="text-right cursor-pointer text-[#E2B578]" @click="copyInfo">
          <svg-icon name="copy" size="18"></svg-icon>
          Copy Code
        </span>
      </div>
      <div class="mt-4" :style="editHeight">
        <CodeEditor :readOnly="true" :value="sourceContent"></CodeEditor>
      </div>
      <div class="mt-[32px]">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination"></a-table>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive } from "vue";
import Breadcrumb from "@/views/projects/components/Breadcrumb.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { message } from "ant-design-vue";
const projectName = ref('Ethereum');
const loading = ref(false);
const dataSource = ref([]);
const tabLanguage = ref('JavaScript');
const tabNetwork = ref('Mainnet');
const languageList = ref(['JavaScript', 'Python', 'JAVA', 'Go']);
const editHeight = ref("height: 220px");
const sourceContent = ref("11");

const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    align: "center",
    key: 'number',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    align: "center",
    key: 'time',
  },
  {
    title: 'Request event',
    dataIndex: 'requestEvent',
    align: "center",
    key: 'requestEvent',
  },
  {
    title: 'Request result',
    dataIndex: 'requestResult',
    align: "center",
    key: 'requestResult',
  },
]

const pagination = reactive({
  // 分页配置器
  pageSize: 5, // 一页的数据限制
  current: 1, // 当前页
  total: 0, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['5'], // 指定每页可以显示多少条
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

const copyInfo = async (_items: any) => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = sourceContent.value;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('copy success')
}
</script>
<style lang='less' scoped>
:deep(.ant-radio-group .ant-radio-button-wrapper) {
  border-radius: 0;
}

:deep(.ant-radio-group) {
  margin-top: 24px;
}
</style>