<template>
  <div>
    <div class="mb-[32px]">
      <div class="text-[24px] font-bold">Let‘s create your project.</div>
      <div class="dark:text-[#E0DBD2] text-[#73706E]">Ready to start building? Get started with one of our Templates.
      </div>
    </div>
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="grid grid-cols-2 gap-8">
        <a-form :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :model="formData" layout="vertical">
          <!-- <a-form-item label="Project Name" name="name">
            <a-input v-model:value="formData.name" placeholder="Project Name" allow-clear autocomplete="off" />
            <div class="dark:text-[#E0DBD2] text-[#73706E] mt-[8px]">Great project names are short and memorable.</div>
          </a-form-item> -->
          <a-form-item class="new-label" label="Project Type" name="type">
            <a-radio-group v-model:value="formData.type" name="type" @change="getTemplatesShow">
              <a-radio :style="radioStyle" value="1">Contract
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Contract code.</div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">FrontEnd
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Front-End code.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="3">Blockchain Node (Polkadot Only)
                <div class="radio-sub">Set up a workflow to automatic build and deploy your Node code</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item class="new-label" label="Code Repositiory">
            <a-radio-group v-model:value="formData.contractCode" name="contractCode">
              <a-radio :style="radioStyle" value="1">Create a new repository by template
                <div>Implement core standards with our contract template for easily build your app.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">Use an existing repository
                <div class="radio-sub">Easily build your app by importing an existing git repository with Hamster</div>
              </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item class="new-label" label="Web3 Ecosystem" name="frameType"
            v-show="formData.contractCode == '1' && formData.type != '2' && formData.type != '3'">
            <a-radio-group v-model:value="formData.frameType" name="frameType" @change="changRadio">
              <div v-if="formData.type == 1">
                <a-radio :style="radioStyle" value="1">EVM
                  <div class="radio-sub">Build application based on EVM and Solidity language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="2">Aptos
                  <div class="radio-sub">Build application based on Aptos and Move language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="3" disabled="true">TON
                  <div>Build application based on TON and FunC language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="4">Starknet
                  <div class="radio-sub">Build application based on Starknet and Cairo language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="5">Sui
                  <div class="radio-sub">Build application based on Sui and Move language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="6">Filecoin
                  <div class="radio-sub">Build application based on Filecoin using Solidity or Rust language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="7">Internet Computer
                  <div class="radio-sub">Build application based on IC and Motoko language</div>
                </a-radio>
                <a-radio :style="radioStyle" value="8">Solana
                  <div class="radio-sub">Build application based on Solana and Rust language</div>
                </a-radio>
              </div>
              <a-radio :style="radioStyle" value="1" v-if="formData.type == 3">Polkadot
                <div class="radio-sub">Build application based on Substrate and Rust language</div>
              </a-radio>
              <!-- <a-radio value="2">ink!</a-radio>
              <a-radio value="3">Move（coming soon）</a-radio>
              <a-radio value="8">Angular</a-radio> -->
            </a-radio-group>
          </a-form-item>
          <a-form-item class="new-label" label="Deployment Method"
            v-show="formData.type == '2' && formData.contractCode == '1'">
            <a-radio-group v-model:value="formData.deployType" name="deployType" @change="getTemplatesShow">
              <a-radio :style="radioStyle" value="1">IPFS
                <div class="radio-sub">Package the front-end code into IPFS format files and upload them to the IPFS
                  storage network</div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">Container
                <div class="radio-sub">Package the front-end code into a Docker image and upload it to container service
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="3">Internet Computer
                <div class="radio-sub">The Internet Computer runs canister smart contracts bunding WebAssembly bytecode
                  and execution memory</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>

        <div v-show="formData.contractCode == '1'">
          <div class="flex justify-between" v-if="formData.frameType != '6'">
            <div class="font-bold text-[16px]">Popular Template</div>
            <div class="cursor-pointer" @click="goNext">
              <img src="@/assets/icons/explore-template.svg" class="h-[20px]" />
              <span class="open-link-css align-middle text-[16px]"> Explore all template</span>
            </div>
          </div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]"
            v-if="formData.type == '1' && formData.frameType != '6'">A collection of our most
            deployed contracts.</div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '2'">A collection of our
            most deployed FrontEnd.</div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '3'">A collection of our most
            deployed substrate templates.</div>
          <!-- filecoin的是上下布局，反之是两栏布局 -->
          <div v-if="formData.type === '1' || formData.type === '3'" :class="(formData.frameType != '6'  && formData.frameType != '8') ? 'grid grid-cols-2 gap-4':''" class="template-height1">
            <div v-if="formData.frameType != '6'" v-for="(item, index) in showList" :key="index" @click="goDetail(item)"
              class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] py-[32px] px-[24px]">
              <div class="flex flex-col h-[100%]">
                <div class="relative flex-1">
                  <img :src="item.logo" class="h-[40px] w-[40px]" />
                  <div class="text-[16px] mt-4 font-bold text-ellipsis">{{ item.name }}</div>
                  <div class="text-[#151210] dark:text-[#BBBAB9] max-h-[150px] text-ellipsis-line mb-4">{{
                    item.description }}</div>
                  <img src="@/assets/images/small-star.png" class="absolute h-2 top-[66%] left-[70%]" />
                  <img src="@/assets/images/big-star.png" class="absolute h-4 top-[74%] left-[90%]" />
                </div>
                <!-- 按钮 -->
                <button v-if="item.labelDisplay" class="btn">{{ item.labelDisplay }}</button>
                <div class="flex text-[16px] mt-2">
                  <div class="flex items-center">
                    <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    {{ item.lastVersion }}
                  </div>
                  <div class="flex items-center ml-4" v-if="item.audited === true">
                    <img src="@/assets/icons/audi-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/audi-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    Audited
                  </div>
                </div>
              </div>
            </div>
            <!-- filecoin模板组件 -->
            <div v-if="formData.frameType == '6'">
              <FilecoinTemplate @goFilecoinDetail="goNext"></FilecoinTemplate>
            </div>
          </div>
          <div v-if="formData.type === '2'" class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in showList" :key="index" @click="goDetail(item)"
              class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px]">
              <img :src="item.image" class="w-full rounded-t-[12px]" />
              <div class="border border-solid dark:border-[#434343] border-[#EBEBEB] border-b-0"></div>
              <div class="border-box dark:border-[#434343] border-[#EBEBEB] px-[24px] py-[16px]">
                <div class="text-[16px] font-bold mb-[12px] flex justify-between">
                  <div>
                    <img :src="item.logo" class="w-[24px]" />
                    <span class="align-middle ml-[4px]">{{ item.name }}</span>
                  </div>
                  <!-- <div class="text-[16px]" v-if="formData.deployType !== '3'">
                    <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    <span class="align-middle ml-[4px]">{{ item.lastVersion }}</span>
                  </div> -->
                  <div v-if="item.labelDisplay" class="dfx-css">{{ item.labelDisplay }}</div>
                </div>
                <div class="text-[14px] dark:text-[#E0DBD2] text-[#73706E]">{{ item.description }}</div>
                <!-- <div class="text-[16px]">
                  <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                  <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                  <span class="align-middle ml-[4px]">{{ item.lastVersion }}</span>
                </div> -->
                <div class="flex text-[16px] mt-[12px]">
                  <div>
                    <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    <span class="align-middle ml-[4px]">{{ item.lastVersion }}</span>
                  </div>
                  <div class="flex items-center ml-4" v-if="item.audited === true">
                    <img src="@/assets/icons/audi-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/audi-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    Audited
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="formData.contractCode == '2'">
          <ImportGitRepository :projectType="formData.type"></ImportGitRepository>
        </div>
      </div>
      <div v-show="formData.contractCode == '1'" class="w-full mt-8 text-center">
        <a-button type="primary" :loading="loading" @click="goNext" class="w-[440px]">Next</a-button>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRouter, type RouteLocationRaw } from "vue-router";
