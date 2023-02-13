<template>
  <Breadcrumb :currentName="contractName" :isClick="false"></Breadcrumb>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 rounded-[12px] dark:bg-[#1D1C1A] bg-[#FFFFFF] pt-4">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="ERC20" tab="ERC20">
        <div class="flex">
          <div class="p-4 w-1/4">
            <SettingsERC20 :opts="optsERC20" @showContract="setContract"/>
            <FeaturesERC20 :opts="optsERC20" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC20" @showContract="setContract" />
            <Upgradeability :opts="optsERC20" @showContract="setContract" />
            <InfoSection :opts="optsERC20" @showContract="setContract" />
            <a-button type="primary" class="mt-4" :loading="loading" @click="createProject">Creat by Code</a-button>
          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC20"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="ERC721" tab="ERC721">
        <div class="flex">
          <div class="p-4 w-1/4">
            <SettingsERC721 :opts="optsERC721" @showContract="setContract"/>
            <FeaturesERC721 :opts="optsERC721" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC721" @showContract="setContract" />
            <Upgradeability :opts="optsERC721" @showContract="setContract" />
            <InfoSection :opts="optsERC721" @showContract="setContract" />
            <a-button type="primary" class="mt-4" :loading="loading" @click="createProject">Creat by Code</a-button>
          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC721"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="ERC1155" tab="ERC1155">
        <div class="flex">
          <div class="p-4 w-1/4">
            <SettingsERC1155 :opts="optsERC1155" @showContract="setContract"/>
            <FeaturesERC1155 :opts="optsERC1155" @checkboxClick="checkboxClick" />
            <AccessControl :opts="optsERC1155" @showContract="setContract" />
            <Upgradeability :opts="optsERC1155" @showContract="setContract" />
            <InfoSection :opts="optsERC1155" @showContract="setContract" />
            <a-button type="primary" class="mt-4" :loading="loading" @click="createProject">Creat by Code</a-button>
          </div>
          <div class="p-4  w-3/4 h-[700px]">
            <CodeEditor :readOnly="true" :value="contractERC1155"></CodeEditor>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Breadcrumb from "../components/Breadcrumb.vue";
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
import { useThemeStore } from "@/stores/useTheme";
import { apiProjectsCode } from "@/apis/projects";
import { message } from "ant-design-vue";
const theme = useThemeStore()
const router = useRouter();

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
const activeKey = ref(contractName);
const loading = ref(false);

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
})

const setContract = async () => {
  if (activeKey.value === 'ERC20') {
    console.log("optsERC20.value:",optsERC20.value);
    contractERC20.value = erc20.print(optsERC20.value);
  } else if ( activeKey.value === 'ERC721') {
    contractERC721.value = erc721.print(optsERC721.value);
  } else if ( activeKey.value === 'ERC1155') {
    contractERC1155.value = erc1155.print(optsERC1155.value);
  }
}
const checkboxClick = async (event: any) => {
  if (activeKey.value === 'ERC20') {
    optsERC20.value[event.target.name] = event.target.checked;
  } else if (activeKey.value === 'ERC721') {
    if (event.target.name === 'incremental') {
      optsERC721.value.mintable = true;
    }
    optsERC721.value[event.target.name] = event.target.checked;
  } else if ( activeKey.value === 'ERC1155') {
    optsERC1155.value[event.target.name] = event.target.checked;
  }
  
  setContract();
}

const createProject = async () => {
  
  try {
    loading.value = true;
    const createProjectTemp = localStorage.getItem('createProjectTemp');
    const params = {
      name: JSON.parse(createProjectTemp)?.name,
      type: JSON.parse(createProjectTemp)?.type - 0,
      frameType: JSON.parse(createProjectTemp)?.frameType - 0,
      fileName: optsERC20.value.name,
      content: contractERC20.value,
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
    router.push("/projects");
  } catch (error: any) {
    console.log("erro:",error)
    message.error(error.response.data.message);
    loading.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
<style lang='less' scoped>

:deep(.dark-css .ant-tabs){
  color: #E0DBD2;
} 
:deep(.dark-css .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  color: #FFFFFF;
}
:deep(.ant-tabs-tab-btn){
  width: 100px;
  text-align: center;
} 
</style>