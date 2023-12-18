<template>
  <Breadcrumb :routes="breadCrumbInfo" />
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
    <div class="flex" style="float:right;margin-right: 20px;" v-if="tokenMatemaskWallet">
      <a-popover title="" class="ml-4 " placement="bottom">
        <template #content>
          <div v-if="isGithubInstallCheck">
            <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
            <div v-for="item in githubUsersInstallationsList" :key="item.id"
              class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
              @click="showCreateCodeVisible(item)">
              <img :src="item.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
              <div>{{ item.name }}</div>
            </div>
            <NoData v-if="githubUsersInstallationsList.length === 0"></NoData>
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
        <a-button type="primary" :loading="createProjectLoading">
          Create
        </a-button>
      </a-popover>
      <a-button type="primary" @click="downloadInfo">Download</a-button>
    </div>

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="ERC20" tab="ERC20">
        <div class="flex">
          <div class="w-1/4 p-4">
            <SettingsERC20 :opts="optsERC20" @showContract="setContract" />
            <FeaturesERC20 :opts="optsERC20" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC20" @showContract="setContract" />
            <Upgradeability :opts="optsERC20" @showContract="setContract" />
            <InfoSection :opts="optsERC20" @showContract="setContract" />
            <!-- <a-button v-if="!tokenMatemaskWallet" type="primary" class="mt-4" :loading="loading"
              @click="createCodeVisible = true">Download</a-button> -->
            <div class="flex">
              <a-popover title="" class="mt-4 mr-4" placement="bottom">
                <template #content>
                  <div v-if="isGithubInstallCheck">
                    <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
                    <div v-for="item in githubUsersInstallationsList" :key="item.id"
                      class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
                      @click="showCreateCodeVisible(item)">
                      <img :src="item.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
                      <div>{{ item.name }}</div>
                    </div>
                    <NoData v-if="githubUsersInstallationsList.length === 0"></NoData>
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
                <a-button type="primary" :loading="createProjectLoading">
                  Create
                </a-button>
              </a-popover>
              <a-button v-if="!tokenMatemaskWallet" type="primary" class="mt-4" :loading="loading"
                @click="downloadInfo">Download</a-button>
            </div>

          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC20"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="ERC721" tab="ERC721">
        <div class="flex">
          <div class="w-1/4 p-4">
            <SettingsERC721 :opts="optsERC721" @showContract="setContract" />
            <FeaturesERC721 :opts="optsERC721" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC721" @showContract="setContract" />
            <Upgradeability :opts="optsERC721" @showContract="setContract" />
            <InfoSection :opts="optsERC721" @showContract="setContract" />
            <!-- <a-button v-if="!tokenMatemaskWallet" type="primary" class="mt-4" :loading="loading"
              @click="createCodeVisible = true">Download</a-button> -->
            <div class="flex">
              <a-popover title="" class="mt-4 mr-4" placement="bottom">
                <template #content>
                  <div v-if="isGithubInstallCheck">
                    <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
                    <div v-for="item in githubUsersInstallationsList" :key="item.id"
                      class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
                      @click="showCreateCodeVisible(item)">
                      <img :src="item.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
                      <div>{{ item.name }}</div>
                    </div>
                    <NoData v-if="githubUsersInstallationsList.length === 0"></NoData>
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
                <a-button type="primary" :loading="createProjectLoading">
                  Create
                </a-button>
              </a-popover>
              <a-button v-if="!tokenMatemaskWallet" type="primary" class="mt-4" :loading="loading"
                @click="downloadInfo">Download</a-button>
            </div>

          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC721"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="ERC1155" tab="ERC1155">
        <div class="flex">
          <div class="w-1/4 p-4">
            <SettingsERC1155 :opts="optsERC1155" @showContract="setContract" />
            <FeaturesERC1155 :opts="optsERC1155" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC1155" @showContract="setContract" />
            <Upgradeability :opts="optsERC1155" @showContract="setContract" />
            <InfoSection :opts="optsERC1155" @showContract="setContract" />
            <!-- <a-button type="primary" class="mt-4" :loading="loading" @click="createCodeVisible = true">Download</a-button> -->
            <div class="flex">
              <a-popover title="" class="mt-4 mr-4" placement="bottom">
                <template #content>
                  <div v-if="isGithubInstallCheck">
                    <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
                    <div v-for="item in githubUsersInstallationsList" :key="item.id"
                      class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
                      @click="showCreateCodeVisible(item)">
                      <img :src="item.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
                      <div>{{ item.name }}</div>
                    </div>
                    <NoData v-if="githubUsersInstallationsList.length === 0"></NoData>
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
                <a-button type="primary" :loading="createProjectLoading">
                  Create
                </a-button>
              </a-popover>
              <a-button type="primary" class="mt-4" :loading="loading" @click="downloadInfo">Download</a-button>
            </div>

          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC1155"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal :footer="null" centered="true" class="create-template-modal" v-model:visible="createCodeVisible"
      title="Create by template" @cancel="handleCancel">
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
import { onMounted, ref, computed, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Breadcrumb from "@/components/BreadCrumb.vue";
import { erc20, erc721, erc1155, infoDefaults } from '@openzeppelin/wizard';
import InfoSection from './components/InfoSection.vue';
import Upgradeability from './components/Upgradeability.vue';
import AccessControl from './components/AccessControl.vue';
import FeaturesERC20 from './components/FeaturesERC20.vue';
import SettingsERC20 from './components/SettingsERC20.vue';
import FeaturesERC721 from './components/FeaturesERC721.vue';
import SettingsERC721 from './components/SettingsERC721.vue';
import FeaturesERC1155 from './components/FeaturesERC1155.vue';
import SettingsERC1155 from './components/SettingsERC1155.vue';
import CodeEditor from '@/components/CodeEditor.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useThemeStore } from "@/stores/useTheme";
import { apiProjectsCode, apiDupProjectName, apiGithubInstallCheck, apiGithubUsersInstallations } from "@/apis/projects";
import { message } from "ant-design-vue";
import NoData from "@/components/NoData.vue";
import { downloadRequest } from '@/utils/tool'
const theme = useThemeStore()
const router = useRouter();
const gitUrl = ref('https://github.com/apps/Hamster-RW/installations/new')
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL);
const selectedInstallationsName = ref('');
const createCodeLoading = ref(false)
const createCodeVisible = ref(false)
const codeNameValue = ref('')
const errorMsg = ref()
const breadCrumbInfo = ref<any>([])
const createProjectLoading = ref(false)
const formRef = ref();
const userInfo = localStorage.getItem('userInfo');
const formData = reactive({
  name: '',
});
const isGithubInstallCheck = ref(false);
const githubUsersInstallationsList = ref([]);

