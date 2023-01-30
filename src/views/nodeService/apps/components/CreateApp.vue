<template>
  <a-modal v-model:visible="showCreate" :footer="null" :closable="false" width="600px" @cancel="cancel">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Create App</div>
    <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item label="Name" name="name" >
        <a-input v-model:value="formData.name" placeholder="Please enter Name" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="Description" name="description" >
        <a-input v-model:value="formData.description" placeholder="Please enter Description" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="Chain" name="chain" >
        <a-select @change="setNetwork" v-model:value="formData.chain" placeholder="Please enter Chain" allow-clear autocomplete="off"
        :options="chainList.map(item => ({ value: item }))" >
        </a-select>
      </a-form-item>
      <a-form-item label="Network" name="network" >
        <a-select v-model:value="formData.network" placeholder="Please enter Network" allow-clear autocomplete="off"
        :options="currNetworkList.map(item => ({ value: item }))">
        </a-select>
      </a-form-item>
    </a-form>
    <div class="text-center">
      <a-button type="primary" @click="cancel" ghost>Cancel</a-button>
      <a-button class="ml-4" type="primary" @click="createApp" :loading="loading">Create App</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { toRefs, reactive, computed, ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiAddApp } from "@/apis/apps";
  import { apiGetChains } from "@/apis/rpcs";
  
  const router = useRouter();
  const props = defineProps({
    isRPCs: Boolean,
    isApps: Boolean,
    showCreate: Boolean,
    defaultNetwork: String,
    defaultChain: String,
  });
  const { isRPCs, showCreate, isApps } = toRefs(props);
  const emit = defineEmits(["setShowCreate", "getApps", "setPage"]);

  //监听父组件值得修改
  watch(props, () => {
    if (isRPCs.value === true) {
      formData.chain = props.defaultChain;
      formData.network = props.defaultNetwork;
      currNetworkList.value = networkList.value[formData.chain];
    }
  })

  const chainList = ref([]); //记录链name的值
  const networkList = ref([]); //记录所有的值
  const currNetworkList = ref([]); //记录根据chain的值联动的值
  const loading = ref(false);
  const formRef = ref();
  const formData = reactive({
    name: '',
    description: '',
    chain: '',
    network: '',
    account: window.localStorage.getItem("walletAccount"),
  });

  // Form rules
  const formRules = computed(() => {

    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    
    return {
      name: [requiredRule('Name')],
      description: [requiredRule('Description')],
      chain: [requiredRule('Chain')],
      network: [requiredRule('Network')],
    };
  });

  const createApp = async () => {
    await formRef.value.validate();

    loading.value = true;

    try {
      const data = await apiAddApp(formData);
    } catch (error: any) {
      console.log("erro:",error)
    } finally {
      loading.value = false;
      if (isApps.value === true) {
        emit("setShowCreate");
        emit("setPage", 1);
        emit("getApps");
      } else {
        router.push({ path: '/node-service/Apps' });
      }
    }
  }

  const cancel = async () => {
    emit("setShowCreate");
  }

  onMounted(async () => {
    getChains();
  });

  const getChains = async () => {
    try {
      const data = await apiGetChains();
      data.result.forEach((item: { networks: any[]; name: string; }, key: any) => {
        const networkInfo: string[] = [];
        item.networks.forEach((ele: any, index: any) => {
          networkInfo.push(ele.name);
          if (key === 0 && index === 0) {
            formData.network = ele.name;
          }
        })
        if (key === 0) {
          formData.chain = item.name;
        }
        networkList.value[item.name] = networkInfo;
        chainList.value.push(item.name);
      });
      currNetworkList.value = networkList.value[formData.chain];
    } catch (error: any) {
      console.log("erro:",error)
    }
};
  const setNetwork = async (val: any) => {
    formData.network = "";
    if (val === undefined) {
      currNetworkList.value = [];
    } else {
      currNetworkList.value = networkList.value[val];
      formData.network = currNetworkList.value[0];
      formRef.value.clearValidate("network");
    }
  }
</script>
<style scoped lang="less">
@baseColor: #E2B578;
:deep(.ant-input), :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector){
  border-color: #EBEBEB!important;
}

:deep(.ant-input-affix-wrapper){
  border-color: #EBEBEB;
}
:deep(.ant-btn-primary){
  width: 120px;
  height: 40px;
}
:deep(.ant-select-selection-item){
  color: #8A8A8A !important;
}
// 
</style>