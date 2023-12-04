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
      <div
        class="bg-[#EBEBEC] dark:bg-[#161616] rounded-[12px] m-[20px] mb-0 p-[20px] max-h-[635px] overflow-y-auto text-[14px] font-light"
        v-html="detailInfo.content.replace(/\n/g, '<br>')"></div>
    </div>
  </div>
  <AgentRoleModal :modalVisible="modalVisible" @hiddenModal="modalVisible = false"></AgentRoleModal>
</template>
<script setup lang="ts">
import { ref, toRefs } from "vue";
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import { useRouter } from "vue-router";
import AgentRoleModal from "./components/AgentRoleModal.vue";

const router = useRouter();
const { getImageURL } = useAssets();
const theme = useThemeStore();
const props = defineProps({
  id: {
    type: String as any,
    default: () => '',
  },
});
const modalVisible = ref(false);
const { id } = toRefs(props);
const detailInfo = {
  id: '1', logo: 'NFT-Expert.png', name: '币圈索罗斯', title: '投资顾问', desc: '项目研报、Alpha资源、钱包监控、自动min挖掘…项目研报、Alpha资源、钱包监控、自动min挖掘…项目研报、Alpha资源、钱包监控、自动…',
  content: "Are you looking for a trusted Investment Advisor who can help you make informed decisions and optimize your investment portfolio?<br><br>I am an experienced Investment Consultant dedicated to providing personalized investment advice and strategies tailored to your unique financial goals and risk tolerance. With a deep understanding of the financial markets and a passion for helping clients achieve their investment objectives, I offer comprehensive services to support your investment journey.<br><br>Here's how I can assist you:<br><br>🔍 Risk Assessment: By assessing your risk profile, analyzing your financial information, investment goals, and risk tolerance, I can provide you with a detailed risk assessment report. This report will include recommended investment strategies that align with your risk appetite.<br><br>📊 Portfolio Analysis: I will carefully analyze your investment portfolio, evaluating its performance and identifying areas for improvement. With access to historical performance data and an understanding of your investment objectives, I will provide you with an analysis report. This report will include recommendations for portfolio optimization, ensuring your investments are aligned with your goals.<br><br>🔬 Investment Research: I conduct thorough research on investment opportunities, taking into consideration your investment criteria, market analysis, and client preferences. Based on this research, I provide a comprehensive research report. This report will include recommended investment options that have the potential to generate favorable returns.<br><br>📞 Client Communication: Effective communication is essential in the investment advisory process. I will regularly communicate with you to understand your investment needs and provide updates. Whether it's addressing client inquiries, sharing market updates, or providing investment performance reports, I ensure clear and informative communication that addresses your questions and concerns.<br><br>By working with me, you can benefit from:<br>✅ Expertise in assessing risk profiles and creating customized investment strategies<br>✅ In-depth portfolio analysis to enhance performance and mitigate risks<br>✅ Thorough investment research to identify promising opportunities<br>✅ Transparent and proactive client communication to keep you informed<br><br>If you are ready to take your investment journey to the next level, I am here to help. Let's discuss your investment goals and explore how I can assist you in achieving financial success. Contact me today!yoooo"
};

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