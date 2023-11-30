<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Work</div>
    <NoData v-if="noData"></NoData>
    <div v-else class="h-[836px] flex rounded-[12px]">
      <div class="w-1/3 bg-[#F9F9F9] dark:bg-[#212121] relative rounded-tl-[12px] rounded-bl-[12px]">
        <div
          class="h-[60px] leading-[60px] pl-[30px] bg-[#EBEBEC] dark:bg-[#161616] text-[21px] font-semibold w-full rounded-tl-[12px]">
          History</div>
        <div v-for="(item, key) in historyList" :key="key">
          <div :class="{ 'bg-[#E6E8EA] dark:bg-[#313131]': selectedItem.id == item.id }" @click="changeSelect(item)"
            class="p-[20px] flex cursor-pointer">
            <img :src="getImageURL(`${item.logo}`)" class="h-[56px] w-[56px] rounded-full mr-[15px]" />
            <div class="text-[14px] text-[#757575] font-semibold history-left-w">
              <div class="text-ellipsis mb-[10px]"><label
                  class="text-[18px] text-[#000000] dark:text-[#FFFFFF] mr-[10px]">{{ item.name }}</label>{{ item.desc1 }}
              </div>
              <div class="text-ellipsis">{{ item.desc2 }}</div>
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
      <div class="w-2/3 bg-[#F1F3F4] dark:bg-[#0E0E0E] relative rounded-tr-[12px] rounded-br-[12px]">
        <div
          class="absolute top-0 h-[60px] w-full leading-[60px] pl-[30px] text-[16px] font-semibold border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-t-0">
          {{ selectedItem.name }}</div>
        <div id="send-info" class="h-[656px] mt-[60px] overflow-y-auto p-[30px]" v-if="sendMap.size > 0">
          <div v-for="(item, key) in sendList" :key="key">
            <div class="flex" v-if="item.value == 'left'">
              <img :src="getImageURL(`${selectedItem.logo}`)" class="h-[44px] w-[44px] rounded-full mr-[10px]" />
              <div class="bg-[#FFFFFF] dark:bg-[#2C2C2C] send-info-div">{{ item.info }}</div>
            </div>
            <div class="flex justify-end" v-else-if="item.value == 'right'">
              <div class="bg-[#EDF0FF] dark:bg-[#EDF0FF] send-info-div dark:text-[#3F3F3F]">{{ item.info }}</div>
              <img src="@/assets/images/agent-user.png" class="h-[44px] w-[44px] rounded-full ml-[10px]" />
            </div>
          </div>
        </div>
        <div
          class="absolute p-[30px] bottom-0 h-[120px] w-full border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-b-0">
          <a-input v-model:value="inputValue" placeholder="请输入您的需求……" @keyup.enter="sendInfo">
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
import { onMounted, ref } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import { useRouter } from "vue-router";
import { apiAgentChat } from '@/apis/agent';
import { v4 as uuidv4 } from 'uuid';
import NoData from '../home/NoData.vue'

const { getImageURL } = useAssets();
const theme = useThemeStore();
const router = useRouter();
const noData = ref(false);
const inputValue = ref('');
const chatId = ref('');
const chatIdMap = new Map();
const sendMap = new Map();
const sendList = ref<any>([]);
const historyList = ref([
  { id: '1', logo: 'testLogo.png', name: '币圈索罗斯', desc1: '项目研报 、Alpha,项目研报 、Alpha', desc2: '比特币还能做更多吗？' },
  { id: '2', logo: 'testLogo.png', name: '琴心幻影', desc1: '古风创意创作小宅女', desc2: '帮我生成一张汉服写真照片' },
  { id: '3', logo: 'testLogo.png', name: '梦幻音符', desc1: '陪伴、聊天、情感支持', desc2: '心情不好，夸夸我～' },
  { id: '4', logo: 'testLogo.png', name: 'Sophia', desc1: '产品营销、危机公关，产品营销、危机公关', desc2: '我家爱豆闹绯闻怎么办怎么办怎么办' },
]);
const selectedItem = ref<any>({});
const changeSelect = (item: any) => {
  if (!chatIdMap.get(item.name)) {
    chatId.value = uuidv4();
    chatIdMap.set(item.name, chatId.value);
  } else {
    chatId.value = chatIdMap.get(item.name);
  }
  
  selectedItem.value = item;
  if (!sendMap.get(item.name)) {
    // sendMap.set(item.name, [{ value: 'right', info: '我想部署NFT合约' }, { value: 'left', info: '需要以下参数NFT名称和符号' }]);
    sendMap.set(item.name, []);
  }
  sendList.value = sendMap.get(item.name);
  setScrollBtm();
}
const sendInfo = async () => {
  let curName = JSON.parse(JSON.stringify(selectedItem.value.name));
  try {
    setSendList('right', inputValue.value, curName); //记录发送的信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let params = {
      "chatId": chatId.value,//uuid
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
      setSendList('left', res.choices[0].message.content, curName);
    }
  } catch (e:any) {
    let res = e.response.data;
    if (res.code == 500) {
      setSendList('left', res.message, curName);
    } 
  }
}
const setSendList = (value: any, info: any, curName: any) => {
  let list = sendMap.get(curName);
  list.push({
    value: value,
    info: info,
  });
  if (curName == selectedItem.value.name) {
    sendList.value = Object.assign([], list);
  }
  sendMap.set(curName, list);
  setScrollBtm();
}
const setScrollBtm = () => {
  setTimeout((_) => {
    const container = document.getElementById('send-info') as HTMLElement; // 替换为你的容器元素ID
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, 0);
}

const newAiAgent = () => {
  router.push('/aiAgent/marketplace')
}

onMounted(() => {
  changeSelect(historyList.value[0]);
});
</script>
<style scoped lang="less">
.history-left-w {
  max-width: calc(100% - 71px);
  ;
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