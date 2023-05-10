<template>
  <div class="px-60 ant-layout-content layout-default-content">
    <div class="flex justify-between">
      <span class="text-[#151210] dark:text-[#FFFFFF] text-2xl font-bold">Congratulations！</span>
      <div>
        <a-button @click="goToGithub" class="!h-[43px] w-[150px]">View your project</a-button>
        <!-- <a-button @click="openInChainIDE" class="!h-[43px] w-[150px] ml-[10px]">Open with ChainIDE</a-button> -->
      </div>
    </div>
    <span class="text-[#73706E] dark:text-[#E0DBD2] w-2/3 inline-block mt-2 mb-10">
      Your project is fully integrated with GitHub,you can continue develop within your normal developer workflow.
      When you push to a Git branch, you can check、build and deploy your smart contract by One-click on Hamster.
    </span>
    <div>
      <img src="@/assets/images/light-integrated-bg.png" class="w-full dark:hidden"/>
      <img src="@/assets/images/dark-integrated-bg.png" class="hidden w-full dark:inline-block"/>
    </div>
  </div>
  
  <div class="relative mt-8 text-center">
    <img src="@/assets/images/light-gridding.png" class="w-full -mt-8 dark:hidden"/>
    <img src="@/assets/images/dark-gridding.png" class="hidden w-full -mt-8 dark:inline-block"/>
    <a-button class="w-[443px] !h-[52px] !absolute top-1 button-center" @click="router.push('/projects')">Back to project list</a-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'
import { apiGetProjectsDetail } from "@/apis/projects";

const router = useRouter();

const routerId = router.currentRoute.value.params.id

const githubNumber = ref('')

const projectData = ref(null)

const goToGithub = ()=>{
  window.open(githubNumber.value)
}

const openInChainIDE = ()=> {
  const gistId = projectData.value.gistId
  const fileName = projectData.value.defaultFile
  var url = `https://chainide.com/s/createGistProject?gist=${gistId}&open=${fileName}`
  window.open(url)
}

onBeforeMount(()=>{
  document.documentElement.classList.add('projects-integrated-page')
})

onMounted(async()=>{
  const { data } = await apiGetProjectsDetail(routerId)
  projectData.value = data
  githubNumber.value = data.repositoryUrl
})

onBeforeUnmount(()=>{
  document.documentElement.classList.remove('projects-integrated-page')
})
</script>

<style lang="less" scoped>
.button-center {
  left: calc(50% - 200px);
}
</style>
<style lang="less">
html.projects-integrated-page {
  main.ant-layout-content {
    @apply !px-0 !max-w-full !mb-0;
  }
}
</style>