<template>
  <div class="tabs-card grid grid-cols-3 gap-[20px]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div v-for="(item,key) in tabsList" :key="key" class="tabs-card-div" @click="goDetail(item.id)">
      <img :src="getImageURL(`${item.logo}`)" class="h-[100px] w-[100px] rounded-full mb-[20px]"/>
      <div class="title">{{ item.title }}</div>
      <div class="name">{{ item.name }}</div>
      <div class="desc">{{ item.desc }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import useAssets from "@/stores/useAssets";
import { useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";

const { getImageURL } = useAssets();
const theme = useThemeStore();

const router = useRouter()
const props = defineProps({
  tabsList: {
    type: Array as any,
    default: () => [],
  },
});
const { tabsList } = toRefs(props);

const goDetail = (id: any) => {
  router.push('/aiAgent/marketplace/detail?id='+id)
}
</script>
<style scoped lang="less">
.tabs-card{
  background: #F5F6F8;
  border-radius: 12px;
  height: 500px;
  overflow-y: auto;
  padding: 20px;
}
.tabs-card-div:hover{
  border: 1px solid #E2B578;
}
.tabs-card-div{
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  border: 1px solid transparent;
  .title{
    font-size: 21px;
    font-weight: 600;
    text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
    white-space: nowrap; //文本不自动换行
    overflow: hidden;
  }
  .name{
    font-size: 16px;
    font-weight: 500;
    color: #656D7A;
    margin-bottom: 10px;
  }
  .desc{
    font-size: 16px;
    font-weight: 300;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4; //超出2行显示省略号
  }
}
.dark-css{
  .tabs-card-div{
    background: #000000;
  }
  .tabs-card{
    background: #0E0E0E;
  }
}
</style>