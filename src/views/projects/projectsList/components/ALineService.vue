<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="bg-[#FFFFFF] dark:bg-[#1D1C1A] rounded-[12px] p-[32px] mt-4">
    <div class="text-[30px] font-bold">ALine Service</div>
    <div class="my-[20px] text-[#73706E] dark:text-[#E0DBD2] font-light">Hamster automates your Web3.0 project workflows
      seamlessly. Check, build, and deploy your code directly through code repository. Ready to start Aline Service? Get
      started with use an existing repository.</div>
    <a-button type="primary" @click="goCreateProject">Add New Project</a-button>
    <div class="text-[24px] font-bold mt-[50px] mb-[32px]">Haven't built the project yet?<br />Get started with one of our
      Templates !</div>
    <div class="flex">
      <div class="card-bg" @click="goTemplates('1')">
        <img class="img" src="@/assets/images/ContractTemplates.png" />
        <div class="title">Contract Templates</div>
        <div class="desc" id="desc-h">Explore a world of possibilities with our support for all the leading ecosystems -
          EVM, Aptos, StarkWare, Sui, Internet Computer, and more.</div>
        <div class="link">Get templates now</div>
      </div>
      <div class="card-bg" @click="goTemplates('2')">
        <img class="img" src="@/assets/images/FrontEndTemplates.png" />
        <div class="title">FrontEnd Templates</div>
        <div class="desc">We now support mainstream front-end frameworks like Vue.js and React.js. </div>
        <div class="link">Get templates now</div>
      </div>
      <div class="card-bg" @click="goTemplates('3')">
        <img class="img" src="@/assets/images/NodeTemplates.png" />
        <div class="title">Node Templates</div>
        <div class="desc">Currently only Boka node project is supported for now.</div>
        <div class="link">Get templates now</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useThemeStore } from "@/stores/useTheme";
import router from "@/router";
const theme = useThemeStore()

const emits = defineEmits(['goCreateProject'])
const goCreateProject = () => {
  emits('goCreateProject');
}
const createFormData = ref({
  type: '1',
})

const goTemplates = (val: string) => {
  createFormData.value.type = val;
  // localStorage.setItem('createFormData', JSON.stringify(createFormData))
  // router.push('/projects/create')
}

onMounted(() => {
  let desc_css: any = document.getElementsByClassName('desc');
  for (let i = 0; i < desc_css.length; i++) {
    desc_css[i].style.minHeight = (document.getElementById('desc-h') as HTMLElement).clientHeight + 'px';
  }
})
</script>
<style scoped lang="less">
.card-bg {
  background: #FFFFFF;
  box-shadow: 0px 0px 10px 0px rgba(191, 191, 191, 0.2);
  border-radius: 12px;
  border: 1px solid #EBEBEB;
  padding: 20px;
  text-align: center;
  margin-right: 50px;
  width: 352px;
  cursor: pointer;

  .img {
    height: 45px;
    width: 45px;
    margin: 10px 0px;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 23px;
  }

  .desc {
    text-align: left;
    background: rgba(226, 181, 120, 0.1);
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 300;
    color: #73706E;
    min-height: 90px;
  }

  .link {
    margin-top: 20px;
    font-size: 18px;
    color: #E2B578;
  }
}

.dark-css {
  .card-bg {
    background: #36322D;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    border-color: #434343;
  }

  .desc {
    color: #E0DBD2;
  }
}
</style>
