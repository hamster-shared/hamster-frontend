<template>
  <div class="rpc-detail">
    <Breadcrumb :currentName="projectName" :isClick="loading"></Breadcrumb>
    <div
      class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="">
        <svg-icon name="rpc-icon" size="30" class="mr-[10px]" />
        <span class="font-bold text-[24px] mr-[20px] align-middle">Ethereum</span>
        <span class="text-[#E2B578] border border-solid border-[#E2B578] rounded-[32px] px-[15px] py-[6px]">Add
          Network</span>
      </div>
      <a-tabs v-model:activeKey="tabNetwork">
        <a-tab-pane key="Mainnet" tab="Mainnet"></a-tab-pane>
        <a-tab-pane key="Testnet" tab="Testnet" force-render></a-tab-pane>
      </a-tabs>
      <div>
        <div></div>
        <div>
          <div class="text-[16px] mb-[12px] mt-[24px]">RPC</div>
          <div
            class="flex justify-between p-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] cursor-pointer">
            <div class="font-bold">111</div>
            <div class="text-[#E2B578] ">
              <svg-icon name="copy" size="18" class="mr-[4px]" />
              <span class="text-[16px]">Copy</span>
            </div>
          </div>
        </div>
        <div>
          <div class="text-[16px] mb-[12px] mt-[24px]">Websocket</div>
          <div
            class="flex justify-between p-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] cursor-pointer">
            <div class="font-bold">222</div>
            <div class="text-[#E2B578]">
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
      <div>
        <div class="text-right cursor-pointer text-[#E2B578]" @click="copyInfo">
          <svg-icon name="copy" size="18"></svg-icon>
          Copy Code
        </div>
      </div>
      <div class="mt-4" :style="editHeight">
        <CodeEditor :readOnly="true" :value="sourceContent"></CodeEditor>
      </div>
      <div class="mt-[32px]">
        <a-table :dataSource="dataSource" :columns="columns"></a-table>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref } from "vue";
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