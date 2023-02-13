<template>
  <div>
    <div class="mb-[32px]">
      <div class="text-[24px] font-bold">Let‘s create your project.</div>
      <div class="dark:text-[#E0DBD2] text-[#73706E]">Ready to start building? Get started with one of our Templates or
        use an existing repository.</div>
    </div>
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="grid grid-cols-2 gap-8">
        <a-form :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :model="formData" layout="vertical"
          ref="formRef" :rules="formRules">
          <a-form-item label="Project Name" name="name">
            <a-input v-model:value="formData.name" placeholder="Project Name" allow-clear autocomplete="off" />
            <div class="dark:text-[#E0DBD2] text-[#73706E] mt-[8px]">Great project names are short and memorable.</div>
          </a-form-item>
          <a-form-item class="new-label" label="Project Type" name="type">
            <a-radio-group v-model:value="formData.type" name="type" @change="getTemplatesShow">
              <a-radio :style="radioStyle" value="1">Contract
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Contract code.</div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">FrontEnd
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Front-End code.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="3" disabled="true">Blockchain Node（coming soon）
                <div>Please pay attention to Hamster</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item class="new-label" label="Code Repositiory">
            <a-radio-group v-model:value="formData.contractCode" name="contractCode">
              <a-radio :style="radioStyle" value="1">Creat a new repository by template
                <div class="radio-sub">Implement core standards with our contract template for easily build your app.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="2" disabled="true">Blockchain Node（coming soon）
                <div>Please pay attention to Hamster</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item class="new-label" label="Web3 Ecosystem" name="frameType" v-show="formData.type == '1'">
            <a-radio-group v-model:value="formData.frameType" name="frameType">
              <a-radio :style="radioStyle" value="1">EVM
                <div class="radio-sub">Build application based on EVM and Solidity language</div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">Aptos
                <div class="radio-sub">Build application based on Aptos and Move language</div>
              </a-radio>
              <a-radio :style="radioStyle" value="3">TON
                <div class="radio-sub">Build application based on TON and FunC language</div>
              </a-radio>
              <a-radio :style="radioStyle" value="4">StarkWare
                <div class="radio-sub">Build application based on Starkware and Cairo language</div>
              </a-radio>
              <!-- <a-radio value="2">ink!</a-radio>
              <a-radio value="3">Move（coming soon）</a-radio>
              <a-radio value="8">Angular</a-radio> -->
            </a-radio-group>
          </a-form-item>
        </a-form>
        <div>
          <div class="flex justify-between">
            <div class="font-bold text-[16px]">Popular Template</div>
            <div class="cursor-pointer" @click="goNext">
              <img src="@/assets/icons/explore-template.svg" class="h-[20px]" />
              <span class="text-[#E2B578] align-middle text-[16px]"> Explore all template</span>
            </div>
          </div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '1'">A collection of our most
            deployed contracts.</div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '2'">A collection of our
            most deployed FrontEnd.</div>
          <div v-if="formData.type === '1'" class="grid grid-cols-2 gap-4 template-height">
            <div v-for="(item, index) in showList" :key="index" @click="goDetail(item)"
              class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] py-[32px] px-[24px]">
              <div class="flex flex-col h-[100%]">
                <div class="relative flex-1">
                  <img :src="item.logo" class="h-[40px] w-[40px]" />
                  <div class="text-[16px] mt-4 font-bold text-ellipsis">{{ item.name }}</div>
                  <div class="text-[#151210] dark:text-[#BBBAB9]">{{ item.description }}</div>
                  <img src="@/assets/images/small-star.png" class="absolute h-2 top-[66%] left-[70%]" />
                  <img src="@/assets/images/big-star.png" class="absolute h-4 top-[74%] left-[90%]" />
                </div>
                <div class="flex">
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
                  <div class="text-[16px]">
                    <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    <span class="align-middle ml-[4px]">{{ item.lastVersion }}</span>
                  </div>
                </div>
                <div class="text-[14px] dark:text-[#E0DBD2] text-[#73706E]">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-8 text-center">
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
import aptosone from '@/assets/svg/aptos-one.svg'
import aptostwo from '@/assets/svg/aptos-two.svg';
import aptosthree from '@/assets/svg/aptos-three.svg';
import aptosfour from '@/assets/svg/aptos-four.svg';
import tonone from '@/assets/svg/ton-one.svg';
import tontwo from '@/assets/svg/ton-two.svg';
import tonthree from '@/assets/svg/ton-three.svg';
import starkwareone from '@/assets/svg/starkware-one.svg';
import starkwaretwo from '@/assets/svg/starkware-two.svg';
import starkwarethree from '@/assets/svg/starkware-three.svg'

const theme = useThemeStore()

const router = useRouter();
const loading = ref(false);
const showList = ref([])
const formRef = ref();
// const formData = reactive({
//   name: '',
//   type: '1',
//   contractCode: '1',
//   frameType: '1',
// });

