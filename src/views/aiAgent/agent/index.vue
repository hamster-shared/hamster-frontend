<template>
  <div class="relative" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">My Agents</div>
    <NoData v-if="noData"></NoData>
    <div v-else>
      <div @click="hireMarketplace"
        class="absolute -top-[80px] right-0 w-[300px] h-[65px] leading-[65px] cursor-pointer flex justify-center items-center border border-solid border-[#6C6C6C] bg-[#000000] rounded-[10px] text-[16px] text-[#FFFFFF]">
        <svg-icon name="add-white" size="26" class="mr-[10px]" />
        Hire Agent from marketplace
      </div>
      <div class="bg-[#F5F6F8] dark:bg-[#0E0E0E] rounded-[12px] h-[825px] p-[20px] overflow-y-auto">
        <div class="grid grid-cols-2 gap-[20px]">
          <div v-for="(item, key) in agentList" :key="item.id"
            class="card-div bg-[#FFFFFF] dark:bg-[#000000] hover:border hover:border-solid hover:!border-[#E2B578] cursor-pointer">
            <div class="p-[30px]">
              <div class="flex mb-[10px]">
                <img v-if="item.ownedBy" src="@/assets/images/Owned-by-you.png"
                  class="h-[24px] w-[105px] absolute -top-[6px] left-[90px]" />
                <img :src="getImageURL(`${item.logo}`)" class="h-[70px] w-[70px] rounded-full mr-[20px]" />
                <div class="h-[70px] leading-[70px] text-[18px] font-medium title-w text-ellipsis">{{ item.name }}</div>
              </div>
              <div class="text-[16px] font-medium text-[#656D7A] text-ellipsis-line h-[50px]">{{ item.desc }}</div>
            </div>
            <div
              class="border border-solid border-[#E8EBEC] dark:border-[#212121] border-x-0 border-b-0 flex h-[60px] leading-[60px] text-center">
              <div
                class="w-1/2 border border-solid border-[#E8EBEC] dark:border-[#212121] border-y-0 border-l-0 hover:text-[#E2B578]"
                @click="viewMore(item)">
                View More</div>
              <div class="w-1/2 hover:text-[#E2B578]" @click="startWork(item)">Start working</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import { useRouter } from "vue-router";
import NoData from '../home/NoData.vue'
import { agentList } from '../home/agentData';

const { getImageURL } = useAssets();
const theme = useThemeStore();
const router = useRouter();
const noData = ref(false);

const hireMarketplace = () => {
  router.push('/aiAgent/marketplace')
}

const viewMore = (item: any) => {
  router.push(`/aiAgent/marketplace/detail?id=${item.id}`)
}

const startWork = (item: any) => {
  router.push('/aiAgent/work')
}

</script>
<style scoped lang="less">
.card-div {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: 1px solid transparent;
}

.title-w {
  max-width: calc(100% - 90px);
}

.text-ellipsis {
  text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
  white-space: nowrap; //文本不自动换行
  overflow: hidden;
}

.text-ellipsis-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //超出2行显示省略号
}
</style>