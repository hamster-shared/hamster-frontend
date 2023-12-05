<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <!-- <div class="font-bold text-[24px] mb-[30px]">Work</div> -->
    <NoData v-if="!historyList.length"></NoData>
    <div v-else class="h-[836px] min-w-[560px] flex rounded-[12px]">
      <div class="w-1/3  bg-[#F9F9F9] dark:bg-[#212121] relative rounded-tl-[12px] rounded-bl-[12px]">
        <div
          class="h-[60px] leading-[60px] pl-[30px] bg-[#EBEBEC] dark:bg-[#161616] text-[21px] font-semibold w-full rounded-tl-[12px]">
          History</div>
        <div id="history-info" class="h-[656px] overflow-y-auto">
          <div v-for="(item, key) in historyList" :key="key">
            <div :class="{ 'bg-[#E6E8EA] dark:bg-[#313131]': selectedItem.id == item.id }" @click="changeSelect(item)"
              class="p-[20px] flex cursor-pointer w-full">
              <img :src="getImageURL(`${item.logo}`)" class="h-[56px] w-[56px] rounded-full mr-[15px] " />
              <div class="text-[14px] text-[#757575] font-semibold history-left-w">
                <div class="text-ellipsis mb-[10px] "><label
                    class="text-[18px] text-[#000000] dark:text-[#FFFFFF] mr-[10px]">{{ item.name }}</label>{{ item.title }}
                </div>
                <div class="text-ellipsis ">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute bottom-[20px] left-[20px] right-[20px] h-[65px] leading-[65px] cursor-pointer flex justify-center items-center border border-solid border-[#6C6C6C] bg-[#000000] rounded-[10px] text-[16px] text-[#FFFFFF]"
          @click="newAiAgent">
          <svg-icon name="add-white" size="26" class="mr-[10px]" />
          New AI Agent
        </div>
      </div>
      <div class="flex-1 w-0  bg-[#F1F3F4] dark:bg-[#0E0E0E] relative rounded-tr-[12px] rounded-br-[12px]">
        <div
          class="absolute top-0 h-[60px] w-full leading-[60px] pl-[30px] text-[16px] font-semibold border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-t-0">
          {{ selectedItem.name }}</div>
        <div id="send-info" class="h-[656px] mt-[60px] overflow-y-auto p-[30px]">
          <div v-if="sendMap.size > 0" class=" ">
            <div v-for="(item, key) in sendList" :key="key">
              <div class="flex justify-end" v-if="item.value == 'right'">
                <div class="bg-[#EDF0FF] dark:bg-[#EDF0FF] send-info-div dark:text-[#3F3F3F]">{{ item.info }}</div>
                <img src="@/assets/images/agent-user.png" class="h-[44px] w-[44px] rounded-full ml-[10px]" />
              </div>
              <div class="flex" v-if="item.value == 'left' || key == sendList.length - 1 && chatIdMap.get(item.id).isLoading">
                <img :src="getImageURL(`${selectedItem.logo}`)" class="h-[44px] w-[44px] rounded-full mr-[10px]" />
                <img v-if="key == sendList.length - 1 && chatIdMap.get(item.id).isLoading" src="@/assets/images/loading.gif" class="h-[54px]" />
                <div v-else class="bg-[#FFFFFF] dark:bg-[#2C2C2C] send-info-div">{{ item.info }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute p-[30px] bottom-0 h-[120px] w-full border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-b-0">
          <a-input v-model:value="inputValue" placeholder="Please enter your requirements" @keyup.enter="sendInfo">
            <template #suffix>
              <svg-icon name="Send" size="26" class="mr-[10px]" @click="sendInfo" />
            </template>
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import { useRouter, useRoute } from "vue-router";
import { apiAgentChat } from '@/apis/agent';
import { v4 as uuidv4 } from 'uuid';
import NoData from '../home/NoData.vue'
import { agentList } from '../home/agentData';
import { apiChatHistory, apiChatDetail, apiChat } from '@/apis/aiAgent'

const { getImageURL } = useAssets();
const theme = useThemeStore();
const router = useRouter();
const route = useRoute()
const inputValue = ref('');
const historyList = ref<any>([]);
const chatIdMap = new Map();
const sendMap = new Map();
const sendList = ref<any>([]);
const selectedItem = ref<any>({});
const changeSelect = (item: any) => {
  if (!chatIdMap.get(item.id)) {
    chatIdMap.set(item.id, { chatId: uuidv4() ,isLoading: false});
  }
  
  selectedItem.value = item;
  if (!sendMap.get(item.id)) {
    // sendMap.set(item.id, [{ value: 'right', info: '我想部署NFT合约' }, { value: 'left', info: '需要以下参数NFT名称和符号' }]);
    sendMap.set(item.id, []);
  }
  sendList.value = sendMap.get(item.id);
  setScrollBtm();
}
const sendInfo = async () => {
  let curId = JSON.parse(JSON.stringify(selectedItem.value.id));
  try {
    setSendList('right', inputValue.value, curId); //记录发送的信息
    chatIdMap.get(curId).isLoading = true;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let params = {
      "chatId": chatIdMap.get(curId).chatId,//uuid
      "stream": false,
      "detail": false,
      "variables": {
          "uid": userInfo?.id,
          "name": userInfo?.username
      },
      "messages": [
          {
              "content": inputValue.value,//用户界面输入的参数
              "role": "user"
          }
      ]
    }
    inputValue.value = '';
    const res = await apiAgentChat(params);
    if (res.choices.length > 0) {
      setSendList('left', res.choices[0].message.content, curId);
    }
  } catch (e: any) {
    console.log("e:",e);
    let res = e.response.data;
    if (res.code == 500) {
      setSendList('left', res.message, curId);
    } 
  }
}
const setSendList = (value: any, info: any, curId: any) => {
  let list = sendMap.get(curId);
  list.push({
    id: curId,
    value: value,
    info: info,
  });
  if (curId == selectedItem.value.id) {
    chatIdMap.get(curId).isLoading = false;
    sendList.value = Object.assign([], list);
  }
  sendMap.set(curId, list);
  setScrollBtm();
}
const setScrollBtm = (eleId = 'send-info') => {
  setTimeout((_) => {
    const container = document.getElementById(eleId) as HTMLElement; // 替换为你的容器元素ID
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, 0);
}

const newAiAgent = () => {
  // router.push('/aiAgent/marketplace')
  let list = Object.assign({}, agentList[agentList.length - 1])
  list.id = historyList.value.length + 1 + '';
  historyList.value.push(list);
  changeSelect(historyList.value[historyList.value.length - 1]);
  console.log("historyList:", historyList.value);
  setScrollBtm('history-info');
}
const getHistoryList = async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const res = await apiChatHistory(userInfo.id);
  console.log("res:",res);
}
watch(() => router.currentRoute.value,
  (value) => {
    if (value.query.newWork) {
      newAiAgent();
    }
  }, { deep: true, immediate: true }
)
onMounted(() => {
  getHistoryList();
  historyList.value = Object.assign([], agentList);
  if (historyList.value.length > 0) {
    changeSelect(historyList.value[0]);
  }
});
</script>
<style scoped lang="less">
.history-left-w {
  // width: calc(100% - 80px);
  // flex-shrink: 0;
  flex: 1;
  overflow: hidden;
}

.text-ellipsis {
  text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
  white-space: nowrap; //文本不自动换行
  overflow: hidden;
}

:deep(.ant-input-affix-wrapper) {
  height: 60px;
  border-radius: 30px;
  border: 1px solid #E8E8E8;
  background: #FFFFFF;
  padding: 0 30px;
}

:deep(.ant-input) {
  height: 58px;
  font-size: 18px;
  font-weight: 500;
}

.send-info-div {
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
  max-width: calc(100% - 150px);
}

.dark-css {
  :deep(.ant-input-affix-wrapper) {
    border-color: #636363;
    background: #161616;
  }
}
</style>