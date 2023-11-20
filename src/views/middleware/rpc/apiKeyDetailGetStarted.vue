<template>
  <a-card>
      <p>API KEY </p>
      <p>
          <input type="text" :value="apiKeyDetail.apiKeyId"/>
      </p>
  </a-card>

  <a-card>
      <a-card-grid style="width: 25%; text-align: center" v-for="item in apiKeyDetail.ecosystemDetailInfos" :key="item.ecosystemCode">
          <api-key-detail-get-started-network :ecosystem-detail-info="item"/>
      </a-card-grid>
  </a-card>
</template>

<script setup lang="ts">
import ApiKeyDetailGetStartedNetwork from "@/views/middleware/rpc/apiKeyDetailGetStartedNetwork.vue";

const props = defineProps({
    apiKeyDetail: {
        type: Object,
        required: true
    }
})
</script>

<style scoped lang="less">

</style>