import { apiDupProjectName } from "@/apis/projects";
import { apiTemplatesShow } from "@/apis/templates";
import { useThemeStore } from "@/stores/useTheme";
import ImportGitRepository from './components/ImportGitRepository.vue'
import FilecoinTemplate from './components/FilecoinTemplate.vue';
import { formatDateToLocale } from '../../../utils/dateUtil';

const theme = useThemeStore()

const router = useRouter();
const loading = ref(false);
const showList = ref([])
const templateList = ref([    {
  "id": 57,
  "templateTypeId": 8,
  "name": "NFT Collection Contract",
  "description": "Create collection of unique NFTs.",
  "audited": true,
  "lastVersion": "1.0.0",
  "logo": "https://g.alpha.hamsternet.io/ipfs/QmYCLdgTEmLwVuecuzzXxC9aUhsPAW2cLd6TDi9QBEsQCn",
  "image": "",
  "labelDisplay": ""
}])
const formRef = ref();

const formData = reactive(JSON.parse(localStorage.getItem('createFormData'))) || reactive({
  name: '',
  type: '1',
  contractCode: '1',
  frameType: '1',
  deployType: '1',
});

const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });

// Form rules
// const formRules = computed(() => {
//   const checkDupName = async () => {
//     try {
//       loading.value = true;
//       //校验仓库名称是否存在
//       const userInfo = localStorage.getItem('userInfo');
//       const params = {
//         owner: JSON.parse(userInfo)?.username,
//         name: formData.name,
//       }
//       const res = await apiDupProjectName(params);
//       if (res.data === false) {
//         return Promise.reject("Project Name duplication");
//       } else {
//         return Promise.resolve()
//       }
//     } catch (error: any) {
//       console.log("erro:", error)
//       return Promise.reject("Project Name check failure");
//     } finally {
//       loading.value = false;
//     }
//   }

