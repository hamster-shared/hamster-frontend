<template>
  <div class="mx-auto" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <bread-crumb :routes="breadCrumbInfo"/>
    <!-- <div class="mb-4 text-2xl font-bold">Create Request</div> -->

    <div class="p-4 border border-solid rounded-xl dark:border-[#434343] border-[#EBEBEB] mt-4">
      <div class="flex justify-between mb-4">
        <span class="items-center self-center font-bold">You can choose the following templates to quickly create a Request</span>
        <a-button v-if="false" type="link">View All</a-button>
      </div>
  
      <div class="relative template-scrollbar overflow-x-auto w-full h-[330px]">
        <div class="absolute top-0 left-0 flex gap-4">
          <div v-for=" (item,index) in requestTemplateInfo " :key="index" class="flex flex-col shrink-0 grow-0 basis-[400px] h-[300px] template-container">
            <div class="flex-1">
              <div class="mb-2 text-base font-bold">{{ item.name }}</div>
              <span class="sub">Submitted by: <span class="open-link-css cursor-pointer" @click="goAuthor(item.authorUrl)">{{ item.author }}</span></span>
              <div class="item h-[120px] overflow-y-auto">{{ item.description }}</div>
            </div>
            <div class="mt-2">
              <a-button @click="handleUseNow(item.id)">Use Now</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border border-solid border-[#EBEBEB] rounded-xl mt-12 p-4">
      <div class="mb-6">
        <span class="block mb-2 text-base font-bold"><span class="text-[red]">* </span>Request Name</span>
        <a-input v-model:value.trim="requestName" placeholder="Please input request name" class="!w-[50%] dark:text-[#FFFFFF]"/>
        <span class="text-[red] block" v-show="alertInfo">{{ alertInfo }}</span>
      </div>
      <div class="bg-[#F6F6F6] dark:bg-[#35322E] h-[60px] rounded-t-xl">
        <div class="leading-[60px] ml-6 text-base font-bold">Pipelinefile Preview</div>
      </div>
      <div :style="editHeight">
        <CodeEditor v-model:value="pipelinefilePreview" class="request-codeeditor"></CodeEditor>
      </div>
      <div class="mt-4 text-center">
        <a-button class="inline-block mr-4 back-btn" @click="router.push('/middleware/dashboard/oracle')">Back</a-button>
        <a-button @click="handleCreateTemplate">{{id?'Save':'Create'}}</a-button>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="changeRequestWarning" :footer="null">
      <p style="font-weight: 700;font-size: 16px;">Warning</p>
      <template #closeIcon>
          <img class="" src="@/assets/icons/closeIcon.svg" @click="cancelChange"/>
      </template>
      <p>Using the template will overwrite the currently entered request content, please confirm whether to continue.</p>
      <div class="text-center mt-[16px]">
          <a-button style="margin-right: 20px;background: transparent;color:#E2B578" @click="cancelChange">Cancel</a-button>
          <a-button @click="confirmChange">Confirm</a-button>
      </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useRouter,useRoute } from 'vue-router'
  import { useThemeStore } from "@/stores/useTheme";
  import BreadCrumb from "@/components/BreadCrumb.vue";
  import { apiGetRequestTemplate, apiGetShowRequestTemplateScript, apiPostCreateRequest,apiDetailRequest,apiPostUpdateRequest } from '@/apis/chainlink'
  import CodeEditor from '@/components/CodeEditor.vue'
  import { message } from 'ant-design-vue';

  const router = useRouter()
  const route = useRoute()
  const id:any = route.query?.id
  // const breadcrumbUrl = router.currentRoute.value.path
  const theme = useThemeStore();

  const requestName = ref('')
  const alertInfo = ref('')
  const loading = ref(false);
  const changeRequestWarning = ref(false)
  const requestTemId = ref()
  const breadCrumbInfo = ref<any>([])

  const requestTemplateInfo = ref<{
    id: number,
    name: string,
    author: string,
    description: string,
    authorUrl:string,
  }[]>([])

  // 获取模板数据
  const getTemplateInfo = async()=>{
    try {
      const { data } = await apiGetRequestTemplate()
      requestTemplateInfo.value = data
      console.log('data:',data)
    } catch(err) {
      console.log('err:',err)
    }
  }

  // 获取pipelinefile preview展示的代码
  const pipelinefilePreview = ref()
  const paramsCount = ref()
  // 取消改变
  const cancelChange = ()=>{
    changeRequestWarning.value = false
    requestTemId.value = -1
  }
  // 确定更改请求模板内容
  const confirmChange = async()=>{
    try {
      const { data } = await apiGetShowRequestTemplateScript(requestTemId.value)
      pipelinefilePreview.value = data.script
      paramsCount.value = data.paramsCount
      setCodeHeight(pipelinefilePreview.value)
      console.log('data:',data)
    } catch(err) {
      console.log('err:',err)
    }
    changeRequestWarning.value = false
  }
  // 使用模板
  const handleUseNow = async(id:number) => {
    if(requestTemId.value != id && pipelinefilePreview.value){
      changeRequestWarning.value = true
      requestTemId.value = id
    }else{
      requestTemId.value = id
      confirmChange()
    }
  }

  // 设置代码展示页面的高度
  const editHeight = ref("height: 220px");
  const setCodeHeight = (content: string) => {
    let codeIndex = content.split('\n').length;
    editHeight.value = 'height: ' + codeIndex * 22 + 'px';
  }

  // 创建模板
  const handleCreateTemplate = ()=>{
    if(requestName.value == '') {
      alertInfo.value = "Request Name is required"
    } else {
      alertInfo.value = ""
      createTemplate()
    }
  }
  const createTemplate = async()=>{
    const params = {
      name: requestName.value,
      script: pipelinefilePreview.value,
      paramsCount: paramsCount.value,
    }

    try {
      const { data } = id ? await apiPostUpdateRequest(id,params) : await apiPostCreateRequest(params)
      router.push('/middleware/dashboard/oracle')
      console.log('createTemplate-data:',data)
    } catch(err:any) {
      message.error(err.message)
      console.log('createTemplate-err:',err)
    }
  }
  // id 查请求详情
  const getDetailInfo = async()=>{
    const res = await apiDetailRequest(id)
    if(res.code===200){
      console.log('id 查请求详情',res)
      requestName.value = res.data.name
      pipelinefilePreview.value = res.data.script
    }
  }
  // 跳转到author
  const goAuthor = (authorUrl:string)=>{
    window.open(authorUrl)
  }
  onMounted(async()=>{
    await getTemplateInfo()
    if(id){
      getDetailInfo()
    }
    breadCrumbInfo.value = [
      {
        breadcrumbName:'Oracle',
        path:'/middleware/dashboard/Oracle'
      },
      {
        breadcrumbName:id ? 'Edit Request' : 'Create Request',
        path:''
      },
    ]
  })
</script>

<style lang="less" scoped>
  .template-scrollbar {
    &::-webkit-scrollbar {
      height: 5px;
    }
  }
  .request-codeeditor {
    :deep(.overflow-guard) {
      border-radius: 0 0 12px 12px;
    }
  }
  .dark-css .template-container {
    padding: 20px;
    background: rgba(226,181,120,0.1);
    box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
  .template-container {
    padding: 20px;
    background: rgba(226,181,120,0.1);
    box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
    .template-description {
      display: -webkit-box; 
      -webkit-box-orient: vertical; 
      -webkit-line-clamp: 6; 
      word-break: break-all; 
      overflow: hidden;
    }
  }
  .back-btn {
    background: transparent;
    color: #E2B578;
  }
  .item{
    margin-top: 10px;
    color: #AAAAAA	;
    font-weight: 300;
  }
  .sub{
    color: #DDDDDD;
  }

</style>