<template>
  <div class="flex dashboard-index dark:bg-[#1D1C1A] bg-[#FFFFFF]  rounded-[12px]">
    <div
      class="dashboard-index-left px-[12px] pt-[30px] border-t-0 border-b-0 border-l-0 border-r-2 border-solid dark:border-[#434343] border-[#EBEBEB]">
      <a-menu :openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 260px" :theme="theme.themeValue" mode="inline">
        <div v-for="item in menuRouterList">
          <a-menu-item :key="item.name" :disabled="item.meta.isTag" v-if="item.name!='RPC'">
            <router-link :to="item.path">
              <div>
                <svg-icon :name="item.name" size="20" class="ml-[8px] mr-[12px] icon-no" />
                <svg-icon :name="item.name+'Selected'" size="20" class="ml-[8px] mr-[12px] icon-yes" />
                <span class="text-[16px] mr-[10px]">{{ item.name }}</span>
                <span class="text-[12px] come-soon" v-if="item.meta.isTag">coming soon</span>
              </div>
            </router-link>
          </a-menu-item>
          <a-sub-menu v-else :key="item.key" @titleClick="toChild">
            <template #icon>
              <svg-icon :name="item.name" size="20" class="ml-[8px] mr-[12px]" />
            </template>
            <template #title><span class="text-[16px]">{{item.name}}</span></template>
            <template v-for="child in item.children">
              <template v-if="child?.meta?.isShow">
                <a-menu-item :key="child.name" class="!pl-[76px]">
                  <router-link :to="child.path">
                  <div>{{child.name}}</div>
                  </router-link>
                </a-menu-item>
              </template>
            </template>
          </a-sub-menu>
        </div>
      </a-menu>
    </div>
    <div class="p-[32px] dashboard-index-right">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import { apiAgentChat } from '@/apis/agent'
const theme = useThemeStore();
const router = useRouter();
const menuRouterList = ref<any>([]);
const selectedKeys = ref<any>(['']);
const openKeys = ref<any>([]);

onBeforeMount(() => {
  const aigent: any = router.options.routes.find((val) => { return val.path === '/aiAgent/work' });

  aigent.children.map((val: any) => {
    if (val.meta.isShow) {
      menuRouterList.value.push(val)
    }
  })
})

const toChild = ( {key, domEvent })=>{
  console.log('toChild',key,domEvent)
}

watch(() => router.currentRoute.value,
  (value) => {
    selectedKeys.value = value.meta.sidebarMap || [''];
  }, { deep: true, immediate: true }
)

onMounted(async()=>{
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  let a= {
    "chatId": "abcd",//用随机数或者uuid
    "stream": false,
    "detail": false,
    "variables": {
        "uid": userInfo?.id,
        "name": userInfo?.username
    },
    "messages": [
        {
            "content": "请帮我部署一条nft合约",//用户界面输入的参数
            "role": "user"
        }
    ]
  }
  const res = await apiAgentChat(a)
  console.log(111111111,res)
})
</script>
<style scoped lang="less">

.dashboard-index {
  min-height: calc(100% - 114px);

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
  border-radius: 10px;
}
:deep(.ant-menu-inline .ant-menu-item){
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
}

:deep(.ant-menu.ant-menu-dark),
:deep(.ant-menu-dark .ant-menu-inline.ant-menu-sub) {
  background-color: #1D1C1A;
}
:deep(.ant-menu-sub.ant-menu-inline){
  background-color: #ffffff;
}

:deep(.ant-menu-vertical>.ant-menu-item) {
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
}

:deep(.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected){
  background-color: #FFFAF3;
}
:deep(.ant-menu-inline .ant-menu-item-selected:after, .ant-menu-inline .ant-menu-selected:after){
  opacity: 0;
}
:deep(.ant-menu-inline){
  border-right: 0;
}

.icon-yes{
  display: none;
}
.icon-no{
  display: inline-block;
}
:deep(.ant-menu .ant-menu-item-selected>span>a) {
  color: #E2B578;
  font-weight: bold;
  .icon-yes{
    display: inline-block;
  }
  .icon-no{
    display: none;
  }
}
</style>
