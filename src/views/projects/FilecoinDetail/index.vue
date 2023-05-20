<template>
<BreadCrumb currentName="Filecoin Contract Editor" :isClick="false" class="mb-6"/>
<div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
    <a-button type="primary" style="float:right;margin-right: 20px;" @click="showCreateEvm">Create by Code</a-button>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="Solidity" tab="Solidity">
        <div class="flex">
          <div class="w-1/4 p-4">
            <div class="font-bold text-[#818998] mb-2">Contract Name</div>
            <div>
                <a-input v-model:value="name" placeholder="" allow-clear autocomplete="off" />
            </div>
            <div class="font-bold text-[#818998] my-2">FEATURES</div>
            <div class="flex justify-between items-center" v-for="(items, index) in featuresList" :key="index">
                <div>
                    <a-checkbox :name="items.name" @click="checkboxClick"> {{ items.label }}</a-checkbox>
                </div>
            </div>
          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="content"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="Rust" tab="Rust" disabled>
        <div class="flex">
          noData
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal :footer="null" centered="true" v-model:visible="createCodeVisible" title="Create by template" @cancel="createCodeVisible = false">
      <span class="text-sm">Project Name</span>
      <a-input placeholder="Project Name" v-model:value="codeNameValue" allowClear class="my-1"/>
      <span v-if="errorMsg" class="block text-[red]">{{ errorMsg }}</span>
      <span class="text-sm">Great project names are short and memorable.</span>
      <div class="mt-8 text-center">
        <a-button id="create-project-btn" type="primary" :loading="createCodeLoading" @click="handleOk">Done</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import BreadCrumb from '@/views/projects/components/Breadcrumb.vue'
import { ref,computed } from 'vue'
import { useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import CodeEditor from '@/components/CodeEditor.vue';
import { apiProjectsCode, apiDupProjectName } from "@/apis/projects";
import { message } from 'ant-design-vue'
const theme = useThemeStore()
const activeKey = ref('Solidity')
const createCodeVisible = ref(false)
const codeNameValue = ref()
const errorMsg = ref()
const createCodeLoading = ref()
const loading = ref(false)
const router = useRouter()
const name = ref('')
const content = ref('pragma solidity ^0.8.17;')
const featuresList = ref([
  { name: 'mintable', label: 'Mintable' },
  { name: 'burnable', label: 'Burnable' },
  { name: 'pausable', label: 'Pausable'},
  { name: 'permit', label: 'Permit'},
]);

// 弹出创建evm框
const showCreateEvm = ()=>{
    createCodeVisible.value = true
}
const checkDupName = computed(async () => {
  try {
    createCodeLoading.value = true;
    loading.value = true;
    //校验仓库名称是否存在
    const userInfo = localStorage.getItem('userInfo');
    const params = {
      owner: JSON.parse(userInfo)?.username,
      name: codeNameValue.value,
    }
    const res = await apiDupProjectName(params);
    console.log('res:',res)
    if (res.data === false) {
      createCodeLoading.value = false;
      return errorMsg.value = "Project Name duplication"
    } else if(codeNameValue.value == ''){
      createCodeLoading.value = false;
      return errorMsg.value = "Please enter Project Name"
    } else {
      return true
    }
  } catch (error: any) {
    console.log("erro:", error)
    createCodeLoading.value = false;
    return errorMsg.value = "Project Name check failure"
  }
})
// 表单数据校验
const handleOk = async ()=>{
  checkDupName.value.then((result)=>{
    if (result === true){
      console.log('success',result)
      createProject()
    } else {
      console.log('fail',result)
      errorMsg.value = result
      createCodeLoading.value = false
    }
  })
}

// 创建evm合约
const createProject = async () => {
  try {
    // loading.value = true;
    const createProjectTemp = localStorage.getItem('createProjectTemp');
    console.log('createProjectTemp',createProjectTemp)
    const params = {
      name: codeNameValue.value,
      type: JSON.parse(createProjectTemp)?.type - 0,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      fileName: name.value,
      content: content.value,
    }
    const res = await apiProjectsCode(params);
    message.success(res.message);
    window.localStorage.setItem("projectActiveKey", JSON.parse(createProjectTemp)?.type);
    router.push("/projects");
  } catch (error: any) {
    console.log("erro:",error)
    message.error(error.response.data.message);
  } finally {
    createCodeLoading.value = false
  }
}
// 点击FEATURES触发数据更新
const checkboxClick = ()=>{

}
</script>
<style scoped lang="less">
:deep(.ant-tabs-tab.ant-tabs-tab-disabled){
  color: #DCDCDC;
}
:deep(.ant-tabs-tab-btn){
  width: 100px;
  text-align: center;
}
</style>