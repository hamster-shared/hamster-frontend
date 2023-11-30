<template>
  <div class="mt-4 bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px]">
    <div v-if="templatesCategory !== null">
      <div v-for="item in templatesCategory" :key="item.id">
        <div class="text-[24px] mb-[8px]">
          <!-- <img src="@/assets/icons/hot.svg" class="h-[32px]" /> -->
          <span v-if="item.id == 5">
            <div class="align-middle ml-[4px] font-bold">Popular</div>
            <div class="text-[14px] text-[#73706E] dark:text-[#E0DBD2]">Acollection of our most Popular framworks without
              additional
              configuration.</div>
          </span>
          <span v-else class="align-middle ml-[4px] font-bold">{{ item.name }}</span>
        </div>
        <div class=" mb-[24px]">{{ item.description }}
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="val in item.templatesList" :key="val.id" @click="toDetail(val)"
            class="dark:bg-[#36322D] dark:border-[#434343] border-[#EBEBEB] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] border border-solid cursor-pointer">
            <img :src="val.image" class="w-full rounded-t-[12px]" />
            <div class="border-box dark:border-[#434343] border-[#EBEBEB]">
              <div class="flex justify-between">
                <div class="text-[16px] font-bold mb-[12px]">
                  <img :src="val.logo" class="w-[24px]" />
                  <span class="align-middle ml-[4px]">{{ val.name }}</span>
                </div>
                <div v-if="false" class="dfx-css">dfx</div>
              </div>
              <div class="text-[14px] dark:text-[#E0DBD2] text-[#BBBAB9]">{{ val.description }}</div>
              <div class="text-[16px] mt-[24px]">
                <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                <span class="align-middle ml-[4px]">{{ val.lastVersion }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <NoData></NoData>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, toRefs } from "vue";
import NoData from "@/components/NoData.vue"
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  templatesCategory: {
    type: Array,
  },
  type: String,
});

const { templatesCategory } = toRefs(props);
const createFormData: any = JSON.parse(localStorage.getItem('createFormData')) || {};
const deployType = createFormData.deployType;

const toDetail = (val: any) => {
  localStorage.setItem('frontendTemplateDetail', JSON.stringify(val));
  router.push("/projects/templates/" + val.id + "/details/" + props.type);
}

</script>
<style lang='less' scoped>
.border-box {
  // border-top: 1px solid #EBEBEB;
  border-top-width: 1px;
  border-top-style: solid;
  padding: 24px 32px;
}
</style>