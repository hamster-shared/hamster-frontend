<template>
  <a-modal v-model:visible="visible" :footer="null" @cancel="cancelModal" width="760px">
    <template #closeIcon>
      <img class="mt-[22px]" src="@/assets/icons/closeIcon.svg" />
    </template>
    <div class="text-[#151210] text-[24px] font-bold mb-[32px]">Connect wallet to continue</div>
    <div class="grid grid-cols-3 gap-16">
      <div class="chainListItem text-[#000000] text-center cursor-pointer mx-[8px]" v-for="item in chainList"
        :key="item" @click="selectConnectWallet(item)">
        <img :src="getImageURL(`${item}.png`)" />
      </div>
    </div>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import useAssets from "@/stores/useAssets";

const { getImageURL } = useAssets()
const router = useRouter()
const props = defineProps<{
  visible: Boolean;
}>();
const { visible } = toRefs(props);

const chainList = ref(["metamask", "connect", "imToken", "math", "trust", "huobi"])

const emits = defineEmits(['cancelModal'])

const cancelModal = () => {
  emits("cancelModal", false);
}

const selectConnectWallet = (val: string) => {
  console.log('暂不支持选择', val)
  // 根据选择链接
} 
</script>
<style lang='less' scoped>
.chainListItem {
  border: 1px solid #EBEBEB;
  border-radius: 16px;
  padding: 36px;

  &:hover {
    border-color: #E2B578;
  }
}
</style>