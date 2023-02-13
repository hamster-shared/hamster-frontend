<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex justify-between">
      <div class="flex items-center">
        <div class="text-[24px] font-bold cursor-pointer flex items-center" @click="goBack">
          <img src="@/assets/icons/back-white.svg" class="h-[24px] dark:hidden mr-2" />
          <img src="@/assets/icons/back-dark.svg" class="h-[24px] hidden dark:inline-block mr-2" />
          back
        </div>
        <div class="ml-4">
          <img src="@/assets/icons/Line-white.svg" class="h-[16px] dark:hidden" />
          <img src="@/assets/icons/Line-dark.svg" class="h-[16px] hidden dark:inline-block" />
        </div>
        <div class="ml-4 text-[24px] font-bold">{{ templatesDetail.name }}</div>
      </div>
      <div>
        <a-button type="primary" ghost @click="getProjectsContract">{{ templatesDetail.version }}（latest）</a-button>
        <a-button type="primary" class="ml-4" :loading="loading" @click="createProject">Create by Template</a-button>
      </div>
    </div>


    <FrontendTemplateDeatilVue :text="frontendTemplatesDetail" :showUrl="showUrl" v-if="params.type === '2'">
    </FrontendTemplateDeatilVue>
    <div v-if="params.type === '1'">
      <div class="mt-[32px] rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF]">
        <div class="bg-[#36322D] rounded-tl-[12px] rounded-tr-[12px] p-[32px]">
          <div class="text-[24px] font-bold text-[#FFFFFF]">{{ templatesDetail.name }} Contract</div>
          <div class="mt-2 text-[#BBBAB9]">{{ templatesDetail.description }}</div>
        </div>
        <div class="p-[32px]">
          <div class="text-[24px] font-bold">Extensions</div>
          <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
            class="mt-4 border border-solid border-[#E2B578] bg-[#FFFCF9] dark:bg-[#36322D] p-4 rounded-[12px] grid grid-cols-5 gap-4">
            <a-checkbox disabled="true" v-for="(items, index) in checkboxList" :key="index"
              v-model:checked="items.checked">{{ items.label }}</a-checkbox>
          </div>
          <div v-if="templatesDetail.examples != ''">
            <div class="mt-[32px] text-[24px] font-bold flex items-center">
              <img src="@/assets/icons/example.svg" class="h-[32px] mr-[8px]" />
              Use Cases & Examples
            </div>
            <div class="mt-4 dark:text-[#E0DBD2] text-[#73706E]">
              <pre>{{ templatesDetail.examples }}</pre>
            </div>
          </div>
          <div v-if="templatesDetail.resources != ''">
            <div class="mt-[32px] text-[24px] font-bold flex items-center">
              <img src="@/assets/icons/resource.svg" class="h-[32px] mr-[8px]" />
              Resources
            </div>
            <div class="mt-4 dark:text-[#E0DBD2] text-[#73706E]">
              <pre>{{ templatesDetail.resources }}</pre>
            </div>
          </div>
        </div>
      </div>
      <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
        class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Functions">
            <div class="flex">
              <div class="p-4 border-r-[#302D2D] border-r border w-1/4">
                <div class="flex items-center ">
                  <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
                  <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Send
                </div>
                <div class="pb-4 "><!-- h-[120px] overflow-auto -->
                  <div @click="setFunctionList(item)" :class="{ '!text-[#E2B578]': item.name === functionName }"
                    class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px] mt-4"
                    v-for="(item, index) in sendList" :key="index">{{ item.name }}</div>
                </div>
                <div class="flex items-center mt-4">
                  <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
                  <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Call
                </div>
                <div class="pb-4 "><!-- h-[130px] overflow-auto -->
                  <div @click="setFunctionList(item)"
                    :class="{ '!bg-[#E2B578] !text-white': item.name === functionName }"
                    class="w-min cursor-pointer text-[#73706E] dark:text-[#E0DBD2] dark:bg-[#36322D] bg-[#F9F9F9] rounded-[12px] mt-4 px-[30px] py-[12px]"
                    v-for="(item, index) in callList" :key="index">{{ item.name }}</div>
                </div>
              </div>
              <div class="w-3/4 p-4">
                <div class="flex justify-between">
                  <div class="text-[16px] font-bold">{{ functionName }}</div>
                  <div class="dark:text-[#E0DBD2] text-[#73706E]">inputs</div>
                </div>
                <a-table class="my-4" :columns="tableColumns" :dataSource="functionList" :pagination="false"></a-table>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Events">
            <div class="flex">
              <div class="p-4 border-r-[#302D2D] border-r border w-1/4"><!--  h-[300px] overflow-auto -->
                <div @click="setEventList(item)" :class="{ '!text-[#E2B578]': item.name === eventName }"
                  class="text-[#73706E] dark:text-[#E0DBD2] mb-[24px] cursor-pointer"
                  v-for="(item, index) in eventAllList" :key="index">{{ item.name }}</div>
              </div>
              <div class="w-3/4 p-4">
                <div class="flex justify-between">
                  <div class="text-[16px] font-bold">{{ eventName }}</div>
                  <div class="dark:text-[#E0DBD2] text-[#73706E]">inputs</div>
                </div>
                <a-table class="my-4" :columns="tableColumns" :dataSource="eventList" :pagination="false"></a-table>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Sources">
            <div class="p-4">
              <div class="flex justify-between">
                <div>{{ setText(templatesDetail.codeSources) }}</div>
                <img @click="copyInfo(sourceContent)" src="@/assets/icons/copy.svg" class="h-[19px] cursor-pointer" />
              </div>
              <div class="cursor-pointer"></div>
              <div class="mt-4" :style="editHeight">
                <CodeEditor :readOnly="true" :value="sourceContent"></CodeEditor>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue"
