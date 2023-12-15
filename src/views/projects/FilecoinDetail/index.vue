<template>
  <bread-crumb :routes="breadCrumbInfo" />
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="filecoin-detail mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] p-4 mt-[32px]">
    <div class="download-btn">
      <a-popover title="" class="mt-4 mr-4" placement="bottom">
        <template #content>
          <div v-if="isGithubInstallCheck">
            <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
            <div v-for="item in githubUsersInstallationsList" :key="item.id"
              class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
              @click="showCreateEvm(item)">
              <img :src="item.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
              <div>{{ item.name }}</div>
            </div>
            <div class="cursor-pointer hover:text-[#E2B578]" @click="addGithubAccount">
              <plus-outlined />
              Add Github Account
            </div>
          </div>

          <div v-else class="max-w-[150px] text-center">
            <p class="text-left">Install the Github application for getting permission to create code repository
            </p>
            <a-button type="primary" @click="intsallGithub">Install</a-button>
          </div>
        </template>
        <a-button type="primary w-[120px]" :loading="createProjectLoading">
          Create
        </a-button>
      </a-popover>
      <!-- <a-button type="primary" class="" @click="showCreateEvm">Download</a-button> -->
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="Solidity" tab="Solidity">
        <div class="flex">
          <div class="w-1/4 p-4">
            <div class="font-bold text-[#818998] mb-2">Contract Name</div>
            <div>
              <a-input v-model:value="name" placeholder="" allow-clear autocomplete="off" @change="getContent"
                oninput="value=value.replace(/^[0-9.]/g,'')" />
            </div>
            <div class="font-bold text-[#818998] my-2">FEATURES</div>
            <div>
              <div>
                <a-checkbox @click="makeDealFn(makeDealBool)" v-model:checked="makeDealBool"> makeDeal</a-checkbox>
              </div>
              <div>
                <a-checkbox @click="getDealFn(getDealBool)" v-model:checked="getDealBool"> getDeal</a-checkbox>
              </div>
              <div>
                <a-checkbox @click="handleFileCoinFn(handleFileCoinBool)" v-model:checked="handleFileCoinBool">
                  handleFileCoin</a-checkbox>
              </div>
              <div>
                <a-checkbox @click="updateActivationStatusFn(updateActivationStatusBool)"
                  v-model:checked="updateActivationStatusBool"> updateActivationStatus</a-checkbox>
              </div>
              <div>
                <a-checkbox @click="balanceFn(balanceBool)" v-model:checked="balanceBool"> balance</a-checkbox>
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
    <a-modal :footer="null" centered="true" v-model:visible="createCodeVisible" title="Create by template"
      @cancel="handleCancel">
      <a-form class="modal-form" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
        <a-form-item label="Project Name" name="name">
          <a-input class="modal-input" v-model:value="formData.name" placeholder="Please enter Project Name" allow-clear
            autocomplete="off" />
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import CodeEditor from '@/components/CodeEditor.vue';
import { apiProjectsCode, apiDupProjectName, apiGithubInstallCheck, apiGithubUsersInstallations } from "@/apis/projects";
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { getFileCoinContent } from '@/utils/fileCoinUtil';
import type { fileCoinContent } from '@/utils/fileCoinUtil';
import { Item } from "ant-design-vue/lib/menu";

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
  { name: 'makeDeal', label: 'makeDeal', checked: true },
  { name: 'getDeal', label: 'getDeal', checked: false },
  { name: 'handleFileCoin', label: 'handleFileCoin', checked: true },
  { name: 'updateActivationStatus', label: 'updateActivationStatus', checked: false },
  { name: 'balance', label: 'balance', checked: false },
]);
const gitUrl = ref('https://github.com/apps/Hamster-RW/installations/new');
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL);
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
const selectedInstallationsName = ref('');
const breadCrumbInfo = ref<any>([])
const isGithubInstallCheck = ref(false);
const githubUsersInstallationsList = ref([]);

// 弹出创建evm框
const showCreateEvm = (item: any) => {
  selectedInstallationsName.value = item.name;
  if (!name.value.trim()) {
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

const checkInstallGithub = async () => {
  const { data } = await apiGithubInstallCheck();
  isGithubInstallCheck.value = data
  if (data) {
    getGithubUsersInstallations();
  }
}

const getGithubUsersInstallations = async () => {
  const { data } = await apiGithubUsersInstallations()
  githubUsersInstallationsList.value = data
}

const addGithubAccount = () => {
  const state = new Date().getTime();
  const url = `${selectTargetUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700s')
}


const intsallGithub = () => {
  const state = new Date().getTime();
  const url = `${gitUrl.value}?state=${state}`;
  const myWindow = window.open(url, 'select_target', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
  myWindow?.focus()
}

// 创建evm合约
const createProject = async () => {
  try {
    // loading.value = true;
    const createProjectTemp = localStorage.getItem('createFormData');
    console.log('createProjectTemp', createProjectTemp)
    const params = {
      name: formData.name,
      type: JSON.parse(createProjectTemp)?.type - 0,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      fileName: name.value,
      content: content.value,
      repoOwner: selectedInstallationsName.value,
    }
    const res = await apiProjectsCode(params);
    message.success(res.message);
    window.localStorage.setItem("projectActiveKey", JSON.parse(createProjectTemp)?.type);
    router.push(`/projects/templates/integrated/${res.data}`);
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  } finally {
    createCodeLoading.value = false
  }
}
const getContent = async () => {
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
    console.log("err", err)
  }
}
// 点击FEATURES触发数据更新
const makeDealFn = async (bool: boolean) => {
  makeDealBool.value = !bool
  getContent()
}
const getDealFn = async (bool: boolean) => {
  getDealBool.value = !bool
  getContent()
}
const handleFileCoinFn = async (bool: boolean) => {
  handleFileCoinBool.value = !bool
  getContent()
}
const updateActivationStatusFn = async (bool: boolean) => {
  updateActivationStatusBool.value = !bool
  getContent()
}
const balanceFn = async (bool: boolean) => {
  balanceBool.value = !bool
  getContent()
}
onMounted(async () => {
  await getContent()
  checkInstallGithub()
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Template Market',
      path: '/projects/create'
    },
    {
      breadcrumbName: activeKey.value,
      path: ''
    },
  ]
})
</script>
<style scoped lang="less">
.filecoin-detail {
  position: relative;
}

.download-btn {
  position: absolute;
  right: 20px;
  top: 0px;
  z-index: 99;
}

:deep(.ant-tabs-tab.ant-tabs-tab-disabled) {
  color: #DCDCDC;
}

:deep(.ant-tabs-tab-btn) {
  width: 100px;
  text-align: center;
}
</style>
