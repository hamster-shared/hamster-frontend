<script setup lang="ts">
import { useRoute } from 'vue-router';
import {ref} from "vue";  //1.先在需要跳转的页面引入useRouter
import {apiZanExchangeAccessToken} from '@/apis/middlewareRPC'

const { query, params } = useRoute();

const displayInfo = ref("loading ...")

const authCode = query.authCode

if(authCode){
    displayInfo.value = "交换token中..."
    console.log(authCode.toString())
    apiZanExchangeAccessToken(authCode.toString()).then(data => {
        console.log(data)
        displayInfo.value = "交换token成功"
        window.close()
    }).catch(err => {
        console.log(err)
        displayInfo.value = "zan授权失败"
    })
}else {
    displayInfo.value = "zan授权失败"
}

</script>

<template>

  <a-card>
      <p>
          {{  displayInfo  }}
      </p>
  </a-card>
</template>

<style scoped lang="less">

</style>