const formData = reactive(JSON.parse(localStorage.getItem('createFormData'))) || reactive({
  name: '',
  type: '1',
  contractCode: '1',
  frameType: '1',
});

const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });
const fixedPopularTemplate = {
  aptos: [
    {
      audited: false,
      description: 'Token vesting Smart Contract for Aptos Blockchain.',
      id: 1,
      image: '',
      lastVersion: 'Coming soon',
      logo: aptosone,
      name: 'aptos-token-vesting',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'The smart contract provides staking for Tokens and NFTs. The creators can decide the APR and way to distribute the gains.',
      id: 2,
      image: '',
      lastVersion: 'Coming soon',
      logo: aptostwo,
      name: 'aptos-token-staking',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'Aptos Code for NFT borrow and lend',
      id: 3,
      image: '',
      lastVersion: 'Coming soon',
      logo: aptosthree,
      name: 'nft-borrowing-lendin...',
      templateTypeId: 3
    },
    {
      audited: false,
      description: 'Raffle in Aptos blockchain by Mokshya Protocol',
      id: 4,
      image: '',
      lastVersion: 'Coming soon',
      logo: aptosfour,
      name: 'aptos-raffle',
      templateTypeId: 4
    },
  ],
  ton: [
    {
      audited: false,
      description: 'Basic implementation of smart contracts for NFT tokens and NFT collections in accordance with the Standard',
      id: 1,
      image: '',
      lastVersion: 'Coming soon',
      logo: tonone,
      name: 'Non-Fungible tokens',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'Basic implementation of smart contracts for Jetton wallet and Jetton minter in accordance with the Standard',
      id: 2,
      image: '',
      lastVersion: 'Coming soon',
      logo: tontwo,
      name: 'Fungible tokens',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'Smart contracts of ".ton" zone',
      id: 3,
      image: '',
      lastVersion: 'Coming soon',
      logo: tonthree,
      name: 'TON DNS Smart Contr...',
      templateTypeId: 3
    },
  ],
  StarkWare: [
    {
      audited: false,
      description: 'The ERC20 preset offers a quick and easy setup for deploying a basic ERC20 token.',
      id: 1,
      image: '',
      lastVersion: 'Coming soon',
      logo: starkwareone,
      name: 'ERC20',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'The ERC721 token standard is a specification for non-fungible tokens, or more colloquially: NFTs.',
      id: 2,
      image: '',
      lastVersion: 'Coming soon',
      logo: starkwaretwo,
      name: 'ERC721',
      templateTypeId: 2
    },
    {
      audited: false,
      description: 'The ERC1155 multi token standard is a specification for fungibility-agnostic token contracts.',
      id: 3,
      image: '',
      lastVersion: 'Coming soon',
      logo: starkwarethree,
      name: 'ERC1155',
      templateTypeId: 3
    },
  ]
}

watchEffect(async () => {
  if (formData.frameType == '1') {
    await getInitTemplates()
    console.log('formData.frameType=1:', formData.frameType)
  } else if (formData.frameType == '2') {
    showList.value = fixedPopularTemplate.aptos
    console.log('formData.frameType:', formData.frameType)
  } else if (formData.frameType == '3') {
    showList.value = fixedPopularTemplate.ton
    console.log('formData.frameType:', formData.frameType)
  } else if (formData.frameType == '4') {
    showList.value = fixedPopularTemplate.StarkWare
    console.log('formData.frameType:', formData.frameType)
  }
})

// Form rules
const formRules = computed(() => {
  const checkDupName = async () => {
    try {
      loading.value = true;
      //校验仓库名称是否存在
      const userInfo = localStorage.getItem('userInfo');
      const params = {
        owner: JSON.parse(userInfo)?.username,
        name: formData.name,
      }
      const res = await apiDupProjectName(params);
      if (res.data === false) {
        return Promise.reject("Project Name duplication");
      } else {
        return Promise.resolve()
      }
    } catch (error: any) {
      console.log("erro:", error)
      return Promise.reject("Project Name check failure");
    } finally {
      loading.value = false;
    }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter Project Name'), { validator: checkDupName, trigger: "change" }],
  };
});
const goNext = async () => {
  localStorage.setItem("createFormData", JSON.stringify(formData));
  setCreateProjectValue(`/projects/template/${formData.type}`)
}
const setCreateProjectValue = async (path: RouteLocationRaw) => {

  await formRef.value.validate();

  try {
    loading.value = true;
    const createProjectTemp = {
      name: formData.name,
      type: formData.type,
      frameType: formData.frameType,
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
  formData.type = val.target.value
  getInitTemplates()
}

const getInitTemplates = async () => {
  try {
    const { data } = await apiTemplatesShow(formData.type);
    showList.value = data;
    console.log(showList.value)
  } catch (error: any) {
    console.log("erro:", error)
  }
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
</style>