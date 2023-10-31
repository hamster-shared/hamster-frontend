<template>
  <div>
      <h1 style="color: gold">{{apiKeyName}}</h1>
  </div>
  <a-tabs>
      <a-tab-pane key="1" tab="Get Started">
        <api-key-detail-get-started :api-key-detail="apiKeyDetail"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Security"></a-tab-pane>
      <a-tab-pane key="3" tab="Stats">
          <api-key-detail-stats :api-key-id="apiKeyDetail.apiKeyId" />
      </a-tab-pane>
  </a-tabs>
  {{apiKeyDetail}}
</template>
<script setup lang="ts">

import {apiZanApiKeyDetail} from '@/apis/middlewareRPC'
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router';
import ApiKeyDetailGetStarted from "@/views/middleware/rpc/apiKeyDetailGetStarted.vue";
import ApiKeyDetailStats from "@/views/middleware/rpc/apiKeyDetailStats.vue";

const route = useRoute();

const apiKeyDetail = ref({})
const apiKeyName = ref<string>("")

onMounted(async ()=>{

    console.log(route.params)

    apiKeyName.value = <string>route.query.name

    apiZanApiKeyDetail(<string>route.params.apiKeyId).then(resp => {
        apiKeyDetail.value = resp.data
    })

})

</script>



<style scoped lang="less">

</style>
