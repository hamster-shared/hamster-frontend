<template>
  <div>
    <div>
      <div class="mb-2 text-2xl font-bold">Import Git Repository</div>
      <span class="text-sm open-link-css cursor-pointer" @click="handleImportRepository">Import Third-Party Git Repository ></span>
    </div>
    <a-input-search :loading="searchLoading" class="mt-5 mb-4 search-btn" v-model:value="searchInputValue" placeholder="Search here..." allow-clear autocomplete="off" @search="handleSearch"></a-input-search>

    <div class="flex justify-between px-6 mb-5 py-7 rounded-xl dark:bg-[#35322E] boxcontainer-shadow" v-for="(item,index) in repositoryData" :key="index">
      <div>
        <div class="text-base font-bold">{{ item.name }} 
          <span class="border border-solid border-[#EBEBEB] text-sm font-normal px-4 py-[6px] rounded-[32px] inline-block ml-2">{{ item.Visibility }}</span>
        </div>
        <div class="mt-[10px]">{{ item.language }} | Update {{ fromNowexecutionTime(item.updatedAt, "noThing") }}</div>
      </div>
      <a-button class="self-center w-[140px] !h-[42px]" @click="handleImport(item)">Import</a-button>
    </div>

    <div class="mb-6 text-center">
      <a-pagination v-if="pagination.total" size="small" @showSizeChange="pagination.onShowSizeChange" @change="pagination.onChange" v-model:current="pagination.current" :total="pagination.total" v-model:pageSize="pagination.pageSize"/>
      <div v-else>
        <img src="@/assets/icons/noData--dark.svg" alt="" class="w-[128px] hidden dark:inline-block" />
        <img src="@/assets/icons/noData-white.svg" class="w-[128px] dark:hidden" />
        <p>No Data</p>
      </div>
    </div>

    <!-- <div class="text-center">
      <span>Missing Git repository? </span>
      <a @click="handleGithubPermissions">Adjust GitHub App Permissions > </a>
    </div> -->
  </div>

  <div>
    <a-modal :footer="null" v-model:visible="contractImportVisible" @cancel="handleCancelContract">
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="handleCancelContract"/>
      </template>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-if="!contractRepositoryVisible">Configure Project</div>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-else>Import a Third-Party Git Repository</div>
      <span v-if="nameDupErrInfo" class="block text-[red]">{{ nameDupErrInfo }}</span>

      <a-form layout="vertical" class="!mt-3" :model="contractFormData" ref="contractFormRef" :rules="contractRules">
        <a-form-item v-if="contractRepositoryVisible" label="Repository URL" name="importRepositoryContractProjectUrl">
          <a-input class="modal-input" autocomplete="off" v-model:value="contractFormData.importRepositoryContractProjectUrl" placeholder="Please input..." allow-clear/>
        </a-form-item>
        <a-form-item label="Project Name" name="projectName" :rules="[{ required: true, message: 'Please enter your name!' }]">
          <a-input class="modal-input" disabled autocomplete="off" v-model:value="contractFormData.projectName" placeholder="Automated recognition"/>
        </a-form-item>
        <a-form-item class="select-type" label="Affiliated Ecosystem" name="contractSelectChain" :rules="[{ required: true, message: 'Please select your chain!' }]">
          <a-select dropdownClassName="modal-select-dropdown" autocomplete="off" v-model:value="contractFormData.contractSelectChain" placeholder="Please select...">
            <a-select-option value="1">EVM</a-select-option>
            <a-select-option value="2">Aptos</a-select-option>
            <!-- <a-select-option value="3">TON</a-select-option> -->
            <a-select-option value="4">Starknet</a-select-option>
            <a-select-option value="5">Sui</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="text-center">
          <a-button class="w-[240px] !h-[43px]" type="primary" :loading="doneLoading" @click="handleDone">Done</a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :footer="null" v-model:visible="frontEndImportVisible" @cancel="handleCancelFrontend">
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="handleCancelFrontend"/>
      </template>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-if="!frontEndRepositoryVisible">Configure Project</div>
      <div class="text-2xl text-[#151210] mb-1 font-bold" v-else>Import a Third-Party Git Repository</div>
      <span v-if="nameDupErrInfo" class="block text-[red]">{{ nameDupErrInfo }}</span>

      <a-form layout="vertical" class="!mt-3" :model="frontEndFormData" ref="frontEndFormRef" :rules="frontEndRules">
        <a-form-item v-if="frontEndRepositoryVisible" label="Repository URL" name="importRepositoryFrontEndProjectUrl">
          <a-input class="modal-input" autocomplete="off" v-model:value="frontEndFormData.importRepositoryFrontEndProjectUrl" placeholder="Please input..." allow-clear/>
        </a-form-item>
        <a-form-item label="Project Name" name="frontEndProjectName" :rules="[{ required: true, message: 'Please enter your project name!' }]">
          <a-input class="modal-input" disabled autocomplete="off" v-model:value="frontEndFormData.frontEndProjectName" placeholder="Automated recognition"/>
        </a-form-item>
        <a-form-item class="select-type" label="Framework Preset" name="frontEndSelectFramework" :rules="[{ required: true, message: 'Please select your framework!' }]">
          <a-select dropdownClassName="modal-select-dropdown" autocomplete="off" v-model:value="frontEndFormData.frontEndSelectFramework" placeholder="Please select...">
            <a-select-option value="1">Vue.js</a-select-option>
            <a-select-option value="2">React.js</a-select-option>
            <a-select-option value="3" v-if="frontEndFormData.frontEndMethod == '2'">Nuxt.js</a-select-option>
            <a-select-option value="4" v-if="frontEndFormData.frontEndMethod == '2'">Next.js</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Deployment Method" name="frontEndMethod" :rules="[{ required: true, message: 'Please select your method!' }]">
          <a-radio-group autocomplete="off" v-model:value="frontEndFormData.frontEndMethod">
            <a-radio value="1">IPFS
              <div class="radio-sub">Package the front-end code into IPFS format files and upload them to the IPFS storage network</div>
            </a-radio>
            <a-radio value="2">Container
              <div class="radio-sub">Package the front-end code into a Docker image and upload it to container service</div>
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="text-center">
          <a-button class="w-[240px] !h-[43px]" :loading="doneLoading" type="primary" @click="handleDone">Done</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
  import { apiGetRepository, apiPostRepository } from '@/apis/projects'

  const props = defineProps(({
    projectType: String
  }))
  const router = useRouter()

  const repositoryData = ref()
  const searchInputValue = ref('')

  const contractFormRef = ref();
  const frontEndFormRef = ref();
  const contractFormData = ref<{
    projectName: string,
    contractSelectChain: string,
    importRepositoryContractProjectUrl?: string
  }>({});
  const frontEndFormData = ref<{
    frontEndProjectName: string,
    frontEndMethod: string,
    frontEndSelectFramework: string,
    importRepositoryFrontEndProjectUrl?: string
  }>({});

  let reg = /^((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?$/
  const contractRules = { 
    importRepositoryContractProjectUrl:[{ 
      required: true, 
      validator(_: any, repoUrl: string) {
        if( !repoUrl ){
          return Promise.reject("Please enter url!");
        } else if( repoUrl && reg.test(repoUrl) ) {
          console.log('importRepositoryContractProjectUrl:',repoUrl.match(reg))
          const name = repoUrl.match(reg)
          if (name) {
            // console.log('namename:', name[7]?.split('/').slice(-1))
            contractFormData.value.importRepositoryContractProjectUrl = name[0]
            contractFormData.value.projectName = name[7]?.split('/').slice(-1)[0]
          }
          return Promise.resolve()
        } else {
          return Promise.reject("Please enter correct url!");
        }
      }, 
      trigger: 'change' 
    }] 
  }
  const frontEndRules = { 
    importRepositoryFrontEndProjectUrl:[{ 
      required: true, 
      validator(_: any, repoUrl: string) {
        if( !repoUrl ){
          return Promise.reject("Please enter url!");
        } else if( repoUrl && reg.test(repoUrl) ) {
          console.log('importRepositoryFrontEndProjectUrl:',repoUrl.match(reg))
          const name = repoUrl.match(reg)
          if (name) {
            // console.log('namename:', name[7]?.split('/').slice(-1))
            frontEndFormData.value.importRepositoryFrontEndProjectUrl = name[0]
            frontEndFormData.value.frontEndProjectName = name[7]?.split('/').slice(-1)[0]
          }
          return Promise.resolve()
        } else {
          return Promise.reject("Please enter correct url!");
        }
      }, 
      trigger: 'change' 
    }] 
  }

  const contractImportVisible = ref(false)
  const contractRepositoryVisible = ref(false)
  const frontEndImportVisible = ref(false)
  const frontEndRepositoryVisible = ref(false)
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
    // pageSizeOptions: ['10', '20', '30'], // 指定每页可以显示多少条
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

  const getRepositoryData = async()=>{
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      filter: searchInputValue.value
    }
    try {
      const { data } = await apiGetRepository(params)
      // console.log('getRepositoryData-data:', data)
      pagination.total = data.total
      repositoryData.value = data.data
    } catch(err:any){
      console.log('repositoryData-err:',err)
    } finally {
      searchLoading.value = false
    }
  }

  const handleSearch = ()=>{
    searchLoading.value = true
    pagination.current = 1
    getRepositoryData()
  }

  const handleImportRepository = ()=>{
    //选择project type为1时（contract), 点击Import Third-Party Git Repository按钮展示contractImportRepository的modal弹框
    if (props.projectType == '1'){
      contractImportVisible.value = true
      contractRepositoryVisible.value = true
    } else {
      frontEndImportVisible.value = true
      frontEndRepositoryVisible.value = true
    }
  }
  const handleImport = (item:any)=>{
    console.log('handleImport:',item)
    //选择project type为1时（contract), 点击Import按钮展示contractImportVisible的modal弹框
    if (props.projectType == '1'){
      contractImportVisible.value = true
      contractRepositoryVisible.value = false
      contractFormData.value.projectName = item.name
      contractFormData.value.importRepositoryContractProjectUrl = item.githubUrl
    } else {
      frontEndImportVisible.value = true
      frontEndRepositoryVisible.value = false
      frontEndFormData.value.frontEndProjectName = item.name
      frontEndFormData.value.importRepositoryFrontEndProjectUrl = item.githubUrl
    }
  }

  const handleCancelContract = ()=>{
    contractImportVisible.value = false
    contractRepositoryVisible.value = false
    doneLoading.value = false
    nameDupErrInfo.value = ''
    contractFormRef.value.resetFields()
    contractFormData.value = {}
  }
  const handleCancelFrontend = ()=>{
    frontEndImportVisible.value = false
    frontEndRepositoryVisible.value = false
    doneLoading.value = false
    nameDupErrInfo.value = ''
    frontEndFormRef.value.resetFields()
    frontEndFormData.value = {}
    frontEndFormData.value.frontEndMethod = '2'
  }

  let importUrl = ref([])
  let nameDupErrInfo = ref('')
  const handleDone = async()=> {
    if (contractImportVisible.value){
      await contractFormRef.value.validate()
      doneLoading.value = true
      // console.log('contractFormData:', contractFormData.value)

      if (!contractRepositoryVisible.value){
        importUrl.value = repositoryData.value.find((item:any)=>{
          return item.name = contractFormData.value.projectName
        })
        // console.log('importUrl',importUrl.value)
      }

      const params = {
        name: contractFormData.value.projectName,
        ecosystem: +contractFormData.value.contractSelectChain,
        cloneUrl: !contractRepositoryVisible.value? contractFormData.value.importRepositoryContractProjectUrl : importUrl.value.githubUrl,
        type: 1,
      }
      try {
        const { data } = await apiPostRepository(params)
        console.log('contractRepositoryVisible-data:', data)
        router.push(`/projects/integrated/${data}?type=repository`)
      } catch (err:any) {
        console.log('contractRepositoryVisible-err:',err)
        nameDupErrInfo.value = err.response.data.message
      } finally {
        doneLoading.value = false
        importUrl.value = []
      }

    } else {
      await frontEndFormRef.value.validate()
      doneLoading.value = true
      // console.log('frontEndFormData:', frontEndFormData.value)
      
      if (!frontEndRepositoryVisible.value){
        importUrl.value = repositoryData.value.find((item:any)=>{
          return item.name = frontEndFormData.value.frontEndProjectName
        })
        // console.log('importUrl',importUrl.value)
      }

      const params = {
        name: frontEndFormData.value.frontEndProjectName,
        ecosystem: +frontEndFormData.value.frontEndSelectFramework,
        cloneUrl: !frontEndRepositoryVisible.value? frontEndFormData.value.importRepositoryFrontEndProjectUrl : importUrl.value.githubUrl,
        type: 2,
        deployType: +frontEndFormData.value.frontEndMethod
      }
      try {
        const { data } = await apiPostRepository(params)
        console.log('frontEndRepositoryVisible-data:', data)
        router.push(`/projects/integrated/${data}?type=repository`)
      } catch (err:any) {
        console.log('frontEndRepositoryVisible-err:',err)
        nameDupErrInfo.value = err.response.data.message
      } finally {
        doneLoading.value = false
        importUrl.value = []
      }
    }
  }

  const handleGithubPermissions = ()=>{
    const state = new Date().getTime();
    const oauthUrl = ref(import.meta.env.VITE_OAUTH_URL);
    const url = `${oauthUrl.value}?state=${state}`;
    const myWindow = window.open(url, '_parent', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
  }

  onMounted(()=>{
    getRepositoryData()
    // frontend 默认选中container
    if(frontEndImportVisible){
      frontEndFormData.value.frontEndMethod = '2'
    }
  })
</script>

<style lang="less" scoped>
  .search-btn{
    :deep(.ant-input-affix-wrapper){
      border-radius: 8px 0px 0px 8px !important;
    }
    :deep(.ant-input-group-addon) {
      border-radius: 0px 8px 8px 0px;
    }
    :deep(.ant-btn-icon-only){
      height: 42px;
      width: 50px;
      background: rgba(226,181,120,0.1);
      color: #E2B578 !important;
      border: 1px solid #EBEBEB;
      border-radius: 0px 8px 8px 0px !important;
    }
  }
  :deep(.ant-radio-wrapper span){
    color: #73706E;
  }
  :deep(.ant-radio-wrapper-checked span) {
    color: #E2B578;
  }
  .radio-sub {
    color: #C3C4C7;
  }
  :deep(.ant-radio-wrapper-checked span .radio-sub) {
    color: #E2B578;
  }
  
  .boxcontainer-shadow{
    border: 1px solid rgba(191,191,191,0.2);
    box-shadow: 0px 0px 10px 0px rgba(191,191,191,0.2);
  }

  html[data-theme='dark']{
    .search-btn {
      :deep(.ant-input-group-addon) {
        background-color: unset;
        border-radius: 0px 8px 8px 0px;
      }
      :deep(.ant-btn-icon-only){
        background: rgba(226, 181, 120, 0.1);
        border-left: 0px;
      }
    }

    .boxcontainer-shadow{
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