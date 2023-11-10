<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="text-[24px] font-bold">Add New Project</div>
    <div class="text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Ready to start Aline Service? Get started with use an
      existing repository.
    </div>
    <div class="grid grid-cols-2 gap-8 mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div>
        <a-form :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" :model="formData" layout="vertical">
          <a-form-item class="new-label" label="Project Type" name="type">
            <a-radio-group v-model:value="formData.type" name="type" @change="getTemplatesShow">
              <a-radio :style="radioStyle" value="1">Contract
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Contract code.</div>
              </a-radio>
              <a-radio :style="radioStyle" value="2">FrontEnd
                <div class="radio-sub">Set up a workflow to automatic build, check, and deploy your Front-End code.
                </div>
              </a-radio>
              <a-radio :style="radioStyle" value="3">Blockchain Node (Polkadot Only)
                <div class="radio-sub">Set up a workflow to automatic build and deploy your Node code</div>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div>
        <ImportGitRepository :projectType="formData.type"></ImportGitRepository>
      </div>

    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from "vue";
import { useThemeStore } from "@/stores/useTheme";
import ImportInstall from "@/views/projects/projectsCreat/components/ImportInstall.vue";
import ImportGitRepository from "@/views/projects/projectsCreat/components/ImportGitRepository.vue"
const formData = reactive(JSON.parse(localStorage.getItem('createFormData'))) || reactive({
  name: '',
  type: '1',
  contractCode: '1',
  frameType: '1',
  deployType: '1',
});
const theme = useThemeStore();

const radioStyle = reactive({ display: 'flex', marginBottom: '5px' });

const getTemplatesShow = () => {

}
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
  margin-bottom: 20px;
}

:deep(.dark-css .radio-sub) {
  color: #E0DBD2;
  margin-bottom: 20px;
}

:deep(.ant-radio-wrapper-checked span .radio-sub) {
  color: #E2B578;

}
</style>
