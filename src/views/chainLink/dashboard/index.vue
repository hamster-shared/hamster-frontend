<template>
  <div class="flex dashboard-index dark:bg-[#1D1C1A] bg-[#FFFFFF]  rounded-[12px]">
    <div
      class="dashboard-index-left px-[12px] pt-[30px] border-t-0 border-b-0 border-l-0 border-r-2 border-solid dark:border-[#434343] border-[#EBEBEB]">
      <a-menu v-model:selectedKeys="selectedKeys" style="width: 260px" :theme="theme.themeValue">
        <a-menu-item v-for="item in menuRouterList" :key="item.name" :disabled="item.meta.isTag">
          <router-link
            :to="((item.name === 'RPC' && !isRpcDefault) || (item.name === 'Oracle' && !isOracleDefault)) ? '/chainlink/default/' + item.name : item.path">
            <div>
              <svg-icon :name="item.name" size="20" class="ml-[8px] mr-[12px]" />
              <span class="text-[16px] mr-[10px]">{{ item.name }}</span>
              <span class="text-[12px] come-soon" v-if="item.meta.isTag">coming soon</span>
            </div>
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="p-[32px] dashboard-index-right">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup name="Dashboard">
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import { apiGetIfOpenService } from '@/apis/middleWare'
const theme = useThemeStore();
const router = useRouter();
const menuRouterList = ref<any>([]);
const selectedKeys = ref<any>(['']);
const isRpcDefault = ref(false)
const isOracleDefault = ref(false)

// console.log('router', router.options.routes)
onBeforeMount(() => {
  const dashboard: any = router.options.routes.find((val) => { return val.path === '/dashboard' });

  dashboard.children.map((val: any) => {
    if (val.meta.isShow) {
      menuRouterList.value.push(val)
    }
  })
  // console.log(dashboard.children, 'dashboard')
})

onMounted(async()=>{
  const rpcRes = await apiGetIfOpenService('rpc');
  isRpcDefault.value = rpcRes.data
  const oracleRes = await apiGetIfOpenService('oracle')
  isOracleDefault.value = oracleRes.data
})

watch(() => router.currentRoute.value,
  (value) => {
    if (value.name === "Default") {
      selectedKeys.value = [value.params.type];
    } else {
      selectedKeys.value = value.meta.sidebarMap || [''];
    }

    // console.log(value, 'value')
  }, { deep: true, immediate: true }
)
</script>
<style scoped lang="less">
.dashboard-index {
  min-height: calc(100vh - 114px);

  .dashboard-index-right {
    // width: 100%;
    flex: 1;
  }

  .come-soon {
    padding: 4px 10px 6px;
    background: rgba(226, 181, 120, 0.1);
    color: #E2B578;
    border-radius: 0 8px 0 8px;
  }
}

:deep(.ant-menu) {
  border-radius: 12px 0 0 0;
  height: 100%;
  max-height: 100%;
  transition: background .0s, width .0s cubic-bezier(.0, 0, 0, 1) 0s;
}

:deep(.ant-menu-vertical) {
  border: none;
}

:deep(.ant-menu-item) {
  border-radius: 12px;
}

:deep(.ant-menu.ant-menu-dark) {
  background-color: #1D1C1A;
  ;
}

:deep(.ant-menu-vertical>.ant-menu-item) {
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
}

:deep(.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected) {
  background-color: #FFFAF3;

}

:deep(.ant-menu .ant-menu-item-selected>span>a) {
  color: #E2B578;
  font-weight: bold;
}
</style>