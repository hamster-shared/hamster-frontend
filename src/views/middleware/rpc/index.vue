<template>
  <div class="flex justify-between">
      <span class="font-bold text-[24px]">My Apps</span>
  </div>
    <div class="flex justify-between mt-[16px]">
        <a-card style="width: 100%">
            <a-card-grid style="width: 35%; text-align: center" v-for="(item) in apiKeyList" :key="item.apiKeyId">
              <rpc-app-panel :api-key-info="item" />
            </a-card-grid>
            <a-card-grid style="width: 15%;height: 100%;text-align: center">
                <a-card>
                    <button @click="openAppModal">+</button>
                </a-card>
            </a-card-grid>
        </a-card>
    </div>

    <div class="flex justify-between">
        <span class="font-bold text-[24px]">Overview</span>
    </div>

    <div class="flex justify-between mt-[16px]">
         <a-card>
            <a-row>
                <a-col :span="16">
                    <credit-cost24/>
                </a-col>
                <a-col :span="8">
                    <credit-info/>
                </a-col>

            </a-row>
        </a-card>

    </div>
    <div>
        <request-stats  :apps="apiKeyList"/>

  </div>

    <a-modal v-model:visible="visible" title="Create App" @ok="createApp">
        <p>Name</p>
        <p><a-input type="text" v-model:value="appName"/></p>
    </a-modal>

</template>
<script lang='ts' setup>
import {onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import { message } from 'ant-design-vue';
import {apiGetZanUserAuthed,apiGetZanAuthUrl,apiZanCreateApiKey, apiZanApiKeyPage} from "@/apis/middlewareRPC"
import RpcAppPanel from "@/views/middleware/rpc/rpcAppPanel.vue";
import CreditInfo from "@/views/middleware/rpc/creditInfo.vue";
import CreditCost24 from "@/views/middleware/rpc/creditCost24.vue";
import RequestStats from "@/views/middleware/rpc/requestStats.vue";
const router = useRouter();
const theme = useThemeStore();

const selectedApp = ref<string>('aishow')
const visible = ref<boolean>(false);
const appName = ref('')
const apiKeyList = ref([])

const openAppModal = async () => {
    const authedData = await apiGetZanUserAuthed()
    if(authedData.data){
        message.info("已经授权")
        visible.value = true
    }else {
        message.info("jump to zan to auth")
        let url = ""
        try{
          const authUrlResp = await apiGetZanAuthUrl()
            url = authUrlResp.data
        }catch (e) {
            return
        }
        const myWindow = window.open(url, 'login-zan', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
        myWindow?.focus()
    }
}

const createApp = async () => {

    apiZanCreateApiKey(appName.value).then(resp => {
        visible.value=false
        message.info("create apiKey success")
    }).catch(err => {
        message.error("create apiKey fail, reason: ", err)
    })
}

onMounted( async ()=> {
    apiZanApiKeyPage(1,10).then(resp => {
        console.log(resp.data.data)
        apiKeyList.value = resp.data.data
    })
})



</script>
<style lang='less' scoped>
.myChart {
  width: 100%;
  height: 100%;
}

:deep(.ant-radio-group .ant-radio-button-wrapper) {
  border-radius: 0;
}

:deep(.ant-radio-group) {
  margin-top: 24px;
}
</style>
