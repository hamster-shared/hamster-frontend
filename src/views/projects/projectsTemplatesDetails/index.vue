<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex items-center justify-between">
      <bread-crumb :routes="breadCrumbInfo" />
      <div>
        <a-button type="primary" ghost @click="getProjectsContract">{{ templatesDetail.version }}（latest）</a-button>
        <a-button type="primary" class="ml-4" :loading="downloadLoading" @click="downloadTemplate">Download</a-button>
        <a ref="downloadLinkRef" style="display: none;"></a>
        <!-- <a-button v-if="!tokenMatemaskWallet" type="primary" class="ml-4" :loading="createTemplateLoading"
          @click="showModal">{{
            createTemplate
          }}</a-button> -->
        <a-popover title="" class="ml-4 " placement="bottom">
          <template #content>

            <div v-if="isGithubInstallCheck">
              <div class="text-[#979797] text-[14px] mb-[10px]">Select a github account to create</div>
              <div v-for="item in githubUsersInstallationsList" :key="item.id"
                class="flex text-[16px] mb-[10px] cursor-pointer hover:text-[#E2B578] items-center"
                @click="showModal(item)">
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
              <p class="text-left">Install the Github application for getting permission to create code repository</p>
              <a-button type="primary" @click="intsallGithub">Install</a-button>
            </div>

          </template>
          <a-button type="primary" :loading="createProjectLoading">
            {{
              createTemplate
            }}
          </a-button>
        </a-popover>
      </div>
    </div>
    <a-modal :footer="null" centered="true" class="create-template-modal" v-model:visible="createProjectVisible"
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

    <FrontendTemplateDeatilVue :text="frontendTemplatesDetail" :showUrl="showUrl"
      v-if="params.type === '2' || params.type == '3'" :projectType="projectType">
    </FrontendTemplateDeatilVue>
    <div v-if="params.type === '1'">
      <div class="mt-[32px] rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF]">
        <div class="bg-[#36322D] rounded-tl-[12px] rounded-tr-[12px] p-[32px]">
          <div class="text-[24px] font-bold text-[#FFFFFF]">{{ templatesDetail.name }} Contract</div>
          <div class="mt-2 text-[#BBBAB9]">{{ templatesDetail.description }}</div>
        </div>
        <div class="p-[32px]">
          <div class="text-[24px] font-bold" v-if="templatesDetail.extensions !== ''">Extensions</div>
          <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" v-if="templatesDetail.extensions !== ''"
            class="mt-4 border border-solid border-[#E2B578] bg-[#FFFCF9] dark:bg-[#36322D] p-4 rounded-[12px] grid grid-cols-5 gap-4">
            <a-checkbox disabled="true" v-for="(items, index) in checkboxList" :key="index"
              v-if="templatesDetail.extensions !== ''" checked="true">{{ items }}</a-checkbox>
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
          <a-tab-pane key="1" tab="Modules" v-if="frameType === '5'">
            <div class="flex">
              <div class="w-1/4 p-4 border-r-css">
                <div class="pb-4 "><!-- h-[120px] overflow-auto -->
                  <div @click="setFunctionsList(item)"
                    :class="[{ '!open-link-css': item.name === moduleName }, { 'mt-4': index != 0 }]"
                    class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px]"
                    v-for="(item, index) in moduleList" :key="index">{{ item.name }}</div>
                </div>
              </div>
              <div class="w-3/4 p-4">
                <div class="text-[16px] font-bold mb-8">Functions</div>
                <NoData v-if="functionsList.length === 0"></NoData>
                <a-collapse class=" dark:!border-[#434343] dark:!shadow-none" v-model:activeKey="collapsectiveKey"
                  v-for="(items, keys) in functionsList" :key="keys">
                  <a-collapse-panel :key="String(keys + 1)" :header="items.title" :showArrow="false">
                    <template #extra>
                      <div>
                        <img class="up-tran w-[12px] hidden dark:inline-block" src="@/assets/icons/up-b.svg" />
                        <img class="up-tran w-[12px] dark:hidden" src="@/assets/icons/up.svg" />
                      </div>
                    </template>
                    <a-table class="my-4" :columns="tableColumns" :dataSource="items.paramList"
                      :pagination="false"></a-table>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="Functions" v-if="frameType !== '5'">
            <div class="flex">
              <div class="w-1/4 p-4 border-r-css">
                <div class="flex items-center mb-4">
                  <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
                  <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Send
                </div>
                <div class="pb-4 "><!-- h-[120px] overflow-auto -->
                  <div @click="setFunctionList(item, index)"
                    :class="{ '!open-link-css active-css': item.name === functionName && slectedIndex === index }"
                    class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px]  py-[10px]"
                    v-for="(item, index) in sendList" :key="index">{{ item.name }}</div>
                </div>
                <div class="flex items-center mb-4">
                  <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
                  <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Call
                </div>
                <div class="pb-4 "><!-- h-[130px] overflow-auto -->
                  <div @click="setFunctionList(item, index)"
                    :class="{ '!open-link-css active-css': item.name === functionName && slectedIndex === index }"
                    class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px]  py-[10px]"
                    v-for="(item, index) in callList" :key="index">{{ item.name }}</div>
                  <!-- <div @click="setFunctionList(item)"
                    :class="{ '!bg-[#E2B578] !text-white': item.name === functionName }"
                    class="cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] pl-[25px] mt-4"
                    class="w-min cursor-pointer text-[#73706E] dark:text-[#E0DBD2] dark:bg-[#36322D] bg-[#F9F9F9] rounded-[12px] mt-4 px-[30px] py-[12px]"
                    v-for="(item, index) in callList" :key="index">{{ item.name }}</div> -->
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
          <a-tab-pane key="2" tab="Events" v-if="eventAllList.length > 0 && frameType != 2">
            <div class="flex">
              <div class="w-1/4 p-4 border-r-css"><!--  h-[300px] overflow-auto -->
                <div @click="setEventList(item)" :class="{ '!open-link-css': item.name === eventName }"
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
            <div class="p-4" v-if="frameType === '5'">
              <NoData v-if="sourceList.length === 0"></NoData>
              <a-collapse class=" dark:!border-[#434343] dark:!shadow-none" v-model:activeKey="sourceActiveKey"
                v-for="(items, keys) in sourceList" :key="keys">
                <a-collapse-panel :key="String(keys + 1)" :header="items.title" :showArrow="false">
                  <template #extra>
                    <div>
                      <img class="up-tran w-[12px] hidden dark:inline-block" src="@/assets/icons/up-b.svg" />
                      <img class="up-tran w-[12px] dark:hidden" src="@/assets/icons/up.svg" />
                    </div>
                  </template>
                  <div class="text-right">
                    <img @click="copyInfo(items.content)" src="@/assets/icons/copy.svg" class="h-[19px] cursor-pointer" />
                  </div>
                  <div class="mt-4" :style="items.editHeight">
                    <CodeEditor :readOnly="true" :value="items.content"></CodeEditor>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <div class="p-4" v-else>
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
import { computed, onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";
import NoData from "@/components/NoData.vue"
import { apiAddProjects, apiCreateProjects, apiDupProjectName, apiNodeTemplateDetail, apiGithubInstallCheck, apiGithubUsersInstallations } from "@/apis/projects";
import { apiTemplatesDetail, apiFrontendTemplatesDetail, apiDownloadTemplate } from "@/apis/templates";
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useThemeStore } from "@/stores/useTheme";
import type { AbiInfoDataItem } from "@/views/projects/components/data"
import FrontendTemplateDeatilVue from "./components/FrontendTemplateDeatil.vue";
import axios from "axios";
import YAML from "yaml";
import BreadCrumb from "@/components/BreadCrumb.vue";
import { getExample, getSimpleToDo, toICPService, toDisplay } from "@/utils/contractICPMove";

