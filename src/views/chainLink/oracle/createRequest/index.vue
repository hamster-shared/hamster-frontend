<template>
  <div class="mx-auto" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="mb-4 text-2xl font-bold">Create Request</div>

    <div class="p-4 border border-solid rounded-xl dark:border-[#434343] border-[#EBEBEB]">
      <div class="flex justify-between mb-4">
        <span class="items-center self-center font-bold">You can choose the following templates to quickly create a Request</span>
        <a-button type="link">View All</a-button>
      </div>
      
      <div class="overflow-x-auto">
        <div class="flex gap-4 pb-6">
          <div v-for=" (item,index) in templateListData " :key="index" class="flex flex-col shrink-0 basis-[400px] template-container">
            <div class="flex-1">
              <div class="mb-2 text-base font-bold">{{ item.title }}</div>
              <span>{{ item.author }}</span>
              <div class="mt-2">{{ item.function }}</div>
            </div>
            <div class="mt-2">
              <a-button>Use Now</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="bg-[#F6F6F6] dark:bg-[#35322E] h-[60px] rounded-t-xl">
        <div class="leading-[60px] ml-6 text-base font-bold">Pipelinefile Preview</div>
      </div>
      <div :style="editHeight">
        <CodeEditor :value="sourceContent" class="request-codeeditor"></CodeEditor>
      </div>
      <div class="mt-4 text-center">
        <a-button class="inline-block mr-4 back-btn">Back</a-button>
        <a-button>Create</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useThemeStore } from "@/stores/useTheme";
  import CodeEditor from '@/components/CodeEditor.vue'

  const theme = useThemeStore();

  const sourceContent = ref("");
  const editHeight = ref("height: 220px");

  const templateListData = reactive([
    {
      title: 'Fetch Discord Upvote Data',
      author: 'Submitted by:Sam Demaree',
      function: 'This function retrieves the number of upvotes a Discord member has received in the past 24 hours. *Note: ChatGPT was used to demonstrate that non-developers can also participate.'
    },
    {
      title: 'US election results from AP (Associated Press) API',
      author: 'Submitted by:Karen Stepanyan',
      function: 'Find the balance of a user for a specific ERC20 token across the specified chains, and return the total balance. This balance, for example, could be used immediately in the callback function to approve or deny the user access to specific functions in the contract.'
    },
    {
      title: 'Fetch outcome of off-chain Snapshot.org vote',
      author: 'Submitted by:Sam Demaree',
      function: 'The function fetches the outcome of an off-chain Snapshot.org vote proposal using the GraphQL API. Takes into account if the vote has closed and has met quorum. Gas efficient solution for DAOs.'
    },
    {
      title: 'Fetch Discord Upvote Data',
      author: 'Submitted by:Karen Stepanyan',
      function: 'This function retrieves the number of upvotes a Discord member has received in the past 24 hours. *Note: ChatGPT was used to demonstrate that non-developers can also participate.'
    },
    {
      title: 'US election results from AP (Associated Press) API',
      author: 'Submitted by:Sam Demaree',
      function: 'This function retrieves the number of upvotes a Discord member has received in the past 24 hours. *Note: ChatGPT was used to demonstrate that non-developers can also participate.'
    }
  ])

  const setCodeHeight = (content: string) => {
    let codeIndex = content.split('\n').length;
    editHeight.value = 'height: ' + codeIndex * 22 + 'px';
  }
</script>

<style lang="less" scoped>
  .request-codeeditor {
    :deep(.overflow-guard) {
      border-radius: 0 0 12px 12px;
    }
  }
  .dark-css .template-container {
    padding: 20px;
    background: rgba(226,181,120,0.1);
    box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
  .template-container {
    padding: 20px;
    background: rgba(226,181,120,0.1);
    box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
  .back-btn {
    background-color: white;
    color: #E2B578;
  }
</style>