<template>
  <div>
    <div>
      <div class="mb-2 text-2xl font-bold">Import Git Repository</div>
      <!-- rightOutlined -->
      <span class="text-sm cursor-pointer open-link-css" @click="handleImportRepository">Import Third-Party Git Repository
        <right-outlined /></span>
    </div>
    <ImportInstall v-if="!isGithubInstallCheck"></ImportInstall>
    <div v-else>
      <div class="flex">
        <div class="mt-5 mb-4 w-[100%] text-[14px] github-account-list">
          <a-dropdown :trigger="['click']" class="">
            <div
              class="flex justify-between w-hull h-[42px] border border-solid border-[#EBEBEB] dark:border-[#45423D] rounded-[8px] mr-[20px] leading-[38px] pl-[16px] cursor-pointer">
              <div>
                <img :src="selectAvatarUrl" class="w-[28px] h-[28px] rounded-[50%] mr-[10px]" />{{ selectValue }}
              </div>
              <div class="mr-[20px]">
                <img src="@/assets/icons/skx.svg" alt="" class="h-[7px] hidden inline-block up-tran">
                <img src="@/assets/icons/skx1.svg" alt="" class="h-[7px] inline-block up-tran">
              </div>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="it in githubAccountList" :key="it.installId" class=""
                  @click="selectGithubAccount(it)">
                  <div class="flex justify-between">
                    <div :class="selsectInstallId === it.installId ? 'text-[#E2B578]' : 'text-[#000000]'">
                      <img :src="it.avatarUrl" class="w-[38px] h-[38px] rounded-[50%] mr-[10px]" />
                      {{ it.name }}
                    </div>
                    <svg-icon v-if="selsectInstallId === it.installId" name="success-color" size="18"
                      class="ml-4 mt-[9px]" />
                  </div>
                </a-menu-item>
                <NoData v-if="githubAccountList.length <= 0" />
                <a-menu-item>
                  <div class="text-center plus-outlined h-[42px] leading-[42px] text-[#666666]" @click="addGithubAccount">
                    <plus-outlined />
                    Add Github Account
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

        </div>
        <a-input-search :loading="searchLoading" class="mt-5 mb-4 search-btn" v-model:value="searchInputValue"
          placeholder="Search here..." allow-clear autocomplete="off" @search="handleSearch"></a-input-search>

      </div>

      <div class="flex justify-between px-6 mb-5 py-7 rounded-xl dark:bg-[#35322E] boxcontainer-shadow"
        v-for="(item, index) in repositoryData" :key="index">
        <div>
          <div class="text-base font-bold">{{ item.name }}
            <span v-if="item.private"
              class="border border-solid border-[#EBEBEB] text-sm font-normal px-4 py-[6px] rounded-[32px] inline-block ml-2">private</span>
            <span v-else
              class="border border-solid border-[#EBEBEB] text-sm font-normal px-4 py-[6px] rounded-[32px] inline-block ml-2">public</span>
          </div>
          <div class="mt-[10px]">{{ item.language }} | Update {{ fromNowexecutionTime(item.updateAt, "noThing") }}
          </div>
        </div>
        <a-button class="self-center w-[140px] !h-[42px]" @click="handleImport(item)">Import</a-button>
      </div>

      <div class="mb-6 text-center">
        <a-pagination v-if="pagination.total" size="small" @change="pagination.onChange"
          v-model:current="pagination.current" :total="pagination.total" v-model:pageSize="pagination.pageSize"
          :showSizeChanger="false" />
        <div v-else>
          <img src="@/assets/icons/noData--dark.svg" alt="" class="w-[128px] hidden dark:inline-block" />
          <img src="@/assets/icons/noData-white.svg" class="w-[128px] dark:hidden" />
          <p>No Data</p>
        </div>
      </div>
      <div v-if="repositorySelection === 'selected'">
        <span>Missing Git repository? </span>
        <span class="text-[#E2B578] cursor-pointer" @click="adjustGithubPremission">Adjust GitHub App
          Permissions <right-outlined /></span>
      </div>
    </div>
  </div>

  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="importVisible" @cancel="handleCancelImport">
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="handleCancelImport" />
      </template>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-if="!repositoryVisible">Configure Project</div>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-else>Import a Third-Party Git Repository</div>
      <span v-if="nameDupErrInfo" class="block text-[red]">{{ nameDupErrInfo }}</span>

      <a-form layout="vertical" class="!mt-3 modal-form" :model="importFormData" ref="importFormRef" :rules="importRules">
        <a-form-item v-if="repositoryVisible" label="Repository URL" name="cloneUrl">
          <a-input class="modal-input" autocomplete="off" v-model:value="importFormData.cloneUrl"
            placeholder="Please input..." allow-clear />
        </a-form-item>
        <a-form-item label="Project Name" name="name" :rules="[{ required: true, message: 'Please enter your name!' }]">
          <a-input class="modal-input" disabled autocomplete="off" v-model:value="importFormData.name"
            placeholder="Automated recognition" />
        </a-form-item>
        <a-form-item v-if="props.projectType === '1'" class="select-type" label="Affiliated Ecosystem" name="ecosystem"
          :rules="[{ required: true, message: 'Please select your chain!' }]">
          <a-select class="modal-select" dropdownClassName="modal-select-dropdown" autocomplete="off"
            v-model:value="importFormData.ecosystem" placeholder="Please select...">
            <a-select-option value="1">EVM</a-select-option>
            <a-select-option value="2">Aptos</a-select-option>
            <!-- <a-select-option value="3">TON</a-select-option> -->
            <a-select-option value="4">Starknet</a-select-option>
            <a-select-option value="5">Sui</a-select-option>
            <a-select-option value="7">Internet Computer</a-select-option>
            <a-select-option value="8">Solana</a-select-option>
          </a-select>
        </a-form-item>
        <div v-else>
          <a-form-item class="select-type" label="Framework Preset" name="ecosystem"
            :rules="[{ required: true, message: 'Please select your framework!' }]">
            <a-select class="modal-select" dropdownClassName="modal-select-dropdown" autocomplete="off"
              v-model:value="importFormData.ecosystem" placeholder="Please select...">
              <a-select-option value="1">Vue.js</a-select-option>
              <a-select-option value="2">React.js</a-select-option>
              <a-select-option value="3" v-if="importFormData.deployType == '2'">Nuxt.js</a-select-option>
              <a-select-option value="4" v-if="importFormData.deployType == '2'">Next.js</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Deployment Method" name="deployType"
            :rules="[{ required: true, message: 'Please select your method!' }]">
            <a-radio-group class="modal-radio" autocomplete="off" v-model:value="importFormData.deployType">
              <a-radio value="1">IPFS
                <div class="radio-sub">Package the front-end code into IPFS format files and upload them to the IPFS
                  storage network</div>
              </a-radio>
              <a-radio value="2">Container
                <div class="radio-sub">Package the front-end code into a Docker image and upload it to container service
                </div>
              </a-radio>
              <a-radio value="3">Internet Computer
                <div class="radio-sub">The Internet Computer runs canister smart contracts bunding WebAssembly bytecode
                  and execution memory</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <div class="text-center">
          <a-button class="w-[240px] !h-[43px]" type="primary" :loading="doneLoading" @click="handleDone">Done</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, RightOutlined } from '@ant-design/icons-vue';
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
import { apiGetRepository, apiPostRepository, apiInstallRepository } from '@/apis/projects';
import { getInstallations, githubInstallCheck, githubInstallAuth } from "@/apis/login";
import ImportInstall from './ImportInstall.vue';
import NoData from "@/components/NoData.vue";