import { apiAddProjects } from "@/apis/projects";
import { apiTemplatesDetail, apiFrontendTemplatesDetail } from "@/apis/templates";
import { message } from 'ant-design-vue';
import { useThemeStore } from "@/stores/useTheme";
import FrontendTemplateDeatilVue from "./components/FrontendTemplateDeatil.vue";
import axios from "axios";
const theme = useThemeStore()

const router = useRouter();
const { params } = useRoute();
const loading = ref(false);
const templateId = ref(params.templateId);
const projectType = ref(params.type);
const activeKey = ref("1");
const functionList = ref([]);
const functionName = ref();
const callList = ref([]);
const sendList = ref([]);
const eventAllList = ref([]);
const eventName = ref();
const eventList = ref([]);
const sourceContent = ref("");
const editHeight = ref("height: 220px");
const templatesDetail = ref([]);
const frontendTemplatesDetail = ref('');
const showUrl = ref('');
const extensionsList = ref([]);
const checkboxList = ref([
  { checked: false, label: 'ERC721' },
  { checked: false, label: 'ERC721Supply' },
  { checked: false, label: 'ERC721Enumerable' },
  { checked: false, label: 'ContractMetadata' },
  { checked: false, label: 'Royalty' },
  { checked: false, label: 'Permissions' },
  { checked: false, label: 'PermissionsEnumerable' },
  { checked: false, label: 'Ownable' },
  { checked: false, label: 'Gasless' },
]);

