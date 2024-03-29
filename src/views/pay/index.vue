<template>
  <div class="text-[24px] font-bold mb-[24px]">Payment</div>
  <Header :orderInfo="orderInfo" :payMethod="1" />
  <div class="bg-[#FFFFFF] dark:bg-[#1D1C1A] mt-[25px] rounded-[12px] p-[32px]">
    <div v-if="status === 1">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-[24px] font-bold">Send USDT on the Ethereum network</div>
          <div class="text-[#73706E] dark:text-[#E0DBD2]">Open your crypto wallet, scan the QR code or copy the USDT
            address below to pay</div>
        </div>
        <div class="text-[32px] font-bold flex items-center">
          <svg-icon name="pay-time" size="24" class="mr-2 mt-[5px]" />
          {{ time }}
        </div>
      </div>
      <div class="flex justify-center py-[50px]">
        <!-- <img src="@/assets/images/pay-code.png" class="w-[200px]" /> -->
        <div class="bg-[#FFFFFF] p-[12px] border border-dashed dark:border-none">
          <qrcode-vue v-if="qrcodeUrl" :value="qrcodeUrl" :size="200" />
        </div>
      </div>
      <div class="card-div dark:bg-[#36322D] p-[32px] rounded-[12px]">
        <div class="font-bold mb-[10px]">USDT address</div>
        <div>{{ orderInfo.receiveAddress }}
          <svg-icon name="copy" size="18" class="ml-4" @click="copyToClipboard(orderInfo.receiveAddress)" />
        </div>
      </div>
      <div class="card-div dark:bg-[#36322D] p-[32px] rounded-[12px] mt-[25px]">
        <div class="font-bold mb-[10px]">Total amount</div>
        <div>{{ orderInfo.amount }} USDT
          <svg-icon name="copy" size="18" class="ml-4" @click="copyToClipboard(`${orderInfo.amount} USDT`)" />
        </div>
      </div>
      <div class="tips-info">
        <svg-icon name="tips" size="26" class="mr-2" />
        Send USDT only from the Ethereum network to this address. Do not send USDT from other networks, otherwise it may
        lead to loss of funds.
      </div>
      <div class="text-center mt-[32px]">
        <a-button type="primary" ghost class=" w-[120px]" @click="cancelOrder">Cancel</a-button>
      </div>
    </div>
    <div v-else-if="status === 2" class="text-center my-[40px]">
      <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
      <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
      <div class="text-[28px] font-bold">payment Successful</div>
      <div class="text-[40px] font-bold text-[#E2B578] mt-[20px]">{{ orderInfo.amount }} USDT</div>
      <div class="text-[21px] text-[#73706E] dark:text-[#E0DBD2]">= ${{ orderInfo.amount }}</div>
      <div class="text-[21px] mt-[50px] text-[#73706E] dark:text-[#E0DBD2]">
        Page redirecting automatically. If failed, please <label class="text-[#E2B578] cursor-pointer font-bold"
          @click="goBack">click here</label>
      </div>
    </div>
    <div v-else-if="status === 3">
      <div class="text-center">
        <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
        <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
      </div>
      <div class="text-[28px] font-bold text-center mt-[30px] mb-[20px]">NO payment</div>
      <div class="flex justify-center">
        <div class="text-[#73706E] dark:text-[#E0DBD2] text-[21px] w-[930px] text-center">
          We continuously monitor the network, but have not detected any payment. If you have paid, please contact the
          merchant through <label class="text-[#E2B578]">hamster@hamsternet.io</label>
        </div>
      </div>
      <div class="card-div dark:bg-[#36322D] p-[32px] rounded-[12px] mt-[30px]">
        <div class="font-bold mb-[10px]">Your order ID</div>
        <div>{{ orderInfo.orderId }}
          <svg-icon name="copy" size="18" class="ml-4" @click="copyToClipboard(orderInfo.orderId)" />
        </div>
      </div>
      <div class="text-center mt-[32px]">
        <a-button type="primary" ghost class=" w-[120px]" @click="cancelOrder">Cancel</a-button>
      </div>
    </div>
    <div v-else-if="status === 4" class="text-center">
      <img src="@/assets/images/Failed.png" class="w-[173px] " />
      <div class="text-[28px] font-bold mt-[30px] mb-[20px]">Payment Failed</div>
      <div class="text-[#73706E] dark:text-[#E0DBD2] text-[21px] ">
        The user canceled the payment
      </div>
      <a-button type="primary" ghost class="mt-[32px] mb-[100px] w-[120px]" @click="closePage">Close</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from "vue-router";
import Header from './components/header.vue'
import { copyToClipboard } from '@/utils/tool'
import QrcodeVue from "qrcode.vue"
import web3 from 'web3';
import { apiOrderDetail, apiCloseOrder } from '@/apis/chainlink'
import io from "socket.io-client";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs'

const status = ref(1);
const qrcodeUrl = ref('')
const orderInfo = ref<any>({})
const time = ref('')
const timeId = ref()
const route = useRoute()
const id: any = route.query.id

const socket = io('/page');
socket.on("connect", () => {
  console.log('connect success');
});
socket.on("connect_error", (err: any) => {
  console.log('pay connect failed ', err);
});
socket.on('order_result', (data: any) => {
  console.log(data);
  // data 2成功 3失败
  if (data == 2) {
    // 支付成功
    status.value = 2
    setTimeout(() => {
      window.close()
    }, 5000);
  } else if (data == 3) {
    // 支付失败
    status.value = 4
  }
});

const goBack = () => {
  window.close()
}

// 获取订单信息
const getOrderDetailInfo = async () => {
  const res = await apiOrderDetail(id)
  orderInfo.value = res.data
  socket.emit('order_status_page', res.data.id)
  console.log('获取订单信息', res.data)
}
// 取消订单
const cancelOrder = async () => {
  try {
    await apiCloseOrder(id)
    status.value = 4
    // window.close()
  } catch (err: any) {
    console.log('取消订单', err)
    message.error(err.response.data.message)
  }
}
// 关闭当前页
const closePage = () => {
  window.close()
}
// 生产二维码
const createQRcode = () => {
  const money = web3.utils.toWei(orderInfo.value.amount, 'mwei');
  qrcodeUrl.value = `ethereum:0xC77bBf637d91C114F70f167a9a391A0486270854@80001/transfer?address=${orderInfo.value.receiveAddress}&uint256=${money}`
}
// 倒计时
const countTime = () => {
  const reduceTime = dayjs().unix() - dayjs(orderInfo.value.orderTime.Time).unix()
  let duration = 3600 - reduceTime
  timeId.value = setInterval(() => {
    --duration
    time.value = formatTimeCallback(duration)
    if (duration < 1) {
      clearInterval(timeId.value)
      status.value = 3
    }
  }, 1000);
}
const formatTimeCallback = (timestamp: number): string => {
  const minutes = Math.floor(timestamp / 60);
  const seconds = timestamp % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
onMounted(async () => {
  await getOrderDetailInfo()
  createQRcode()
  countTime()
})
onUnmounted(() => {
  clearInterval(timeId.value)
  socket.close()
})
</script>
<style lang="less" scoped>
html[data-theme='light'] {
  .card-div {
    box-shadow: 0px 0px 10px 0px rgba(191, 191, 191, 0.2);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
}

.tips-info {
  background: rgba(226, 181, 120, 0.1);
  border-radius: 12px;
  border: 1px solid #E2B578;
  padding: 10px 32px;
  margin-top: 25px;
}

.svg-icon {
  color: #E2B578;
}</style>