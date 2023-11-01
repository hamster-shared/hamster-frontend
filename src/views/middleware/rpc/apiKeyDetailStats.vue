<template>

  <a-card title="Credit Cost(Last 24 hours)">
      {{creditCostData}}
  </a-card>
  <a-card title="Requests">
      <select>
              <option v-for="item in ecosystems" :value="item.ecosystemCode">{{ item.ecosystemName }}</option>
      </select>
      <select>
          <option value="STAT_15_MIN">15 min</option>
          <option value="STAT_1_HOUR">1 hour</option>
          <option value="STAT_24_HOUR">24 hour</option>
          <option value="STAT_7_DAY">7 day</option>
          <option value="STAT_1_MONTH">1 month</option>
      </select>
      <p>

      </p>
      {{requestData}}
  </a-card>
  <a-card title="Requests Activity">
      {{requestActivityData}}

      <div>
          <label>下拉的失败数据：</label>
          {{requestActivityFailData}}
      </div>
  </a-card>
  <a-card title="Requests Origin">
      {{requestOriginData}}
  </a-card>

</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {
    apiZanApiKeyCreditCost,
    apiZanApiKeyRequestActivityStats, apiZanApiKeyRequestActivityStatsFail,
    apiZanApiKeyRequestOriginStats,
    apiZanApiKeyRequestStats, apiZanEcosystemsDigest
} from "@/apis/middlewareRPC"

const props = defineProps({
    apiKeyId: {
        type: String,
        required: true
    }
})

const creditCostData = ref([])
const requestData = ref([])
const requestActivityData = ref([])
const requestActivityFailData = ref([])
const requestOriginData = ref([])


const ecosystems = ref([])


onMounted(()=>{
    apiZanEcosystemsDigest().then(res => {
        ecosystems.value = res.data
    })
    apiZanApiKeyCreditCost(props.apiKeyId).then(res => {
        creditCostData.value = res.data
    })
    apiZanApiKeyRequestStats(props.apiKeyId,"STAT_15_MIN","ethereum").then(res => {
        requestData.value = res.data
    })
    apiZanApiKeyRequestActivityStats(props.apiKeyId,"STAT_15_MIN","ethereum").then(res=>{
        requestActivityData.value = res.data
    })
    apiZanApiKeyRequestActivityStatsFail(props.apiKeyId,"","ethereum","eth_getBalance").then(res => {
        requestActivityFailData.value = res.data
    })
    apiZanApiKeyRequestOriginStats(props.apiKeyId,"STAT_15_MIN").then(res => {
        requestOriginData.value = res.data
    })
})

</script>



<style scoped lang="less">

</style>
