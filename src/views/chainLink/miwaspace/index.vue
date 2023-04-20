<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''" class="rounded-xl bg-white dark:bg-[#1D1C1A] p-[58px]">
    <div class="mb-20">
      <div class="font-bold text-center text-5xl text-[#E2B578] mb-5">Find your MiddleWare</div>
      <div class="text-2xl text-center">By using middleware provided by Hamster, you can achieve fast development and
        deployment.
      </div>
    </div>
    <a-tabs v-model:activeKey="activeKey" type="card" class="miwaspace-tab" @change="getCurrentShowPageInfo">
      <a-tab-pane key="RPC" tab="RPC">
        <rpcMiwaspace :rpcPageInfo="rpcPageInfo"/>
      </a-tab-pane>
      <a-tab-pane key="Oracle" tab="Oracle">
        <oracleMiwaspace :openService="openService"/>
      </a-tab-pane>
      <a-tab-pane key="Storage" tab="Storage">
        <storageMiwaspace />
      </a-tab-pane>
      <a-tab-pane key="Graph" tab="Graph">
        <graphMiwaspace />
      </a-tab-pane>
      <a-tab-pane key="ZKP" tab="ZKP">
        <zkpMiwaspace />
      </a-tab-pane>
      <a-tab-pane key="Others" tab="Others">
        <othersMiwaspace />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang='ts' setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from 'vue-router'
  import { useThemeStore } from "@/stores/useTheme";
  import { apiGetMiddleWareRpc, apiGetIfOpenService } from '@/apis/middleWare'
  import graphMiwaspace from "./components/graphMiwaspace.vue";
  import oracleMiwaspace from "./components/oracleMiwaspace.vue";
  import othersMiwaspace from "./components/othersMiwaspace.vue";
  import rpcMiwaspace from "./components/rpcMiwaspace.vue";
  import storageMiwaspace from "./components/storageMiwaspace.vue";
  import zkpMiwaspace from "./components/zkpMiwaspace.vue";

  const router = useRouter()
  const theme = useThemeStore();

  const nowRouter = router.currentRoute.value.query.key
  const activeKey = ref()

  // 确认对应界面并展示
  const showJumpPage = (query:any) => {
    switch(query) {
      case '1':
        activeKey.value = 'RPC';
        break;
      case '2':
        activeKey.value = 'Oracle';
        break;
      default: break;
    }
  }

  // 获取现在展示页面的数据
  const getCurrentShowPageInfo =(type:string) => {
    switch (type) {
      case 'RPC':
        getRpcInfo();
        break;
      case 'Oracle':
        checkIfOpenService();
        break;
      default: break;
    }
  }

  // 获取rpc页面的数据
  const rpcPageInfo = ref()
  const getRpcInfo = async() => {
    try {
      const { data } = await apiGetMiddleWareRpc()
      rpcPageInfo.value = data
      console.log('rpc-data:', data)
    } catch(err:any) {
      console.log('rpc-err:', err)
    }
  }

  // oracle界面判断用户是否开通了服务
  const openService = ref()
  const checkIfOpenService = async()=> {
    try {
      const { data } = await apiGetIfOpenService('oracle')
      openService.value = data
      console.log('oracle-data:', data)
    } catch(err:any) {
      console.log('oracle-err:', err)
    }
  }

  onMounted( async() => {
    await showJumpPage(nowRouter)
    getCurrentShowPageInfo(activeKey.value)
  })
</script>

<style lang='less' scoped>
  .miwaspace-tab,.ant-tabs-top {
    :deep(&>.ant-tabs-nav:before) {
      border: 1px solid #EBEBEB;
    }
  }
  :deep(.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab) {
    border: 1px solid #EBEBEB;
  }
  .dark-css {
    :deep(.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab) {
      background: unset;
      border: 1px solid #302D2D;
    }
    :deep(.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab-active) {
      background: #35322E;
    }
  }
</style>