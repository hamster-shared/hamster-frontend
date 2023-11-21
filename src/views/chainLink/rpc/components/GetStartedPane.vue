<template>
  <div class="border mb-[30px] border-solid border-[#EBEBEB] dark:border-[#434343] rounded-[12px] p-[30px]">
    <div class="text-[21px] font-bold">API Key</div>
    <div class="mt-[20px] p-[16px] rounded-[8px] bg-[#F5F5F5] dark:bg-[#323232] flex justify-between items-center w-1/2">
      <label class="text-[#73706E] dark:text-[#FFFFFF]">{{ apiKeyId }}</label>
      <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard(apiKeyId)" />
    </div>
  </div>
  <div v-if="apiKeyDetailList.length > 0" class="grid grid-cols-3 gap-[10px]">
    <div class="ethereum-container" v-for="(item,key) in apiKeyDetailList" :key="key">
      <div class="flex justify-between items-center">
        <div class="flex justify-between items-center">
          <img :src="item.ecosystemIcon" class="h-[50px]">
          <label class="font-bold text-[21px] mx-[10px] max-w-[120px]">{{ item.ecosystemName }}</label>
        </div>
        <a-dropdown>
          <label class="cursor-pointer text-[16px] flex justify-between items-center" @click.prevent>
            {{ item.networkValue }}
            <svg-icon name="right" size="17" class="ml-[10px]" style="transform: rotate(90deg);" />
          </label>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(itemSub, itemKey) in item.networkDetailInfoList" :key="itemKey">
                <a href="javascript:;" @click="setNetWorkValue(key, itemSub)">{{ itemSub.name }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <div>
        <div class="label-title">HTTPS</div>
        <div class="label-input">
          <div class="label-text text-ellipsis">{{ item.httpsUrl }}</div>
          <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard(item.httpsUrl)" />
        </div>
        <div class="label-title">WSS</div>
        <div class="label-input">
          <div class="label-text text-ellipsis">{{ item.wssUrl }}</div>
          <svg-icon name="copy" size="18" class="svg-color ml-2 text-[#E2B578]" @click="copyToClipboard(item.wssUrl)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { copyToClipboard } from "@/utils/tool";
import { useRoute } from 'vue-router';
import { apiZanApiKeyDetail } from "@/apis/middlewareRPC";

const route = useRoute()
const apiKeyId = route.query.apiKeyId || '';
const apiKeyDetailList = ref<any>([]);
//获取apikey 详细信息
const getApiKeyDetail = async () => {
  let res = await apiZanApiKeyDetail(<string>apiKeyId)
  console.log("res:", res);
  if (res.code == 200) {
    apiKeyDetailList.value = res.data.ecosystemDetailInfos;
    //设置network初始值
    apiKeyDetailList.value.forEach((item: any, key: any) => {
      if (item.networkDetailInfoList.length > 0) {
        apiKeyDetailList.value[key].networkValue = item.networkDetailInfoList[0].name;
        apiKeyDetailList.value[key].httpsUrl = item.networkDetailInfoList[0].httpsUrl;
        apiKeyDetailList.value[key].wssUrl = item.networkDetailInfoList[0].wssUrl;
      }
    });
    console.log("apiKeyDetailList.value:",apiKeyDetailList.value);
  }
}
// 切换 network 修改对应框得值
const setNetWorkValue = (index: any, item: any) => {

  apiKeyDetailList.value[index].networkValue = item.name;
  apiKeyDetailList.value[index].httpsUrl = item.httpsUrl;
  apiKeyDetailList.value[index].wssUrl = item.wssUrl;
}
onMounted(() => {
  getApiKeyDetail();
});
</script>
<style scoped>
.ethereum-container {
  @apply dark:bg-[#10100F];
  /* display: inline-block;
  min-width: 300px; */
  padding: 20px;
  background: #F3F3F3;
  border-radius: 12px;
  /* margin: 5px; */
  border: 1px solid transparent;
}
.ethereum-container:hover{
  border: 1px solid #E2B578;
}
.text-ellipsis {
  text-overflow: ellipsis; 
  white-space: nowrap; 
  overflow: hidden;
}
.label-title{
  @apply text-[16px] font-medium mt-[20px];
}
.label-input{
  @apply mt-[10px] bg-[#FFFFFF] dark:bg-[#242424] rounded-[8px] py-[12px] px-[10px] flex justify-between items-center;
}
.label-text{
  @apply text-[#A0A0A0] dark:text-[#A0A0A0];
  width: 200px;
}

</style>