const props = defineProps(({
  projectType: String
}))
const router = useRouter()

const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL);

const githubAccountList = ref([]);
const selectValue = ref('');
const selsectInstallId = ref('');
const selectAvatarUrl = ref('');

const repositorySelection = ref('');


const isGithubInstallCheck = ref(false);

const repositoryData = ref()
const searchInputValue = ref('')
let importUrl = ref([])
let nameDupErrInfo = ref('')

const installationsData = ref({})

const importVisible = ref(false);
const repositoryVisible = ref(false);
const importFormRef = ref();
const importFormData = ref<any>({
  name: '',
  ecosystem: '',
  cloneUrl: '',
  type: 1,
  deployType: '2',
  installId: '',
});
let reg = /^((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/
const importRules = {
  cloneUrl: [{
    required: true,
    validator(_: any, repoUrl: string) {
      if (!repoUrl) {
        return Promise.reject("Please enter url!");
      } else if (repoUrl && reg.test(repoUrl)) {
        console.log('cloneUrl:', repoUrl.match(reg))
        const name = repoUrl.match(reg)
        if (name) {
          importFormData.value.cloneUrl = name[0]
          importFormData.value.name = name[7]?.split('/').slice(-1)[0]
        }
        return Promise.resolve()
      } else {
        return Promise.reject("Please enter correct url!");
      }
    },
    trigger: 'change'
  }]
}
const doneLoading = ref(false)
const searchLoading = ref(false)

const pagination = reactive({
  // 分页配置器
  pageSize: 3, // 一页的数据限制
  current: 1, // 当前页
  total: 3, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  // pageSizeOptions: ['3'],
  onShowSizeChange: (current: number, pagesize: number) => {
    // 改变 pageSize时的回调
    pagination.current = current;
    pagination.pageSize = pagesize;
    getRepositoryData()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getRepositoryData()
  },
});

const addGithubAccount = () => {
  const state = new Date().getTime();
  const url = `${selectTargetUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700s')
}

const getGithubInstallCheck = async () => {
  try {
    const { data } = await githubInstallCheck()
    isGithubInstallCheck.value = data;
    if (data) {
      await getInstallationsAccount();
      getRepositoryData();
    }
  } catch (err: any) {

  }
}


const adjustGithubPremission = () => {
  const state = new Date().getTime();
  const url = `${selectTargetUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
}

const selectGithubAccount = (item: any) => {
  selectValue.value = item.name;
  selectAvatarUrl.value = item.avatarUrl;
  selsectInstallId.value = item.installId;
  repositorySelection.value = item.repositorySelection;
  searchLoading.value = true;
  pagination.current = 1;
  getRepositoryData()
}

const getInstallationsAccount = async () => {
  try {
    const { data } = await getInstallations();
    githubAccountList.value = data;
    selectValue.value = data[0].name;
    selectAvatarUrl.value = data[0].avatarUrl;
    selsectInstallId.value = data[0].installId;
    repositorySelection.value = data[0].repositorySelection;
    console.log(data, '999')
  } catch (err: any) {
    // message.error(err.message)
  }
}

const getRepositoryData = async () => {
  const params = {
    page: pagination.current,
    size: pagination.pageSize,
    query: searchInputValue.value
  }
  try {
    const { data } = await apiInstallRepository(selsectInstallId.value, params)
    console.log('getRepositoryData-data:', data)
    pagination.total = data.total
    repositoryData.value = data.data

  } catch (err: any) {
    console.log('repositoryData-err:', err)
  } finally {
    searchLoading.value = false
  }
}

const handleSearch = () => {
  searchLoading.value = true
  pagination.current = 1
  getRepositoryData()
}

const handleImportRepository = () => {

  importVisible.value = true;
  repositoryVisible.value = true;

}
const handleImport = async (item: any) => {
  console.log('handleImport:', item)
  //选择project type为1时（contract), 点击Import按钮展示contractImportVisible的modal弹框
  importFormData.value.installId = selsectInstallId.value;
  importFormData.value.name = item.name;
  importFormData.value.cloneUrl = item.cloneUrl;
  if (props.projectType === '3') {
    importFormData.value.ecosystem = 1;
    importFormData.value.type = 3;
    importFormData.value.deployType = 2;
    try {
      const { data } = await apiPostRepository(importFormData.value)
      console.log('contractRepositoryVisible-data:', data)
      router.push(`/projects/integrated/${data}?type=repository`)
    } catch (err: any) {
      console.log('contractRepositoryVisible-err:', err)
      nameDupErrInfo.value = err.response.data.message
    }
  } else {
    importVisible.value = true;
    repositoryVisible.value = false;
  }
}

const handleCancelImport = () => {
  importVisible.value = false
  repositoryVisible.value = false
  doneLoading.value = false
  nameDupErrInfo.value = ''
  importFormRef.value.resetFields()
  importFormData.value = {
    name: '',
    ecosystem: '',
    cloneUrl: '',
    type: 1,
    deployType: '2',
  }
}

const handleDone = async () => {
  await importFormRef.value.validate()
  doneLoading.value = true;
  window.localStorage.setItem("projectActiveKey", props.projectType);
  if (!repositoryVisible.value) {
    importUrl.value = repositoryData.value.find((item: any) => {
      return item.name == importFormData.value.name
    })
  }
  importFormData.value.cloneUrl = repositoryVisible.value ? importFormData.value.cloneUrl : importUrl.value.cloneUrl

  if (props.projectType === '1') {
    importFormData.value.type = 1;
  } else {
    importFormData.value.type = 2;
  }

  const params = {
    name: importFormData.value.name,
    ecosystem: importFormData.value.ecosystem - 0,
    cloneUrl: importFormData.value.cloneUrl,
    type: importFormData.value.type,
    deployType: importFormData.value.deployType - 0,
    installId: selsectInstallId.value,
  }

  console.log(params, githubAccountList.value, 'ggggggggggggggggg')
  try {
    const { data } = await apiPostRepository(params)
    router.push(`/projects/integrated/${data}?type=repository`)
  } catch (err: any) {
    nameDupErrInfo.value = err.response.data.message
  } finally {
    doneLoading.value = false
    importUrl.value = []
  }
}

onMounted(async () => {
  await getGithubInstallCheck()

})
</script>

<style lang="less" scoped>
.select-btn {
  height: 42px;
  margin-top: 20px;
  margin-right: 24px;
}

:deep(.ant-dropdown .ant-dropdown-menu) {
  border-radius: 8px !important;
}

.search-btn {
  :deep(.ant-input-affix-wrapper) {
    // height: 52px !important;
    border-radius: 8px 0px 0px 8px !important;
  }

  :deep(.ant-input-group-addon) {
    border-radius: 0px 8px 8px 0px;
  }

  :deep(.ant-btn-icon-only) {
    height: 40px;
    width: 52px;
    background: rgba(226, 181, 120, 0.1);
    color: #E2B578 !important;
    border: 0px;
    // border: 1px solid #EBEBEB;
    border-radius: 0px 8px 8px 0px !important;
  }


}

:deep(.ant-radio-wrapper span) {
  color: #73706E;
}

:deep(.ant-radio-wrapper-checked span) {
  color: #E2B578;
}

.radio-sub {
  color: #C3C4C7;
}

.plus-outlined {
  border-top: 1px solid #F4F4F4;
}

:deep(.ant-radio-wrapper-checked span .radio-sub) {
  color: #E2B578;
}

.boxcontainer-shadow {
  border: 1px solid rgba(191, 191, 191, 0.2);
  box-shadow: 0px 0px 10px 0px rgba(191, 191, 191, 0.2);
}

html[data-theme='dark'] {
  .search-btn {
    :deep(.ant-input-group-addon) {
      background-color: unset;
      border-radius: 0px 8px 8px 0px;
    }

    :deep(.ant-btn-icon-only) {
      background: rgba(226, 181, 120, 0.1);
      border: 0px;
      border-color: #434343;
    }
  }

  .boxcontainer-shadow {
    border: 1px solid #434343;
    box-shadow: unset;
  }

  .select-type {
    :deep(.ant-select-selector .ant-select-selection-item) {
      color: #8A8A8A;
    }
  }
}
</style>
