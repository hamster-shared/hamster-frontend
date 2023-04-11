<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="my-20">
      <div class="font-bold text-center text-5xl text-[#E2B578] mb-5">Find your MiddleWare</div>
      <div class="text-2xl text-center">By using middleware provided by Hamster, you can achieve fast development and
        deployment.
      </div>
    </div>
    <a-tabs v-model:activeKey="activeKey" type="card" class="miwaspace-tab">
      <a-tab-pane key="RPC" tab="RPC">
        <rpcMiwaspace />
      </a-tab-pane>
      <a-tab-pane key="Oracle" tab="Oracle" force-render>
        <oracleMiwaspace />
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
  import { ref } from "vue";
  import { useThemeStore } from "@/stores/useTheme";
  import graphMiwaspace from "./components/graphMiwaspace.vue";
  import oracleMiwaspace from "./components/oracleMiwaspace.vue";
  import othersMiwaspace from "./components/othersMiwaspace.vue";
  import rpcMiwaspace from "./components/rpcMiwaspace.vue";
  import storageMiwaspace from "./components/storageMiwaspace.vue";
  import zkpMiwaspace from "./components/zkpMiwaspace.vue";

  const theme = useThemeStore();

  const activeKey = ref('RPC')
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