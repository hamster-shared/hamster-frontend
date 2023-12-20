<template>
  <div>
    <div class="text-[24px] font-bold mb-[24px]">Payment</div>
    <Header :orderInfo="orderInfo" :payMethod="2" />
    <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] mt-[25px] rounded-[12px] p-[32px]">
      <div v-if="!paymentFailed">
        <div class="text-[24px] font-bold">Send RMB using third-party payment platform</div>
        <div class="text-[#73706E] dark:text-[#E0DBD2] text-[16px]">Scan the QR code to pay</div>
        <div class="text-center my-[50px]">
          <img src="@/assets/images/RMB-QR-Code.png" class="w-[218px]" />
        </div>
        <div class="text-center">
          <a-button type="primary" ghost class="mr-[20px] w-[240px] h-[43px]"
            @click="paymentFailed = true">Cancel</a-button>
          <a-button class="w-[240px]" type="primary" @click="paymentFinished">Payment Finished</a-button>
        </div>
      </div>
      <div v-else class="text-center">
        <img src="@/assets/images/PaymentFailed.png" class="w-[173px]" />
        <div class="text-[28px] font-bold mt-[20px] mb-[10px]">Payment Failed</div>
        <div class="text-[21px] text-[#8D8D8D] mb-[32px]">The user canceled the payment</div>
        <a-button type="primary" ghost class="mr-[20px] w-[240px] h-[43px]" @click="backClick">Back</a-button>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted } from 'vue';
import Header from './components/header.vue';
import { apiOrderDetail } from '@/apis/chainlink';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id: any = route.query.id
const orderInfo = ref({});
const paymentFailed = ref(false)

const getOrderDetailInfo = async () => {
  const res = await apiOrderDetail(id)
  orderInfo.value = res.data
  console.log('获取订单信息', res.data)
}

const paymentFinished = () => {
  router.push('middleware/dashboard/node')
}


// 关闭当前页
const backClick = () => {
  console.log('kk')
  router.back()
}

onMounted(() => {
  getOrderDetailInfo();
})

</script>
<style lang='less' scoped>
:deep(.ant-btn) {
  height: 43px !important;
}
</style>