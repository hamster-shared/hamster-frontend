<template>
  <a-config-provider>
    <template #renderEmpty>
      <!-- <div style="text-align: center">
        <img src="@/assets/images/cl-noData-block.png" alt="" class="w-[128px] hidden dark:inline-block" />
        <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] dark:hidden" />
        <p>No Data</p>
      </div> -->
      <NoData />
    </template>
  <div class="">
    <!-- Default Layout -->
    <a-layout class="layout-default" id="layout-default" :class="layoutClass">
      <!-- Layout Header's Conditionally Fixed Wrapper -->
      <DefaultHeader />
      <!-- / Layout Header's Conditionally Fixed Wrapper -->
      <Support />

      <!-- Layout Content -->
      <a-layout class="layout-default-page pt-[64px] dark:!bg-[#000000]">
        <!-- Page Content -->
        <a-layout-content class="layout-default-content px-60 dark:text-white text-[#151210]">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />
        </a-layout-content>
        <!-- / Page Content -->
      </a-layout>
      <!-- / Layout Content -->
    </a-layout>
    <!-- / Dashboard Layout -->
  </div>
  </a-config-provider>
</template>
<script lang="ts" setup>
import DefaultHeader from "../../components/DefaultHeader/index.vue";
import Support from "../../components/Support.vue";
import NoData from "@/components/NoData.vue"
import { RouterView, useRoute } from "vue-router";
import { computed, ref } from "vue";
const routes = useRoute();

const layoutClass = computed(() => {
  return routes.meta.layoutClass;
});
</script>
<style lang="less" scoped>
.ant-layout {
  background: #F6F6F6;
}

.layout-default-page {
  min-height: 100vh;
}

.layout-default-content {
  width: 100%;
  // padding: 24px;
  max-width: 1920px;
  min-width: 1080px;
  margin: 24px auto;
  border-radius: 12px;
  border: 1px solid transparent;
}
</style>
<style lang="less">

.open-link-css{
  color: #E2B578;
  .svg-icon {
    color: #E2B578;
  }
  &:hover{
    color: #E4C08F;
    .svg-icon {
      color: #E4C08F;
    }
  }
  &:active{
    color: #CE9C58;
    .svg-icon {
      color: #CE9C58;
    }
  }
}

.dfx-css{
  background: rgba(226,181,120,0.1);
  border-radius: 0px 8px 0px 8px;
  color: #E2B578;
  font-size: 12px;
  line-height: 24px;
  width: 66px;
  height: 24px;
  text-align: center;
}

</style>
