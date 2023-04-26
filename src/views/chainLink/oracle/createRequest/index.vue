<template>
  <div class="mx-auto" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <BreadCrumb currentName="Create Request" :isClick="loading" class="mb-6"/>

    <div class="mb-4 text-2xl font-bold">Create Request</div>

    <div class="p-4 border border-solid rounded-xl dark:border-[#434343] border-[#EBEBEB]">
      <div class="flex justify-between mb-4">
        <span class="items-center self-center font-bold">You can choose the following templates to quickly create a Request</span>
        <a-button v-if="false" type="link">View All</a-button>
      </div>
  
      <div class="relative template-scrollbar overflow-x-auto w-full h-[330px]">
        <div class="absolute top-0 left-0 flex gap-4">
          <div v-for=" (item,index) in requestTemplateInfo " :key="index" class="flex flex-col shrink-0 grow-0 basis-[400px] h-[300px] template-container">
            <div class="flex-1">
              <div class="mb-2 text-base font-bold">{{ item.name }}</div>
              <span class="sub">Submitted by: {{ item.author }}</span>
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
        <a-input v-model:value.trim="requestName" placeholder="Please input request name" class="!w-[50%]"/>
        <span class="text-[red] block" v-show="alertInfo">{{ alertInfo }}</span>
      </div>
      <div class="bg-[#F6F6F6] dark:bg-[#35322E] h-[60px] rounded-t-xl">
        <div class="leading-[60px] ml-6 text-base font-bold">Pipelinefile Preview</div>
      </div>
      <div :style="editHeight">
        <CodeEditor v-model:value="pipelinefilePreview" class="request-codeeditor"></CodeEditor>
      </div>
      <div class="mt-4 text-center">
        <a-button class="inline-block mr-4 back-btn" @click="router.push('/chainlink/oracle')">Back</a-button>
        <a-button @click="handleCreateTemplate">{{id?'Save':'Create'}}</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useRouter,useRoute } from 'vue-router'
  import { useThemeStore } from "@/stores/useTheme";
  import BreadCrumb from '@/views/projects/components/Breadcrumb.vue'
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

  const requestTemplateInfo = ref<{
    id: number,
    name: string,
    author: string,
    description: string
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
  const handleUseNow = async(id:number) => {
    try {
      const { data } = await apiGetShowRequestTemplateScript(id)
      pipelinefilePreview.value = data.script
      paramsCount.value = data.paramsCount
      setCodeHeight(pipelinefilePreview.value)
      console.log('data:',data)
    } catch(err) {
      console.log('err:',err)
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
      router.push('/chainlink/oracle')
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
  onMounted(async()=>{
    await getTemplateInfo()
    if(id){
      getDetailInfo()
    }
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
    background-color: #1D1C1A;
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