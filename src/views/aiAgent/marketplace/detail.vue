<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <div class="font-bold text-[24px] mb-[30px]">Marketplace</div>
    <div class="bg-[#F5F6F8] dark:bg-[#0E0E0E] rounded-[12px] pb-[20px]">
      <div
        class="bg-[#EBEBEC] dark:bg-[#161616] rounded-tl-[12px] rounded-tr-[12px] p-[30px] flex justify-between items-center">
        <div class="flex justify-center">
          <img :src="getImageURL(`${detailInfo.logo}`)" class="h-[100px] w-[100px] rounded-full mr-[20px]" />
          <div class="font-semibold text-[#656D7A]">
            <div><label class="text-[21px] text-[#000000] dark:text-[#FFFFFF] mr-[10px]">{{ detailInfo.title
            }}</label><label class="text-[16px]">{{ detailInfo.name }}</label></div>
            <div class="text-[14px] mt-[7px] text-ellipsis desc-w">{{ detailInfo.desc }}</div>
          </div>
        </div>
        <div>
          <a-button class="mr-[20px]" type="primary" @click="hireAgent">Hire agent and start working</a-button>
          <a-button type="primary" @click="cloneAgent">Clone Agent</a-button>
          <a-button v-if="false" type="primary" @click="continueWork">Continue Working</a-button>
        </div>
      </div>
      <div v-if="detailInfo.content"
        class="bg-[#EBEBEC] dark:bg-[#161616] rounded-[12px] m-[20px] mb-0 p-[20px] max-h-[635px] overflow-y-auto text-[14px] font-light"
        v-html="detailInfo.content.replace(/\n/g, '<br>')"></div>
    </div>
  </div>
  <AgentRoleModal :modalVisible="modalVisible" @hiddenModal="modalVisible = false"></AgentRoleModal>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue";
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import { useRouter, useRoute } from "vue-router";
import AgentRoleModal from "./components/AgentRoleModal.vue";
import { agentList } from '../home/agentData';

const router = useRouter();
const route = useRoute()
const { getImageURL } = useAssets();
const theme = useThemeStore();
const modalVisible = ref(false);
const id = route.query.id || '';
const detailInfo = ref<any>({});

const continueWork = () => {
  router.push('/aiAgent/work')
  // modalVisible.value = true;
}
const cloneAgent = () => {
  modalVisible.value = true;
}
const hireAgent = () => {
  router.push('/aiAgent/work')
  // console.log("hireAgent....");
}
onMounted(() => {
  agentList.map((item: any) => {
    if (item.id == id) {
      detailInfo.value = item;
    }
  });
})
</script>
<style scoped lang="less">
.desc-w {
  // max-width: calc(100% - 550px);
  width: 300px;
}

.text-ellipsis {
  text-overflow: ellipsis; //文字溢出的部分隐藏并用省略号代替
  white-space: nowrap; //文本不自动换行
  overflow: hidden;
}
</style>