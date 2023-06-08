<template>
<bread-crumb :routes="breadCrumbInfo"/>
<div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
    <a-button type="primary" style="float:right;margin-right: 20px;" @click="showCreateEvm">Create by Code</a-button>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="Solidity" tab="Solidity">
        <div class="flex">
          <div class="w-1/4 p-4">
            <div class="font-bold text-[#818998] mb-2">Contract Name</div>
            <div>
                <a-input v-model:value="name" placeholder="" allow-clear autocomplete="off" @change="getContent" oninput="value=value.replace(/^[0-9.]/g,'')"/>
            </div>
            <div class="font-bold text-[#818998] my-2">FEATURES</div>
            <div>
                <div>
                  <a-checkbox  @click="makeDealFn(makeDealBool)" v-model:checked="makeDealBool"> makeDeal</a-checkbox>
                </div>
                <div>
                  <a-checkbox  @click="getDealFn(getDealBool)" v-model:checked="getDealBool"> getDeal</a-checkbox>
                </div>
                <div>
                  <a-checkbox  @click="handleFileCoinFn(handleFileCoinBool)" v-model:checked="handleFileCoinBool"> handleFileCoin</a-checkbox>
                </div>
                <div>
                  <a-checkbox  @click="updateActivationStatusFn(updateActivationStatusBool)" v-model:checked="updateActivationStatusBool"> updateActivationStatus</a-checkbox>
                </div>
                <div>
                  <a-checkbox  @click="balanceFn(balanceBool)" v-model:checked="balanceBool"> balance</a-checkbox>
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
    <a-modal :footer="null" centered="true" v-model:visible="createCodeVisible" title="Create by template" @cancel="handleCancel">
      <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
        <a-form-item label="Project Name" name="name">
          <a-input class="modal-input" v-model:value="formData.name" placeholder="Please enter Project Name" allow-clear autocomplete="off" />
        </a-form-item>
      </a-form>
      <span class="text-sm">Great project names are short and memorable.</span>
      <div class="mt-8 text-center">
        <a-button id="create-project-btn" type="primary" :loading="createProjectLoading" @click="handleOk">Done</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import { ref,computed,onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import CodeEditor from '@/components/CodeEditor.vue';
import { apiProjectsCode, apiDupProjectName } from "@/apis/projects";
import { message } from 'ant-design-vue'
import { getFileCoinContent} from '@/utils/fileCoinUtil';
import type { fileCoinContent } from '@/utils/fileCoinUtil';
const theme = useThemeStore()
const activeKey = ref('Solidity')
const createCodeVisible = ref(false)
const codeNameValue = ref()
const createCodeLoading = ref()
const loading = ref(false)
const router = useRouter()
const name = ref('')
const content = ref()
const featuresList = ref([
  { name: 'makeDeal', label: 'makeDeal', checked:true },
  { name: 'getDeal', label: 'getDeal', checked:false },
  { name: 'handleFileCoin', label: 'handleFileCoin', checked:true},
  { name: 'updateActivationStatus', label: 'updateActivationStatus', checked:false},
  { name: 'balance', label: 'balance', checked:false},
]);
const makeDealBool = ref(false)
const getDealBool = ref(false)
const handleFileCoinBool = ref(false)
const updateActivationStatusBool = ref(false)
const balanceBool = ref(false)
const formRef = ref();
const createProjectLoading = ref(false)
const userInfo = localStorage.getItem('userInfo');
const formData = reactive({
  name: '',
});
const breadCrumbInfo = ref<any>([])

// 弹出创建evm框
const showCreateEvm = ()=>{
  if(!name.value.trim()){
    message.error('Please input the Contract Name!')
    return
  }
    createCodeVisible.value = true
}
let reg = /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/
const formRules = computed(() => {

  const checkDupName = async () => {
    try {
      //校验仓库名称是否存在
      const params = {
        owner: JSON.parse(userInfo)?.username,
        name: formData.name,
      }
      // console.log('formdataName:', params)
      const res = await apiDupProjectName(params);
      if (formData.name && !reg.test(formData.name)) {
        return Promise.reject("Please enter correct name");
      } else if (res.data === false) {
        return Promise.reject("Project Name duplication");
      } else {
        return Promise.resolve()
      }
    } catch (error: any) {
      console.log("erro:", error)
      return Promise.reject("Project Name check failure");
    }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter name!'), { validator: checkDupName, trigger: "change" }],
  };
});
// 表单数据校验
const handleOk = async () => {
  await formRef.value.validate();
  createProjectLoading.value = true;
  createProject()
}
const handleCancel = () => {
  createProjectLoading.value = false
  formRef.value.resetFields()
}

// 创建evm合约
const createProject = async () => {
  try {
    // loading.value = true;
    const createProjectTemp = localStorage.getItem('createFormData');
    console.log('createProjectTemp',createProjectTemp)
    const params = {
      name: formData.name,
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
const getContent = async()=>{
  // const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  const params: fileCoinContent = {
    name: name.value,
    makeDeal: makeDealBool.value,
    getDeal: getDealBool.value,
    handleFileCoin: handleFileCoinBool.value,
    updateActivationStatus: updateActivationStatusBool.value,
    balance: balanceBool.value,
  };
  try {
    const fileCoinContent = await getFileCoinContent(params);
    content.value = fileCoinContent
  } catch (err) {
    console.log("err",err)
  }
}
// 点击FEATURES触发数据更新
const makeDealFn = async (bool:boolean) => {
  makeDealBool.value = !bool
  getContent()
}
const getDealFn = async (bool:boolean) => {
  getDealBool.value = !bool
  getContent()
}
const handleFileCoinFn = async (bool:boolean) => {
  handleFileCoinBool.value = !bool
  getContent()
}
const updateActivationStatusFn = async (bool:boolean) => {
  updateActivationStatusBool.value = !bool
  getContent()
}
const balanceFn = async (bool:boolean) => {
  balanceBool.value = !bool
  getContent()
}
onMounted(async()=>{
  await getContent()
  breadCrumbInfo.value = [
      {
        breadcrumbName:'Create',
        path:'/projects/create'
      },
      {
        breadcrumbName:'Filecoin Contract Editor',
        path:''
      },
    ]
})
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
