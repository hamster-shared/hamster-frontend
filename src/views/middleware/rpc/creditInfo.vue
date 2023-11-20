<template>
    <a-spin :spinning="loading">
      <a-descriptions :title="userPlan.planName" :column="1" size="small">
          <template #extra><a-button size="small">Upgrade</a-button></template>
        <a-descriptions-item label="Balance">{{ userPlan.totalCredit-userPlan.usedCredit }} credits</a-descriptions-item>
        <a-descriptions-item label="Total">{{ userPlan.totalCredit }} credits</a-descriptions-item>
        <a-descriptions-item label="Rate limits">{{ userPlan.creditLimit }} credits/s</a-descriptions-item>
        <a-descriptions-item label="Expire date">{{ userPlan.expireTime }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {apiGetZanUserAuthed, apiZanPlan} from "@/apis/middlewareRPC";

const userPlan = ref({
    planName: '',
    totalCredit: 0,
    usedCredit: 0,
    creditLimit: 0,
    expireTime: '',
})

const loading = ref(true)

const zanPlan = async () => {
    loading.value = true
    const authedData = await apiGetZanUserAuthed()
    if(authedData.data){
        let data  = await apiZanPlan()
        console.log(data)
        userPlan.value = data.data
    }
    loading.value = false
}

onMounted(()=>{
    zanPlan()
})


</script>


<style scoped lang="less">

</style>
