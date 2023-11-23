<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Work</div>
    <div v-if="noData" class="bg-[#F3F3F3] dark:bg-[#0E0E0E] rounded-[12px] h-[836px] flex justify-center items-center py-[100px] px-[30px]">
      <div class="text-center">
        <img src="@/assets/images/rpc-nodata.png" class="h-[150px]"/>
        <div class="text-[21px] font-medium text-[#656D7A] mt-[30px]">You don`t have any Agent yet, hurry up and go to the market to hire one!</div>
        <div class="mt-[60px] flex justify-center items-center">
          <div class="h-[65px] leading-[65px] w-[360px] cursor-pointer flex justify-center items-center border border-solid border-[#6C6C6C] bg-[#000000] rounded-[10px] text-[16px] text-[#FFFFFF]">
            <svg-icon name="add-white" size="26" class="mr-[10px]" />
            Hire Agent from marketplace
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-[836px] flex rounded-[12px]">
      <div class="w-1/3 bg-[#F9F9F9] dark:bg-[#212121] relative rounded-tl-[12px] rounded-bl-[12px]">
        <div class="h-[60px] leading-[60px] pl-[30px] bg-[#EBEBEC] dark:bg-[#161616] text-[21px] font-semibold w-full rounded-tl-[12px]">History</div>
        <div v-for="(item,key) in historyList" :key="key">
          <div :class="{'bg-[#E6E8EA] dark:bg-[#313131]': selectedItem.id == item.id}" @click="changeSelect(item)" class="p-[20px] flex cursor-pointer">
            <img :src="getImageURL(`${item.logo}`)" class="h-[56px] w-[56px] rounded-full mr-[15px]"/>
            <div class="text-[14px] text-[#757575] font-semibold history-left-w">
              <div class="text-ellipsis mb-[10px]"><label class="text-[18px] text-[#000000] dark:text-[#FFFFFF] mr-[10px]">{{ item.name }}</label>{{ item.desc1 }}</div>
              <div class="text-ellipsis">{{ item.desc2 }}</div>
            </div>
          </div>
        </div>
        <div class=" absolute bottom-[20px] left-[20px] right-[20px] h-[65px] leading-[65px] cursor-pointer flex justify-center items-center border border-solid border-[#6C6C6C] bg-[#000000] rounded-[10px] text-[16px] text-[#FFFFFF]">
          <svg-icon name="add-white" size="26" class="mr-[10px]" />
          New AI Agent
        </div>
      </div>
      <div class="w-2/3 bg-[#F1F3F4] dark:bg-[#0E0E0E] relative rounded-tr-[12px] rounded-br-[12px]">
        <div class="absolute top-0 h-[60px] w-full leading-[60px] pl-[30px] text-[16px] font-semibold border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-t-0">{{ selectedItem.name }}</div>
        <div class="absolute p-[30px] bottom-0 h-[120px] w-full border border-solid border-[#E6E6E6] dark:border-[#212121] border-x-0 border-b-0">
          <a-input v-model:value="inputValue" placeholder="请输入您的需求……">
            <template #suffix>
              <svg-icon name="Send" size="26" class="mr-[10px]" />
            </template>
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
const { getImageURL } = useAssets();
const theme = useThemeStore();

const noData = ref(false); 
const inputValue = ref('');
const historyList = ref([ 
  {id:'1',logo:'testLogo.png', name:'币圈索罗斯', desc1:'项目研报 、Alpha,项目研报 、Alpha', desc2:'比特币还能做更多吗？'},
  {id:'2',logo:'testLogo.png', name:'琴心幻影', desc1:'古风创意创作小宅女', desc2:'帮我生成一张汉服写真照片'},
  {id:'3',logo:'testLogo.png', name:'梦幻音符', desc1:'陪伴、聊天、情感支持', desc2:'心情不好，夸夸我～'},
  {id:'4',logo:'testLogo.png', name:'Sophia', desc1:'产品营销、危机公关，产品营销、危机公关', desc2:'我家爱豆闹绯闻怎么办怎么办怎么办'},
]);
const selectedItem = ref(historyList.value[0]);
const changeSelect = (item:any) => {
  selectedItem.value = item;
}
</script>
<style scoped lang="less">
.history-left-w{
  max-width: calc(100% - 71px);;
}
.text-ellipsis {
  text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
  white-space: nowrap; //文本不自动换行
  overflow: hidden;
}
:deep(.ant-input-affix-wrapper){
  height: 60px;
  border-radius: 30px;
  border: 1px solid #E8E8E8;
  background: #FFFFFF;
  padding: 0 30px;
}
:deep(.ant-input){
  height: 58px;
  font-size: 18px;
  font-weight: 500;
}
.dark-css{
  :deep(.ant-input-affix-wrapper){
    border-color: #636363;   
    background: #161616;
  }
}
</style>