const theme = useThemeStore()
const downloadLoading = ref(false)
const downloadLinkRef = ref(null)
const router = useRouter();
const { params, query } = useRoute();
const createTemplateLoading = ref(false);
const createProjectLoading = ref(false)
const createTemplate = ref('Create by Template')
const createProjectVisible = ref(false)
const templateId = ref(params.templateId);
const projectType = ref(params.type);
const activeKey = ref("1");
const functionList = ref([]);
const functionName = ref();
const callList = ref<any>([]);
const sendList = ref<any>([]);
const eventAllList = ref([]);
const eventName = ref();
const eventList = ref([]);
const sourceContent = ref("");
const editHeight = ref("height: 220px");
const templatesDetail = ref([]);
const frontendTemplatesDetail = ref('');
const showUrl = ref('');
const extensionsList = ref([]);
const slectedIndex = ref(0);
const isGithubInstallCheck = ref(false);
const githubUsersInstallationsList = ref([])
const gitUrl = ref(import.meta.env.VITE_HAMSTER_RW_URL)

const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL);
const selectedInstallationsName = ref('');
const checkboxList = ref([])
const frameType: any = JSON.parse(localStorage.getItem('createProjectTemp') || '')?.frameType;
const collapsectiveKey = ref([])
const sourceActiveKey = ref([])
const moduleList = ref<any>([]);
const functionsList = ref<any>([]);
const moduleName = ref('');
const sourceList = ref<any>([]);
const tokenMatemaskWallet = ref()
const formRef = ref();
const userInfo = localStorage.getItem('userInfo');
const formData = reactive({
  name: '',
});

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
const breadCrumbInfo = ref<any>([])