const optsERC20 = ref({
  kind: 'ERC20',
  ...erc20.defaults,
  premint: '', // default to empty premint in UI instead of 0
  info: { ...infoDefaults }, // create new object since Info is nested
});
const contractERC20 = ref();

const optsERC721 = ref({
  kind: 'ERC721',
  ...erc721.defaults,
  premint: '', // default to empty premint in UI instead of 0
  info: { ...infoDefaults }, // create new object since Info is nestedv
});
const contractERC721 = ref();

const optsERC1155 = ref({
  kind: 'ERC1155',
  ...erc1155.defaults,
  premint: '', // default to empty premint in UI instead of 0
  info: { ...infoDefaults }, // create new object since Info is nestedv
});
const contractERC1155 = ref();

const { params } = useRoute();
const contractName = ref(params.contractName);
const activeKey = ref<any>(contractName);
const loading = ref(false);
const tokenMatemaskWallet = ref()

onMounted(async () => {
  optsERC20.value.name = 'ExampleToken';
  optsERC20.value.symbol = 'ETK';
  optsERC20.value.premint = '1000000';

  contractERC20.value = erc20.print(optsERC20.value);

  optsERC721.value.name = 'ExampleToken';
  optsERC721.value.symbol = 'ETK';
  contractERC721.value = erc721.print(optsERC721.value);

  optsERC1155.value.name = 'ExampleToken';
  optsERC1155.value.uri = '';
  contractERC1155.value = erc1155.print(optsERC1155.value);
  tokenFrom()
  judgeOrigin()
  checkInstallGithub()
})

