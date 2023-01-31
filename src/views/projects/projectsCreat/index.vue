<template>
  <div>
    <div class="mb-[32px]">
      <div class="text-[24px] font-bold">Let‘s create your project.</div>
      <div class="dark:text-[#E0DBD2] text-[#73706E]">Ready to start building? Get started with one of our Templates or
        use an existing repository.</div>
    </div>
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="grid grid-cols-2 gap-8">
        <a-form :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :model="formData" layout="vertical"
          ref="formRef" :rules="formRules">
          <a-form-item label="Project Name" name="name">
            <a-input v-model:value="formData.name" placeholder="Project Name" allow-clear autocomplete="off" />
            <div class="dark:text-[#E0DBD2] text-[#73706E] mt-[8px]">Great project names are short and memorable.</div>
          </a-form-item>
          <a-form-item class="new-label" label="Project Type" name="type">
            <a-radio-group v-model:value="formData.type" name="type" @change="getTemplatesShow">
              <a-radio :style="radioStyle" value="1">Contract
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Contract code.</div>
              </a-radio>
              <a-radio :style="radioStyle" value="5">FrontEnd
                <div>Set up a workflow to automatic build, check, and deploy your Front-End code.</div>
              </a-radio>
              <a-radio :style="radioStyle" value="3" disabled="true">Blockchain Node（coming soon）
                <div>Please pay attention to Hamster</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item class="new-label" label="Code Repositiory">
            <a-radio-group v-model:value="formData.contractCode" name="contractCode">
              <a-radio :style="radioStyle" value="1">Creat a new repository by template
                <div class="radio-sub">Implement core standards with our contract template for easily build your app.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="2" disabled="true">Blockchain Node（coming soon）
                <div>Please pay attention to Hamster</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Contract Programming Language " name="frameType">
            <a-radio-group v-model:value="formData.frameType" name="frameType">
              <a-radio value="1">Solidity</a-radio>
              <!-- <a-radio value="2">ink!</a-radio>
              <a-radio value="3">Move（coming soon）</a-radio>
              <a-radio value="4">vue.js</a-radio>
              <a-radio value="5">nuxt.js</a-radio>
              <a-radio value="6">next.js</a-radio>
              <a-radio value="7">vite</a-radio>
              <a-radio value="8">Angular</a-radio> -->
            </a-radio-group>
          </a-form-item>
          <a-button type="primary" :loading="loading" @click="goNext">Explore all template</a-button>
        </a-form>
        <div>
          <div class="font-bold text-[16px]">Popular Template</div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '1'">A collection of our most
            deployed contracts.</div>
          <div class="dark:text-[#E0DBD2] text-[#73706E] mb-[32px]" v-if="formData.type == '5'">A collection of our
            most deployed FrontEnd.</div>
          <div v-if="formData.type === '1'" class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in showList" :key="index" @click="goDetail(item.id)"
              class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px] py-[32px] px-[24px]">
              <img :src="item.logo" class="h-[40px] w-[40px]" />
              <div class="text-[16px] mt-4 font-bold text-ellipsis">{{ item.name }}</div>
              <div class="text-[#151210] dark:text-[#BBBAB9]">{{ item.description }}</div>
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
          <div v-if="formData.type === '5'" class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in showList" :key="index" @click="goDetail(item.id)"
              class="cursor-pointer bg-[#FFFFFF] dark:bg-[#36322D] border border-solid border-[#EBEBEB] dark:border-[#434343] hover:border-[#E2B578] dark:hover:border-[#E2B578] rounded-[12px]">
              <img :src="item.image" class="w-full rounded-t-[12px]" />
              <div class="border border-solid dark:border-[#434343] border-[#EBEBEB] border-b-0"></div>
              <div class="border-box dark:border-[#434343] border-[#EBEBEB] px-[24px] py-[16px]">
                <div class="text-[16px] font-bold mb-[12px] flex justify-between">
                  <div>
                    <img :src="item.logo" class="w-[24px]" />
                    <span class="align-middle ml-[4px]">{{ item.name }}</span>
                  </div>
                  <div class="text-[16px]">
                    <img src="@/assets/icons/version-white.svg" class="h-[20px] dark:hidden" />
                    <img src="@/assets/icons/version-dark.svg" class="h-[20px] hidden dark:inline-block" />
                    <span class="align-middle ml-[4px]">{{ item.lastVersion }}</span>
                  </div>
                </div>
                <div class="text-[14px] dark:text-[#E0DBD2] text-[#73706E]">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter, type RouteLocationRaw } from "vue-router";
import { apiDupProjectName } from "@/apis/projects";
import { apiTemplatesShow } from "@/apis/templates";
import { message } from 'ant-design-vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const router = useRouter();
const loading = ref(false);
const showList = ref([])
const formRef = ref();
const formData = reactive({
  name: '',
  type: '1',
  contractCode: '1',
  frameType: '1',
});
const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });

// Form rules
const formRules = computed(() => {
  const checkDupName = async () => {
    try {
      loading.value = true;
      //校验仓库名称是否存在
      const userInfo = localStorage.getItem('userInfo');
      const params = {
        owner: JSON.parse(userInfo)?.username,
        name: formData.name,
      }
      const res = await apiDupProjectName(params);
      if (res.data === false) {
        return Promise.reject("Project Name duplication");
      } else {
        return Promise.resolve()
      }
    } catch (error: any) {
      console.log("erro:", error)
      return Promise.reject("Project Name check failure");
    } finally {
      loading.value = false;
    }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Please enter Project Name'), { validator: checkDupName, trigger: "change" }],
  };
});
const goNext = async () => {
  setCreateProjectValue(`/projects/template/${formData.type}`)
}
const setCreateProjectValue = async (path: RouteLocationRaw) => {

  await formRef.value.validate();

  try {
    loading.value = true;
    const createProjectTemp = {
      name: formData.name,
      type: formData.type,
      frameType: formData.frameType,
    }
    window.localStorage.setItem("createProjectTemp", JSON.stringify(createProjectTemp));
    router.push(path);
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    loading.value = false;
  }
}
const goDetail = async (id: string) => {
  setCreateProjectValue("/projects/templates/" + id + "/details" + formData.type)
}

const getTemplatesShow = async (val: any) => {
  formData.type = val.target.value
  getInitTemplates()
}

const getInitTemplates = async () => {
  try {
    const { data } = await apiTemplatesShow(formData.type);
    showList.value = data;
    console.log(showList.value)
  } catch (error: any) {
    console.log("erro:", error)
  }
}

onMounted(() => {
  getInitTemplates();
})

</script>
<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.new-label .ant-form-item-label > label) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.new-label .ant-form-item-label) {
  padding-bottom: 16px;
}

:deep(.white-css .ant-form-item-label > label) {
  color: #151210;
}

:deep(.dark-css .ant-form-item-label > label) {
  color: white;
}

:deep(.dark-css .ant-input) {
  color: #E0DBD2;
}

:deep(.dark-css .ant-input-affix-wrapper) {
  border-color: #434343;
}

:deep(.white-css .ant-input-affix-wrapper) {
  border-color: #EBEBEB;
}

:deep(.white-css .radio-sub) {
  color: #73706E;
}

:deep(.dark-css .radio-sub) {
  color: #E0DBD2;
}

:deep(.ant-radio-wrapper-checked span .radio-sub) {
  color: #E2B578;
}

:deep(.ant-btn-primary) {
  height: 40px;
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*文字溢出的部分隐藏并用省略号代替*/
  white-space: nowrap;
  /*文本不自动换行*/
  overflow: hidden;
}
</style>