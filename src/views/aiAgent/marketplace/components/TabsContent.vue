<template>
  <NoData v-if="list.length == 0" heightValue="height: 500px;"></NoData>
  <div v-else class="tabs-card grid grid-cols-3 gap-[20px]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    
    <div v-for="(item, key) in list" :key="key" class="tabs-card-div h-[350px]">
      <div @click="goDetail(item.id)">
        <img :src="getImageURL(`${item.logo}`)" class="h-[100px] w-[100px] rounded-full mb-[20px]" />
        <div class="title">{{ item.title }}</div>
        <div class="name">{{ item.name }}</div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import useAssets from "@/stores/useAssets";
import { useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import NoData from "../../home/NoData.vue";

const { getImageURL } = useAssets();
const theme = useThemeStore();

const router = useRouter()
const props = defineProps({
  tabsList: {
    type: Array as any,
    default: () => [],
  },
  tabsType: {
    type: String as any,
    default: () => '',
  }
});
const { tabsList, tabsType } = toRefs(props);
const list = ref<any>([]);

const goDetail = (id: any) => {
  router.push('/aiAgent/marketplace/detail?id=' + id)
}

watch(
  () => props.tabsList,
  (value) => {
    list.value.length = 0;
    value.forEach((item: any) => {
      if (tabsType.value == 'all') {
        list.value = value;
      } else if(tabsType.value == item.type){
        list.value.push(item);
      }
    });
  }, { deep: false, immediate: true }
);
</script>
<style scoped lang="less">
.tabs-card {
  background: #F5F6F8;
  border-radius: 12px;
  height: 500px;
  overflow-y: auto;
  padding: 20px;
}

.tabs-card-div:hover {
  border: 1px solid #E2B578;
}

.tabs-card-div {
  background: #FFFFFF;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  border: 1px solid transparent;
  cursor: pointer;

  .title {
    font-size: 21px;
    font-weight: 600;
    text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
    white-space: nowrap; //文本不自动换行
    overflow: hidden;
  }

  .name {
    font-size: 16px;
    font-weight: 500;
    color: #656D7A;
    margin-bottom: 10px;
  }

  .desc {
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

.dark-css {
  .tabs-card-div {
    background: #000000;
  }

  .tabs-card {
    background: #0E0E0E;
  }
}
</style>