<template>
  <div>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="flex justify-between">
        <div>
          <a-input v-model:value="keyword" placeholder="Search here..." allow-clear autocomplete="off" @change="goSearch">
            <template #prefix>
              <img
                src="@/assets/icons/white-search.svg"
                class="h-[20px] dark:hidden"
              />
              <img
                src="@/assets/icons/dark-search.svg"
                class="h-[20px] hidden dark:inline-block"
              />
            </template>
          </a-input>
        </div>
      <a-button type="primary" @click="goCreateProject">Creat by template</a-button>
    </div>
    <div class="mt-4">
      <a-tabs v-model:activeKey="activeKey" @tabClick="handleTabClick">
        <a-tab-pane key="1" tab="Contract">
          <div v-for="(item, index) in projectList" :key="index">
            <Overview :viewType="viewType" :projectType="activeKey" :viewInfo="item" @loadProjects="getProjects"  />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="FrontEnd">
          <div v-for="(item, index) in projectList" :key="index">
            <Overview :viewType="viewType" :projectType="activeKey" :viewInfo="item" @loadProjects="getProjects"  />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-pagination :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" @change="onChange" @showSizeChange="onShowSizeChange" :current="current" :total="total" size="small" />
  </div>
</template>
<script lang='ts' setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import Overview from "./components/Overview.vue";
import { apiGetProjects } from "@/apis/projects";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const router = useRouter();
const keyword = ref('');
const viewType = ref("list");
const activeKey = ref("1");
const current = ref(1);
const total = ref(0);
const pageSize = ref(10);
const projectList = ref([]);
const timer = ref(0)

const onChange = (pageNumber: number) => {
  console.log("onchange...", pageNumber);
  current.value = pageNumber;
  getProjects();
}
const onShowSizeChange = (currentVal: number, pageSizeVal: number) => {
  current.value = currentVal;
  pageSize.value = pageSizeVal;
  getProjects();
  console.log("onShowSizeChange...");
}

const goCreateProject = () => {
  router.push("/projects/creat");
}
    
onMounted(() => {
  getProjects();
  timer.value = window.setInterval(() => {
    // 其他定时执行的方法
    getProjects();
  }, 5000);
})

onBeforeUnmount(()=>{ //离开当前组件的生命周期执行的方法
    window.clearInterval(timer.value);
})

const goSearch = async () => {
  current.value = 1;
  getProjects();
}

const handleTabClick = (tab: any) => {
  if (tab === "1") {
    goSearch();
  } else if (tab === "2") {
    goSearch();
  }
}

const getProjects = async () => {
  try {
    const params = {
      query: keyword.value,
      page: current.value,
      size: pageSize.value,
      type: activeKey.value,
    }
    const { data } = await apiGetProjects(params);
    if ((data.data === null || data.data === "[]")) {
      goCreateProject();
    } else {
      projectList.value = data.data;
      
      total.value = data.total;
    }
  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};
</script>
<style lang='less' scoped>
@baseColor: #E2B578;
html[data-theme='dark'] {
  :deep(.ant-input){
    color: #8A8A8A;
    border-color: #434343;
  }
  :deep(.anticon.ant-input-clear-icon) {
    color: #E0DBD2;
  }
}

:deep(.ant-input-affix-wrapper){
  border-color: #434343;
  padding-top: 0px;
  padding-bottom: 0px;
  width: 350px;
}
:deep(.white-css .ant-input){
  color: #BBBAB9;
  border-color: #EBEBEB;
}
:deep(.ant-btn-primary){
  // width: 120px;
  height: 40px;
}
:deep(.ant-pagination){
  text-align: center;
  margin-top: 40px;
}
:deep(.ant-pagination-item-active){
  border-color: @baseColor;
  background: @baseColor;
}
:deep(.white-css .ant-pagination-item a),
:deep(.white-css .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis),
:deep(.white-css .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon){
  color: #7B7D7B ;
} 
:deep(.dark-css .ant-pagination-item a),
:deep(.dark-css .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis),
:deep(.dark-css .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon){
  color: #E0DBD2 ;
}
:deep(.ant-pagination-disabled .ant-pagination-item-link), :deep(.ant-pagination-disabled:hover .ant-pagination-item-link) {
  color: #8A8A8A !important;
  cursor: not-allowed !important;
}
:deep(.ant-pagination-item-active a){
  color: #FFFFFF !important;
}
:deep(.ant-pagination-prev button), :deep(.ant-pagination-next button){
  color: #BCBEBC;
}
:deep(.ant-pagination-options){
  display: none;
}
</style>