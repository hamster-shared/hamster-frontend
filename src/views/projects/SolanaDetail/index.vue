<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex justify-between items-center">
      <bread-crumb :routes="breadCrumbInfo"/>
    </div>

    <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] mt-[32px] p-[32px]">
      <div class="flex">
        <div class="w-1/2">
          <div class="flex justify-between">
            <div class="text-[24px] font-bold">NFT Contract</div>
            <div v-if="false" class="dfx-css">dfx</div>
          </div>
          <div class="mt-[8px] mb-[24px] dark:text-[#E0DBD2] text-[#73706E]">NFT Contract description
          </div>
        </div>
      </div>
    </div>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
         class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="0" tab="Functions">
        <div class="flex">
          <div class="p-4 border-r-css w-1/4">
            <div class="flex items-center mb-4">
              <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
              <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Send
            </div>
            <div class="pb-4 "><!-- h-[120px] overflow-auto -->
              <div  @click="selectCurrent(index,'tx')"

                   :class="{ '!open-link-css active-css': current === index & type === 'tx' }"
                   class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px]  py-[10px]"
                   v-for="(item, index) in txList" :key="index">{{ item.name }}</div>
            </div>
            <div class="flex items-center mb-4">
              <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
              <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Call
            </div>
            <div class="pb-4 "><!-- h-[130px] overflow-auto -->
              <div @click="selectCurrent(index, 'rd')"
                   :class="{ '!open-link-css active-css': currentRd === index & type === 'rd' }"
                   class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px]  py-[10px]"
                   v-for="(item, index) in rdList" :key="index">{{ item.name }}</div>
              <!-- <div @click="setFunctionList(item)"
                :class="{ '!bg-[#E2B578] !text-white': item.name === functionName }"
                class="cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px] mt-4"
                class="w-min cursor-pointer text-[#73706E] dark:text-[#E0DBD2] dark:bg-[#36322D] bg-[#F9F9F9] rounded-[12px] mt-4 px-[30px] py-[12px]"
                v-for="(item, index) in callList" :key="index">{{ item.name }}</div> -->
            </div>
          </div>
          <div class="w-3/4 p-4" v-if=" type ==='tx' && txList &&  txList[current]">
            <div class="flex justify-between">
              <div class="text-[16px] font-bold">{{ txList[current].name }}</div>
              <div class="dark:text-[#E0DBD2] text-[#73706E]">inputs</div>
            </div>
            <a-table class="my-4" :columns="tableColumns" :dataSource="argList" :pagination="false"></a-table>
          </div>

          <div class="w-3/4 p-4" v-if=" type ==='rd' && rdList &&  rdList[currentRd]">
            <div class="flex justify-between">
              <div class="text-[16px] font-bold">{{rdList[currentRd].name}}</div>
              <div class="dark:text-[#E0DBD2] text-[#73706E]">inputs</div>
            </div>
            <a-table class="my-4" :columns="tableColumns" :dataSource="argList" :pagination="false"></a-table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1" tab="Events" >
        <div class="flex">
          <NoData />
        </div>
      </a-tab-pane>
    <a-tab-pane key="2" tab="Sources" >


      <div class="flex" :style="editHeight">
<!--        <div class="flex justify-between">-->
<!--          <div>{{ setText(templatesDetail.codeSources) }}</div>-->
<!--          <img @click="copyInfo(sourceContent)" src="@/assets/icons/copy.svg" class="h-[19px] cursor-pointer" />-->
<!--        </div>-->
<!--        <div class="cursor-pointer"></div>-->
<!--        <div class="mt-4" :style="editHeight">-->
          <CodeEditor :readOnly="true" :value="content"></CodeEditor>
<!--        </div>-->
      </div>
      </a-tab-pane>
    </a-tabs>
    </div>
  </div>
</template>
<script setup >
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import IDlJson from "./idl_token.json";
// import SOl from "./helloWorld.sol";

import {computed, onMounted, ref, shallowRef,watch} from "vue";
import NoData from "@/components/NoData.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import axios from "axios";


const theme = useThemeStore()
const breadCrumbInfo = ref([])
const activeKey = ref('0')

const current = ref(0)
const currentRd = ref(0)
const type = ref("tx");

const IDL = shallowRef(null);
const txList = shallowRef([]);
const rdList = shallowRef([]);
const content = ref();
const editHeight = ref("height: 220px");

const argList = ref([]);

onMounted(async () => {
  judgeOrigin()
    IDL.value = IDlJson.instructions;
  // content.value = SOl;
  getSol()
  NewList()
  setNewArr()

})

