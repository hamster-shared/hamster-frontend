<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="mb-[32px] flex items-center">
      <div class="text-[24px] font-bold cursor-pointer flex items-center" @click="goBack">
        <img src="@/assets/icons/back-white.svg" class="h-[24px] dark:hidden mr-2" />
        <img src="@/assets/icons/back-dark.svg" class="h-[24px] hidden dark:inline-block mr-2" />
        back
      </div>
      <div class="ml-4">
        <img src="@/assets/icons/Line-white.svg" class="h-[16px] dark:hidden" />
        <img src="@/assets/icons/Line-dark.svg" class="h-[16px] hidden dark:inline-block" />
      </div>
      <div class="ml-4 text-[24px] font-bold">Select template</div>
    </div>

    <FrontendTemplate :templatesCategory="templatesCategory" :type="params.type" v-if="params.type === '2'">
    </FrontendTemplate>
    <div v-if="params.type === '1'">
      <div class="mt-4 bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px]">
        <div v-for="(items, index) in templatesCategory" :key="index">
          <div v-if="items.templatesList !== null" class="text-[24px] font-bold" :class="{ 'mt-[32px]': index != 0 }">{{ items.name }}</div>
          <div v-if="items.templatesList !== null" class="text-[#73706E] dark:text-[#E0DBD2] mb-[16px]">{{ items.description }}</div>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(item, index2) in items.templatesList" :key="index2"
              class="border-box dark:bg-[#36322D] dark:border-[#434343] border-[#EBEBEB] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] border border-solid p-4 cursor-pointer"
              @click="goDetail(item.id)">
              <div class="font-bold text-ellipsis">{{ item.name }}</div>
              <div class="text-[14px] mt-2 text-[#BBBAB9]">{{ item.description }}</div>
              <div class="flex mt-4">
                <div class="flex items-center">
                  <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                  <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                  {{ item.lastVersion }}
                </div>
                <div class="flex items-center ml-4" v-if="item.audited === true">
                  <img src="@/assets/icons/audi-white.svg" class="h-[20px] dark:hidden" />
                  <img src="@/assets/icons/audi-dark.svg" class="h-[20px] hidden dark:inline-block" />
                  Audited
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-else>
            <NoData />
          </div> -->
        </div>
      </div>

      <div class="mt-4 bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px]">
        <div class="text-[24px] font-bold mb-[16px]">
          Didn't find what you're looking for?<br />
          Choose standard contract to build your own!
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="(item, index) in templateBuild" :key="index" @click="goStandard(item.name)"
            class="border-box dark:bg-[#36322D] dark:border-[#434343] border-[#EBEBEB] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] border border-solid p-4 cursor-pointer">
            <div class="font-bold text-ellipsis">{{ item.name }}</div>
            <div class="text-[14px] mt-2 text-[#BBBAB9]">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import NoData from "@/components/NoData.vue";
import { apiTemplatesCategory, apiTemplatesCategoryById } from "@/apis/templates";
import { useThemeStore } from "@/stores/useTheme";
import FrontendTemplate from "./components/FrontendTemplate.vue";
const theme = useThemeStore()
const { params } = useRoute();

const router = useRouter();
const templatesCategory = ref([{
  id: "",
  name: "",
  description: "",
  templatesList: [],
}]);

const templateBuild = reactive([
  { name: "ERC20", description: "medium of exchange currency, voting rights, staking, and more.", },
  { name: "ERC721", description: "real estate, voting rights, or collectibles,", },
  { name: "ERC1155", description: "Create a fungibility-agnostic and gas-efficient token contract.", },
]);

onMounted(() => {
  getTemplatesCategory();
})

const getTemplatesCategory = async () => {
  try {
    const { data } = await apiTemplatesCategory(params.type);
    templatesCategory.value = data;
    templatesCategory.value.forEach(async (element, index) => {
      const { data } = await apiTemplatesCategoryById(element.id);

      templatesCategory.value[index]['templatesList'] = data;
    });
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};
const goDetail = (id: string) => {
  router.push("/projects/templates/" + id + "/details/" + params.type);
}

const goStandard = (name: string) => {
  router.push("/projects/templates/" + name + "/standard");
}
const goBack = () => {
  router.back();
}
</script>
<style lang='less' scoped>
.white-css .border-box {
  /* 投影 */
  box-shadow: 6px 6px 15px rgba(242, 238, 234, 0.1);
}

.white-css .border-box-checked {
  border-color: #E2B578;
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*文字溢出的部分隐藏并用省略号代替*/
  white-space: nowrap;
  /*文本不自动换行*/
  overflow: hidden;
}
</style>