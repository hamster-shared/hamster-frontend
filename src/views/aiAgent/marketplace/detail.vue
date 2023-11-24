<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Marketplace</div>
    <div class="bg-[#F5F6F8] rounded-[12px]">
      <div class="bg-[#EBEBEC] rounded-tl-[12px] rounded-tr-[12px] p-[30px] flex justify-between items-center">
        <div class="flex justify-center">
          <img :src="getImageURL(`${detailInfo.logo}`)" class="h-[100px] w-[100px] rounded-full mr-[20px]"/>
          <div class="font-semibold text-[#656D7A]">
            <div><label class="text-[21px] text-[#000000] mr-[10px]">{{ detailInfo.title }}</label><label class="text-[16px]">{{ detailInfo.name }}</label></div>
            <div class="text-[14px] mt-[7px] text-ellipsis desc-w">{{ detailInfo.desc }}</div>
          </div>
        </div>
        <a-button type="primary" >Continue Working</a-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";

const { getImageURL } = useAssets();
const theme = useThemeStore();
const props = defineProps({
  id: {
    type: String as any,
    default: () => '',
  },
});
const { id } = toRefs(props);
const detailInfo = { id: '1', logo: 'testLogo.png', name: '币圈索罗斯', title: '投资顾问', desc: '项目研报、Alpha资源、钱包监控、自动min挖掘…项目研报、Alpha资源、钱包监控、自动min挖掘…项目研报、Alpha资源、钱包监控、自动…' };
</script>
<style scoped lang="less">

.desc-w{
  // max-width: calc(100% - 550px);
  width: 300px;
}
.text-ellipsis {
  text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
  white-space: nowrap; //文本不自动换行
  overflow: hidden;
}
</style>