const setCodeHeight = (content) => {
  let codeIndex = content.split('\n').length;
  editHeight.value = 'height: ' + codeIndex * 22 + 'px';
}
const getSol = () =>{
  axios
      .get("https://raw.githubusercontent.com/hamster-contract/NFT/main/contracts/NFT.sol")
      .then(res => {
        if (res.data) {

          content.value = res.data;
            setCodeHeight(content.value);

        }
      });
}


const setNewArr = () =>{
  if(!IDL.value)return;
  let arr = [];
  if(type.value ==="tx" ){
    txList.value[current.value]?.args.map((item)=>{
      let formatType = typeof item.type === "object" ? JSON.stringify(item.type):item.type
      let formatItem = {
        ...item,
      }
      formatItem.type = formatType;
      arr.push({
        ...formatItem,
        value:""
      })
    })
    argList.value = arr;
  }else{
    rdList.value[currentRd.value]?.args.map((item)=>{
      arr.push({
        ...item,
        value:""
      })
    })
    argList.value = arr;
  }
}

const tableColumns = computed(() => [
  {
    title: 'NAME',
    dataIndex: 'name',
    align: 'center',
    ellipsis: 'fixed',
    key: 'name',
  },
  {
    title: 'TYPE',
    dataIndex: 'type',
    align: 'center',
    ellipsis: 'fixed',
    key: 'type',
  },
]);

watch([current,currentRd], () => {
  setNewArr()
})

const NewList = () =>{
  if(!IDL.value)return;
  let txArr = [];
  let rdArr = [];

  IDL.value.map((item)=>{
    const isWrite = item.accounts.filter((inItem)=>inItem.isMut);

    if(isWrite.length){
      txArr.push(item)
    }else{
      rdArr.push(item)
    }


  })
  txList.value = txArr;
  rdList.value = rdArr;
}

const selectCurrent = (index,tp) =>{
  type.value = tp;
  if(tp === "tx"){
    current.value = index;
  }else{
    currentRd.value = index;
  }

}

const judgeOrigin = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName:'Create Project',
      path:'/projects/create'
    },
    {
      breadcrumbName:'Solana Template',
      path:`projects/templates/solana/details`
    }
  ]
}
</script>

<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.ant-btn-primary) {
  width: 150px;
  height: 40px;
}

:deep(.ant-checkbox-wrapper),
:deep(.ant-checkbox-disabled+span),
:deep(.dark-css .ant-checkbox-disabled+span) {
  color: @baseColor;
}

:deep(.ant-checkbox-wrapper+.ant-checkbox-wrapper) {
  margin-left: 0px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: var(--ant-primary-color);
}

:deep(.ant-checkbox-disabled .ant-checkbox-inner),
:deep(.dark-css .ant-checkbox-disabled .ant-checkbox-inner) {
  border-color: var(--ant-primary-color) !important;
}

:deep(.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner:after) {
  border-color: #FFFFFF;
}

ul {
  padding-inline-start: 1rem;
}

// :deep(.dark-css .ant-tabs) {
//   color: #E0DBD2;
// }

:deep(.dark-css .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FFFFFF;
}

:deep(.ant-tabs-tab-btn) {
  width: 100px;
  text-align: center;
}


pre {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.up-tran {
  transform: rotate(90deg);
  transition: all .3s, visibility 0s;
}

:deep(.ant-collapse-item-active .up-tran) {
  transform: rotate(180deg);
}
:deep(.ant-collapse-item-active){
  border: 1px solid #E2B578;
  border-radius: 8px !important;
}
:deep(.ant-collapse-item:last-child>.ant-collapse-content){
  border-radius: 0 0 8px 8px !important;
}
:deep(.ant-collapse){
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 8px;
  border: 1px solid #EBEBEB;
  margin-bottom: 30px;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header){
  font-weight: bold;
}

.active-css{
  background: rgba(226, 181, 120, 0.2);
  // box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  width: 200px;
}
.dark-css{
  .border-r-css{
    border-right: 1px solid #434343;
  }
}
.white-css{
  .border-r-css{
    border-right: 1px solid #EBEBEB;
  }
}
</style>

<style lang="less">
.create-template-modal {
  .ant-modal-body {
    .ant-input-affix-wrapper {
      // border-color: #d9d9d9;
      margin: 8px 0;
    }
  }

  .ant-modal-header {
    border-bottom: none !important;
    padding-bottom: 8px;
  }
}
</style>
