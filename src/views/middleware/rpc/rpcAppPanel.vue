<template>
      <a-card  :title="apiKeyInfo.name" :bordered="true">
          <a-row type="flex" justify="space-around">
              <a-col :span="18">
                  <p>{{createTime}}</p>
                  <a-button @click="goDetail">Api Key</a-button>
              </a-col>
              <a-col >
                  >
              </a-col>
          </a-row>
      </a-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();


const props = defineProps({
  apiKeyInfo: {
    type: Object,
    required: true
  }
})


const createTime = ref('2023-10-24T03:32:35.031Z')

const goDetail = () => {
    router.push({name:'zanApiKeyDetail', params:{ apiKeyId: props.apiKeyInfo.apiKeyId }, query: {name: props.apiKeyInfo.name}})
}

</script>

<style scoped lang="less">

</style>