// 判断跳转来源
const judgeOrigin = () => {
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Template Market',
      path: '/projects/create'
    },
    {
      breadcrumbName: 'Templates',
      path: `/projects/template/1`
    },
    {
      breadcrumbName: activeKey.value,
      path: ''
    },
  ]
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


const intsallGithub = () => {
  const state = new Date().getTime();
  const url = `${gitUrl.value}?state=${state}`;
  const myWindow = window.open(url, 'select_target', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
  myWindow?.focus()
}

const addGithubAccount = () => {
  const state = new Date().getTime();
  const url = `${selectTargetUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700s')
}

const showCreateCodeVisible = (item: any) => {
  createCodeVisible.value = true;
  selectedInstallationsName.value = item.name;
}

const setContract = async () => {
  if (activeKey.value === 'ERC20') {
    console.log("optsERC20.value:", optsERC20.value);
    contractERC20.value = erc20.print(optsERC20.value);
  } else if (activeKey.value === 'ERC721') {
    contractERC721.value = erc721.print(optsERC721.value);
  } else if (activeKey.value === 'ERC1155') {
    contractERC1155.value = erc1155.print(optsERC1155.value);
  }
  return contractERC20.value || contractERC721.value || contractERC1155.value
}
const checkboxClick = async (event: any) => {
  if (activeKey.value === 'ERC20') {
    optsERC20.value[event.target.name] = event.target.checked;
  } else if (activeKey.value === 'ERC721') {
    if (event.target.name === 'incremental') {
      optsERC721.value.mintable = true;
    }
    optsERC721.value[event.target.name] = event.target.checked;
  } else if (activeKey.value === 'ERC1155') {
    optsERC1155.value[event.target.name] = event.target.checked;
  }

  setContract();
}

const createProject = async () => {
  try {
    // loading.value = true;
    const createProjectTemp = localStorage.getItem('createProjectTemp');
    const params = {
      name: formData.name,
      type: JSON.parse(createProjectTemp)?.type - 0,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      fileName: optsERC20.value.name,
      content: contractERC20.value,
      repoOwner: selectedInstallationsName.value,
      // labelDisplay:
    }
    if (activeKey.value === 'ERC721') {
      params.fileName = optsERC721.value.name
      params.content = contractERC721.value;
    } else if (activeKey.value === 'ERC1155') {
      params.fileName = optsERC1155.value.name;
      params.content = contractERC1155.value;
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

const handleOk = async () => {
  await formRef.value.validate();
  createCodeLoading.value = true;
  createProjectLoading.value = true
  // loading.value = true;
  createProject()
}

const handleCancel = () => {
  createCodeLoading.value = false
  createProjectLoading.value = false
  loading.value = false;
  codeNameValue.value = ''
  formRef.value.resetFields()
}
// 判断token是钱包的还是真实
const tokenFrom = () => {
  tokenMatemaskWallet.value = localStorage.getItem('token')?.startsWith('0x')
  console.log('bool', tokenMatemaskWallet.value)
}
// 下载回调
const downloadInfo = async () => {
  const str = await setContract()
  downloadRequest(str, activeKey.value, 'sol')
}
// 监听tab切换更改对应面包屑的名称
watch(() => activeKey.value, (old, val) => {
  if (old != val) {
    judgeOrigin()
  }
})
</script>
<style lang='less' scoped>
:deep(.dark-css .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FFFFFF;
}

:deep(.ant-tabs-tab-btn) {
  width: 100px;
  text-align: center;
}
</style>