const tableColumns = computed<any[]>(() => [
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

onMounted(() => {
  getTemplatesDetail();
})

const setFunctionList = (element: { inputs: never[]; name: any; }) => {
  functionList.value = element.inputs;
  functionName.value = element.name;
}

const setEventList = (element: { inputs: never[]; name: any; }) => {
  eventList.value = element.inputs;
  eventName.value = element.name;
}

const getTemplatesDetail = async () => {
  if (projectType.value == '1') {
    getContractTemplatesDetail()
  } else {
    getFrontendTemplatesDetail()
  }

};

const getContractTemplatesDetail = async () => {
  try {
    const { data } = await apiTemplatesDetail(templateId.value.toString());
    templatesDetail.value = data;
    extensionsList.value = data.extensions.split(',');
    checkboxList.value.forEach((element, index) => {
      if (extensionsList.value.indexOf(element.label) !== -1) {
        checkboxList.value[index].checked = true;
      }
    });
    // console.log(JSON.parse(data.abiInfo))
    JSON.parse(data.abiInfo).forEach((element: any) => {
      if (element.type === 'function') {
        if (element.name === 'approve') {
          functionList.value = element.inputs;
          functionName.value = element.name;
        }
        if (element.stateMutability === 'nonpayable' || element.stateMutability === 'payable') {
          sendList.value.push(element)
        } else if (element.stateMutability === 'view' || element.stateMutability === 'constant') {
          callList.value.push(element)
        }
      }
      if (element.type === 'event') {
        eventAllList.value.push(element);
        if (element.name === 'Approval') {
          eventList.value = element.inputs;
          eventName.value = element.name;
        }
      }
    });
    axios
      .get(data.codeSources)
      .then(res => {
        if (res.data) {
          sourceContent.value = res.data;
          setCodeHeight(sourceContent.value);
        }
      });
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
}

const setCodeHeight = (content: string) => {
  let codeIndex = content.split('\n').length;
  editHeight.value = 'height: ' + codeIndex * 22 + 'px';
}

const getFrontendTemplatesDetail = async () => {
  try {
    const { data } = await apiFrontendTemplatesDetail(templateId.value.toString());
    frontendTemplatesDetail.value = data.description;
    showUrl.value = data.showUrl;
    templatesDetail.value = data;
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
}



const getProjectsContract = async () => {
  // try {
  //   const { data } = await apiProjectsContractVersion(templateId.value.toString(), templatesDetail.value.version);
  //   console.log("data:",data);
  // } catch (error: any) {
  //   console.log("erro:",error)
  // } finally {
  //   // loading.value = false;
  // }
};

const createProject = async () => {
  loading.value = true;
  try {
    const userInfo = localStorage.getItem('userInfo');
    const createProjectTemp = localStorage.getItem('createProjectTemp');
    const params = {
      name: JSON.parse(createProjectTemp)?.name,
      type: JSON.parse(createProjectTemp)?.type - 0,
      templateOwner: templatesDetail.value.author,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      repoOwner: JSON.parse(userInfo)?.username,
      templateRepo: templatesDetail.value.repositoryName,
      userId: JSON.parse(userInfo)?.id,
    }
    if (projectType.value == '2') {
      params.frameType = templatesDetail.value.templateType - 0;
    }
    const res = await apiAddProjects(params);
    message.success(res.message);

    window.localStorage.setItem("projectActiveKey", JSON.parse(createProjectTemp)?.type);
    router.push("/projects");
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  } finally {
    loading.value = false;
  }
}

const setText = (str: String) => {
  return str.slice(str.lastIndexOf('/') + 1);
}

const goBack = () => {
  router.back();
}
const copyInfo = async (_items: any) => {
  // 存储传递过来的数据
  let OrderNumber = _items;
  // 创建一个input 元素
  // createElement() 方法通过指定名称创建一个元素
  let newInput = document.createElement("input");
  // 讲存储的数据赋值给input的value值
  newInput.value = OrderNumber;
  // appendChild() 方法向节点添加最后一个子节点。
  document.body.appendChild(newInput);
  // 选中input元素中的文本
  // select() 方法用于选择该元素中的文本。
  newInput.select();
  // 执行浏览器复制命令
  try {
    //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
    await document.execCommand('Copy') // 执行浏览器复制命令
    // 清空输入框
    newInput.remove();
    message.success("copy success");
  } catch {
    message.error("copy failed");
  }
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

:deep(.dark-css .ant-tabs) {
  color: #E0DBD2;
}

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
</style>