<template>
  <div class="px-60 ant-layout-content layout-default-content">
    <div class="flex justify-between">
      <span class="text-[#151210] dark:text-[#FFFFFF] text-2xl font-bold">Congratulations！</span>
      <div>
        <a-button @click="goToGithub" class="!h-[43px] w-[150px]">View your project</a-button>
        <a-button @click="openInChainIDE" class="!h-[43px] w-[160px] ml-4">Open with ChainIDE</a-button>
      </div>
    </div>
    <div class="flex justify-between">
      <span v-if="routerType == 'repository'" class="text-[#73706E] dark:text-[#E0DBD2] w-2/3 inline-block mt-2 mb-10">
        Successfully integrated your Git repository.<br>
        When you push to a Git branch, you can check、build and deploy your smart contract by One-click on Hamster.
      </span>
      <span v-else class="text-[#73706E] dark:text-[#E0DBD2] w-2/3 inline-block mt-2 mb-10">
        Your project is fully integrated with GitHub,you can continue develop within your normal developer workflow.
        When you push to a Git branch, you can check、build and deploy your smart contract by One-click on Hamster.
      </span>
      <a-button class="back-btn" @click="router.push('/projects')">Back to project list ></a-button>
    </div>
    <div>
      <img src="@/assets/images/integrated-bg-black.png" class="hidden w-full dark:inline-block"/>
      <img src="@/assets/images/integrated-bg-white.png" class="w-full dark:hidden"/>
    </div>
  </div>
  
  <!-- <div class="my-8 text-center">
    <img src="@/assets/images/light-gridding.png" class="w-full -mt-8 dark:hidden"/>
    <img src="@/assets/images/dark-gridding.png" class="hidden w-full -mt-8 dark:inline-block"/>
    <a-button class="w-[161px] !h-[43px] button-center" @click="router.push('/projects')">Back to project list</a-button>
  </div> -->
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'
import { apiGetProjectsDetail } from "@/apis/projects";

const router = useRouter();

const routerId = router.currentRoute.value.params.id
const routerType = router.currentRoute.value.query.type

const githubNumber = ref('')

const projectData = ref(null)

const goToGithub = ()=>{
  window.open(githubNumber.value)
}

const openInChainIDE = ()=> {
  const repoUrl = projectData.value.repositoryUrl
  const fileName = "contracts/" + projectData.value.defaultFile
  const projectId = projectData.value.id
  var url = `https://staging-9589904a8a.chainide.com/s/createGithubProject?url=${repoUrl}&open=${fileName}&type=file&source=hamster&projectId=${projectId}&version=soljson-v0.8.17+commit.8df45f5fjs&line=L1`
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
.back-btn {
  background-color:unset;
  color: #E2B578;
  border: none;
  margin: 20px 0 0 0;
  font-size: 16px;
  padding: 0px;
}
.button-center {
  // left: calc(50% - 200px);
  background-color:unset;
  color: #E2B578;
}
</style>
<style lang="less">
html.projects-integrated-page {
  main.ant-layout-content {
    @apply !px-0 !max-w-full !mb-0;
  }
}
</style>