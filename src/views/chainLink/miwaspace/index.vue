<template>
  <div>
    <div>
      <div class="font-bold text-center text-[24px]">Find ypur MiddleWare</div>
      <div class="text-center text-[18px]">By using MiddleWare provided by Mamster, you can achieve fast development and
        deployment.
      </div>
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="RPC" tab="RPC">RPC</a-tab-pane>
      <a-tab-pane key="Oracle" tab="Oracle" force-render>Oracle</a-tab-pane>
      <a-tab-pane key="Storage" tab="Storage">Storage</a-tab-pane>
      <a-tab-pane key="Graph" tab="Graph">Graph</a-tab-pane>
      <a-tab-pane key="ZKP" tab="ZKP">ZKP</a-tab-pane>
      <a-tab-pane key="Others" tab="Others">Others</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang='ts' setup>
import { ref } from "vue";
const activeKey = ref('RPC')
</script>
<style lang='less' scoped></style>