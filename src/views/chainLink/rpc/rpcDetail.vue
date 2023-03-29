<template>
  <div class="rpc-detail">
    <Breadcrumb :currentName="projectName" :isClick="loading"></Breadcrumb>
    <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px]">
      <div class="font-bold text-[20px]">Ethereum</div>
      <a-radio-group v-model:value="tabNetwork">
        <a-radio-button value="Mainnet">Mainnet</a-radio-button>
        <a-radio-button value="Testnet">Testnet</a-radio-button>
      </a-radio-group>
      <div>
        <div></div>
        <div>
          <div class="font-bold text-[18px] mb-[8px] mt-[24px]">RPC</div>
          <div
            class="flex justify-between p-[24px] border border-solid border-[#E2B578] bg-[#FFFCF9] dark:bg-[#36322D] rounded-[12px] cursor-pointer">
            <div>111</div>
            <div class="text-[#E2B578]">Copy</div>
          </div>
        </div>
        <div>
          <div class="font-bold text-[18px] mb-[8px] mt-[24px]">Websocket</div>
          <div
            class="flex justify-between p-[24px] border border-solid border-[#E2B578] bg-[#FFFCF9] dark:bg-[#36322D] rounded-[12px] cursor-pointer">
            <div>222</div>
            <div class="text-[#E2B578]">Copy</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px]">
      <div class="font-bold text-[20px]">Choose a language</div>
      <a-radio-group v-model:value="tabLanguage">
        <a-radio-button :value="item" v-for="item in languageList" :key="item">{{ item }}</a-radio-button>
      </a-radio-group>
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