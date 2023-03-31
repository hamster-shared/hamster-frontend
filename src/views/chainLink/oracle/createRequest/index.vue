<template>
  <div>Create Request</div>
  <a-divider></a-divider>

  <div>
    <span class="inline-block mb-4">You can choose the following templates to quickly create a Request</span>
    <div class="flex gap-4">
      <div v-for=" (item,index) in templateListData " :key="index" class="w-[400px]">
        <h1>{{ item.title }}</h1>
        <span>{{ item.author }}</span>
        <div>{{ item.function }}</div>
        <a-button>Use Now</a-button>
      </div>
    </div>
  </div>

  <div class="bg-white mt-6 h-[200px]">
    <span>Pipelinefile Preview</span>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';

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
</script>