onMounted(async () => {
  await getTemplatesDetail();
  checkInstallGithub()
  tokenFrom()
  judgeOrigin()

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
      path: `/projects/template/${params.type}`
    },
    {
      breadcrumbName: templatesDetail.value.name,
      path: ''
    },
  ]
}

const setFunctionList = (element: { inputs: never[]; name: any; args: any }, index: number) => {
  functionList.value = element.inputs || element.args;
  functionName.value = element.name;
  slectedIndex.value = index;
}

const setEventList = (element: { inputs: never[]; name: any; }) => {
  eventList.value = element.inputs;
  eventName.value = element.name;
}

const getTemplatesDetail = async () => {
  if (projectType.value == '1') {
    await getContractTemplatesDetail()
  } else if (projectType.value == '3') {
    // node的polkadot
    await getNodeTemplateDetail()
  } else {
    await getFrontendTemplatesDetail()
  }

};


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
  const url = `${gitUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700s')
}

const getNodeTemplateDetail = async () => {
  const { data } = await apiNodeTemplateDetail(templateId.value.toString())
  frontendTemplatesDetail.value = data.description;
  showUrl.value = data.showUrl;
  templatesDetail.value = data;
  console.log('getNodeTemplateDetail:', data)
}

const setFunctionsList = (element: any) => {
  functionsList.value = element.functions;
  moduleName.value = element.name;
  collapsectiveKey.value.length = 0;
}

const setModulesList = (exposedFunctions: any) => {
  functionsList.value.length = 0;
  let methods = Object.keys(exposedFunctions);
  methods.forEach((method: any, index: number) => {
    let functions = Object.keys(exposedFunctions[method]);
    let fucList: any[] = [];
    for (let func of functions) {
      if (exposedFunctions[method][func].isEntry === true) {

        let typeParameters = exposedFunctions[method][func].typeParameters;
        let parameters: any[] = exposedFunctions[method][func].parameters;

        let list: any[] = [];
        let typeParamList: any = [];
        typeParameters.forEach((element: any, index: number) => {
          let typeParam = "T" + index;
          element.abilities.forEach((ele: any, ind: number) => {
            if (ind === 0) typeParam += ": ";
            if (ind > 0) typeParam += "+";
            typeParam += ele;
          })
          list.push({
            "name": 'Type' + index,
            "type": typeParam
          })
          typeParamList[index] = typeParam;
        });
        parameters.forEach((element, index) => {
          let param = "";
          if (element.Struct) {
            let ele = element.Struct;
            param = setParamList(ele, typeParamList);
          }
          else if (element.MutableReference) {
            let ele = element.MutableReference.Struct;
            param = setParamList(ele, typeParamList);
          } else if (element.Vector) {
            param = `Vector<${element.Vector}>`;
          } else if (element.TypeParameter !== undefined) {
            param = typeParamList[element.TypeParameter];
          } else {
            param = element;
          }
          if (param !== '') {
            list.push({
              "name": 'Arg' + index,
              "type": param
            })
          }
        });
        fucList.push({
          "paramList": list,
          "title": func
        })
      }
    }
    if (index === 0) {
      functionsList.value = fucList;
      moduleName.value = method;
    }
    moduleList.value.push({
      "name": method,
      "functions": fucList
    });
  });
}

const setParamList = (element: any, typeParamList: any) => {
  let param = "";
  if (element.module != 'tx_context') {
    param = element.address + "::" + element.module + "::" + element.name;
    if (element.typeArguments.length > 0) {
      param += "<";
      element.typeArguments.forEach((ele: any) => {
        if (ele.Struct) {
          param += ele.Struct.address + "::" + ele.Struct.module + "::" + ele.Struct.name;
        } else {
          param += typeParamList[ele.TypeParameter]
        }
      });
      param += ">";
    }
  }
  return param;
}

const getContractTemplatesDetail = async () => {
  try {
    const { data } = await apiTemplatesDetail(templateId.value.toString());
    templatesDetail.value = data;
    extensionsList.value = data.extensions.split(',');
    checkboxList.value.push(...extensionsList.value)
    const icpAbi = data.abiInfo

    const ainInfoData = ref<any>([]);
    if (frameType === '5') { //sui
      let abiInfoData = JSON.parse(data.abiInfo)
      setModulesList(abiInfoData.result.data.content.disassembled);
    }
    else if (frameType == 2) {
      // aptos 单独走一套abi逻辑
      const aptosSendList: any = YAML.parse(data.abiInfo)?.exposed_functions.map((item: any) => {
        return {
          name: item.name,
          inputs: item.params.filter((i: any) => {
            return i != "&signer"
          }).map((enmu: any, index: number) => {
            return {
              name: `param${index + 1}`,
              type: enmu
            }
          }),
          type: 'function',
          isAptosSend: true,
          isAptosCall: false
        }
      })
      const aptosCallList: any = YAML.parse(data.abiInfo)?.structs.map((item: any) => {
        return {
          name: item.name,
          inputs: item.fields,
          type: 'function',
          isAptosCall: true,
          isAptosSend: false
        }
      })
      ainInfoData.value = [...aptosSendList, ...aptosCallList]
    } else {

      if (Object.prototype.toString.call(YAML.parse(data.abiInfo)) === '[object Object]') {
        ainInfoData.value = YAML.parse(data.abiInfo).abi;

      } else {
        ainInfoData.value = YAML.parse(data.abiInfo);
      }
    }

    if (frameType !== '5' && frameType != 7 && frameType != 8) {
      setAbiInfoData(ainInfoData.value);
    } else if (frameType == '7') {
      getContractICPMoveInfo(JSON.parse(icpAbi))
    } else if (frameType == '8') {
      ainInfoData.value = YAML.parse(data.abiInfo).instructions;
      sendList.value = ainInfoData.value;
      functionList.value = sendList.value[0]?.args;
      functionName.value = sendList.value[0]?.name;

    }
    axios
      .get(data.codeSources)
      .then(res => {
        if (res.data) {
          if (frameType === '5') {
            res.data.forEach((ele: any) => {
              axios
                .get(ele.download_url)
                .then(res => {
                  if (res.data) {
                    setCodeHeight(res.data);
                    sourceList.value.push({
                      title: ele.name,
                      content: res.data,
                      editHeight: editHeight.value
                    });
                  }
                });
            });
          } else {
            sourceContent.value = res.data;
            setCodeHeight(sourceContent.value);
          }
        }
      });
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
}

const setAbiInfoData = (abiInfoData: any) => {

  abiInfoData.forEach((item: any) => {

    if (item.type === 'function') {
      // aptos 的 abi
      if (frameType == 2) {
        if (item.isAptosSend) {
          sendList.value.push(item)
        } else if (item.isAptosCall) {
          callList.value.push(item)
        }
      } else {
        if (!item.stateMutability || item.stateMutability === 'nonpayable' || item.stateMutability === 'payable') {
          sendList.value.push(item)
        } else if (item.stateMutability === 'view' || item.stateMutability === 'constant') {
          callList.value.push(item)
        }
      }

      // 默认选中第一项
      if (sendList.value.length > 0) {
        functionList.value = sendList.value[0]?.inputs;
        functionName.value = sendList.value[0]?.name;
      } else if (callList.value.length > 0) {
        functionList.value = callList.value[0]?.inputs;
        functionName.value = callList.value[0]?.name;
      }




    } else if (item.type === 'event') {
      eventAllList.value.push(item);
      if (eventAllList.value.length > 0) {
        eventList.value = eventAllList.value[0]?.inputs;
        eventName.value = eventAllList.value[0]?.name;
      }
      // if (item.name === 'Approval') {
      //   eventList.value = item.inputs;
      //   eventName.value = item.name;
      // }
    }
  })
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

const showModal = async (item: any) => {
  selectedInstallationsName.value = item.name;
  createProjectVisible.value = true
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

const createProject = async () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    const createProjectTemp = localStorage.getItem('createProjectTemp');
    const params = {
      name: formData.name,
      type: JSON.parse(createProjectTemp)?.type - 0,
      templateOwner: templatesDetail.value.author,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      deployType: JSON.parse(createProjectTemp)?.deployType - 0,
      repoOwner: selectedInstallationsName.value,
      templateRepo: templatesDetail.value.repositoryName,
      userId: JSON.parse(userInfo)?.id,
      templateUrl: templatesDetail.value.repositoryUrl,
      labelDisplay: templatesDetail.value.labelDisplay,
      gistId: templatesDetail.value.gistId,
      defaultFile: templatesDetail.value.defaultFile,
    }
    if (projectType.value == '2') {
      params.frameType = templatesDetail.value.templateType - 0;
    }
    const res = await apiCreateProjects(params);
    message.success(res.message);

    window.localStorage.setItem("projectActiveKey", JSON.parse(createProjectTemp)?.type);
    router.push(`/projects/templates/integrated/${res.data}`);
  } catch (error: any) {
    console.log("error:", error)
    message.error(error.response.data.message);
  } finally {
    createProjectLoading.value = false
  }
}

const handleOk = async () => {
  await formRef.value.validate();
  createProjectLoading.value = true;
  createTemplateLoading.value = true;
  createTemplate.value = 'Create by...'
  createProject()
}

const handleCancel = () => {
  createProjectLoading.value = false
  createTemplateLoading.value = false;
  createTemplate.value = 'Create by Template'
  formRef.value.resetFields()
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
const downloadTemplate = async () => {
  downloadLoading.value = true
  const res = await apiDownloadTemplate(templatesDetail.value.id.toString(), templatesDetail.value.repositoryName);
  if (res.code != 200) {
    message.error(res.message);
    return
  }
  downloadLinkRef.value.href = res.data;
  downloadLinkRef.value.click();
  message.success("download success")
  downloadLoading.value = false
}
// 判断token是钱包的还是真实
const tokenFrom = () => {
  tokenMatemaskWallet.value = localStorage.getItem('token')?.startsWith('0x')
  console.log('bool', tokenMatemaskWallet.value)
}
const getContractICPMoveInfo = async (abi: any) => {
  console.log('abi::::', abi)
  // 把 abi 转成可用数组
  const temArr: any = await toICPService(abi)
  // 取出数组中的 methods 用于遍历出 send call
  const methodsArr = temArr.map((item: any) => {
    return item.methods
  })?.flat()
  methodsArr.map((it: any) => {
    if (it.type == 'send') {
      sendList.value.push(it)
    } else if (it.type == 'call') {
      callList.value.push(it)
    }
  })
  // 默认选中第一项
  if (sendList.value.length > 0) {
    functionList.value = sendList.value[0]?.args;
    functionName.value = sendList.value[0]?.name;
  } else if (callList.value.length > 0) {
    functionList.value = callList.value[0]?.args;
    functionName.value = callList.value[0]?.name;
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

:deep(.ant-collapse-item-active) {
  border: 1px solid #E2B578;
  border-radius: 8px !important;
}

:deep(.ant-collapse-item:last-child>.ant-collapse-content) {
  border-radius: 0 0 8px 8px !important;
}

:deep(.ant-collapse) {
  box-shadow: 6px 6px 15px 0px rgba(242, 238, 234, 0.1);
  border-radius: 8px;
  border: 1px solid #EBEBEB;
  margin-bottom: 30px;
}

:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header) {
  font-weight: bold;
}

.active-css {
  background: rgba(226, 181, 120, 0.2);
  // box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  width: 200px;
}

.dark-css {
  .border-r-css {
    border-right: 1px solid #434343;
  }
}

.white-css {
  .border-r-css {
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
