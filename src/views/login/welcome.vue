<template>
  <div class=" bg-[#0E0E12]  w-screen h-screen">
    <div class="w-full h-full welcome-bg">
      <div class="h-[60px] pl-[32px] py-[16px]">
        <img src="@/assets/icons/welcome-top.svg" class="h-[28px]" />
      </div>
      <div class="content-bg">
        <div>Thank you for using Hamster！</div>
        <div class="whitespace-pre-wrap">{{ showText }}</div>
      </div>
      <div class="welcome-fd">
        <img class="w-[200px] h-[200px]" src="@/assets/icons/welcome-fd.svg" />
      </div>
      <div class="welcome-xq"></div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';

const content = ref("Thank you for using Hamster！\nLet‘s begin the adventure ... \n\nWe have launched 2 services:\n1. Developer Toolkit\n2. Node Service\n\nType the number of service for select\n\nLet‘s begin the adventure ...");
const showText = ref("");
const timer = ref();
const speed = ref(60);
const count = ref(1);

onMounted(() => {
  changeContent();
})

const changeContent = () => {
  showText.value = content.value.substring(0, count.value); //截取字符串
  count.value++;
  if (count.value != content.value.length + 1) {
    // speed.value -= 1;
    if (speed.value < 5) speed.value = 5;

    timer.value = setTimeout(() => {
      changeContent();
    }, speed.value)
  } else {
    clearTimeout(timer.value);
  }
}
</script>
<style lang='less' scoped>
.content-bg{
  width: 800px;
  height: 440px;
  background: url(../../assets/icons/welcom-contentbg.svg) 100% 100% no-repeat;
  background-size: cover;
  position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
  z-index: 99;
  padding: 60px;
  color: #FFFFFF;
  font-size: 16px;
}
.welcome-fd{
  position: absolute;
  z-index: 99;
  right: 16%;
  top: 20%;
  -webkit-animation: bounce 6s infinite;
  animation: bounce 6s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0%);
    animation-timing-function: ease;
  }
  50% {
    transform: translateY(20%);
    animation-timing-function: ease;
  }
}
.welcome-bg{
  width: 100%;
  height: 100%;
  z-index: 9;
  position: relative;
  overflow: hidden;
}
.welcome-bg::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  z-index: -1;
  background: url(../../assets/icons/welcome-bg.svg) 100% 100% no-repeat;
  background-size: cover;
  -webkit-animation: rotate 50s linear infinite;
  -moz-animation: rotate 50s linear infinite;
  -o-animation: rotate 50s linear infinite;
  animation: rotate 50s linear infinite;
}

@keyframes rotate{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(90deg);}
  50%{-webkit-transform:rotate(180deg);}
  75%{-webkit-transform:rotate(270deg);}
  100%{-webkit-transform:rotate(360deg);}
}

.welcome-xq{
  width: 600px;
  height: 600px;
  z-index: 9;
  position: absolute;
  overflow: hidden;
  bottom: 0px;
}
.welcome-xq::before {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  top: 20%;
  left: -20%;
  z-index: -1;
  background: url(../../assets/icons/welcome-xq.svg) 100% 100% no-repeat;
  background-size: cover;
  -webkit-animation: rotate 50s linear infinite;
  -moz-animation: rotate 50s linear infinite;
  -o-animation: rotate 50s linear infinite;
  animation: rotate 50s linear infinite;
}
</style>