//   const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

//   return {
//     name: [requiredRule('Please enter Project Name'), { validator: checkDupName, trigger: "change" }],
//   };
// });

const goNext = async () => {
  // frameType=6 直接跳转详情页
  if (formData.frameType == '6') {
    formData.frameType = '1'
    localStorage.setItem("createFormData", JSON.stringify(formData));
    router.push('/projects/templates/details')
  } else {
    localStorage.setItem("createFormData", JSON.stringify(formData));
    setCreateProjectValue(`/projects/template/${formData.type}`)
  }
}
const setCreateProjectValue = async (path: RouteLocationRaw) => {

  // await formRef.value.validate();

  try {
    loading.value = true;
    const createProjectTemp = {
      name: formData.name,
      type: formData.type,
      frameType: formData.frameType,
      deployType: formData.deployType,
    }
    localStorage.setItem("createFormData", JSON.stringify(formData));
    window.localStorage.setItem("createProjectTemp", JSON.stringify(createProjectTemp));
    router.push(path);
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    loading.value = false;
  }
}
const goDetail = async (val: any) => {
  if (val.lastVersion !== 'Coming soon') {
    localStorage.setItem("createFormData", JSON.stringify(formData));
    localStorage.setItem('frontendTemplateDetail', JSON.stringify(val));
    setCreateProjectValue("/projects/templates/" + val.id + "/details/" + formData.type)
  }
}

const getTemplatesShow = async (val: any) => {
  showList.value = [];
  getInitTemplates()
}

const getInitTemplates = async () => {
  console.log(formData.frameType, 'formData.frameType')
  try {
    let languageType = '';
    if (formData.type === '1') {
      languageType = formData.frameType
    } else if (formData.type === '2' || formData.type === '8') {
      languageType = null;
    } else {
      languageType = '1';
      formData.frameType = languageType;
    }
    const { data } = await apiTemplatesShow(formData.type, languageType, formData.deployType);
    showList.value = data;
    console.log(showList.value)
  } catch (error: any) {
    console.log("erro:", error)
  }
}

const changRadio = async (val: any) => {
  showList.value = [];
  getInitTemplates()
}

onMounted(() => {
  getInitTemplates();
})

</script>
<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.new-label .ant-form-item-label > label) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.new-label .ant-form-item-label) {
  padding-bottom: 16px;
}

:deep(.white-css .ant-form-item-label > label) {
  color: #151210;
}

:deep(.dark-css .ant-form-item-label > label) {
  color: white;
}

:deep(.dark-css .ant-input) {
  color: #E0DBD2;
}

:deep(.dark-css .ant-input-affix-wrapper) {
  border-color: #434343;
}

:deep(.white-css .ant-input-affix-wrapper) {
  border-color: #EBEBEB;
}

:deep(.white-css .radio-sub) {
  color: #73706E;
}

:deep(.dark-css .radio-sub) {
  color: #E0DBD2;
}

:deep(.ant-radio-wrapper-checked span .radio-sub) {
  color: #E2B578;
}

:deep(.ant-btn-primary) {
  height: 40px;
}

.template-height {
  height: calc(100% - 100px);
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*文字溢出的部分隐藏并用省略号代替*/
  white-space: nowrap;
  /*文本不自动换行*/
  overflow: hidden;
}

.text-ellipsis-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}

.btn {
  width: 80px;
  height: 20px;
  background: #E2B578;
  line-height: 20px;
  border: none;
  border-radius: 15px 15px 15px 15px;
  color: #fff;
}
</style>
