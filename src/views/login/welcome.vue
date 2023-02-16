<template>
  <div class=" bg-[#0E0E12]  w-screen h-screen">
    <div class="w-full h-full welcome-bg">
      <div class="h-[60px] pl-[32px] py-[16px]">
        <img src="@/assets/icons/welcome-top.svg" class="h-[28px]" />
      </div>
      <div class="content-div">
        <div class="content-bg" :class="[isJump === true ? 'content-bg-hidden' : 'content-bg-show', {'hidden' : isShowGX === true}]">
          <div class="whitespace-pre-wrap">{{ showText }}</div>
        </div>
      </div>
      <div class="welcome-gx-div w-full h-full flex justify-center items-center">
        <img class="w-[200px] h-[200px]" :class="[isShowGX === true ? 'welcome-gx' : 'hidden']" src="@/assets/icons/welcome-gx.svg" />
      </div>
      <div class="welcome-fd" :class="[isShowGX === true ? 'welcome-fd-hidden' : 'welcome-fd-show']">
        <img class="w-[200px] h-[200px]" src="@/assets/icons/welcome-fd.svg" />
      </div>
      <div class="absolute -right-[30px]">
        <img class="h-[60px]" src="@/assets/icons/welcome-fd2.svg" />
      </div>
      <div class="welcome-xq" :class="[isShowGX === true ? 'welcome-xq-hidden' : 'welcome-xq-show']"></div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { apiUpdateFristState, apiGetUser } from "@/apis/login";
import { useRouter } from "vue-router";
const router = useRouter()

const contentList = ref<String[]>([]);
const content = ref("Thank you for using Hamster！\nLet‘s begin the adventure ... \n\nWe have launched 2 services:\n1. Developer Toolkit\n2. Node Service\n\nType the number of service for select\n\nLet‘s begin the adventure ...");
const showText = ref("");
const timer = ref();
const speed = ref(40);
const count = ref(1);
const isEnd = ref(false);
const isJump = ref(false);
const isShowGX = ref(false);
const keyValue = ref("");

onMounted(() => {
  updateFristState();
  setTimeout(() => {
    changeContent();
  }, 2000);
  document.addEventListener("keyup", handleKeyUp)
})

onUnmounted(() => {
  document.removeEventListener("keyup", handleKeyUp)
})

const handleKeyUp = (ele: any) => {
  keyValue.value = ele.key;
  if (isEnd.value === true && (keyValue.value === "1" || keyValue.value === "2")) {
    contentList.value = content.value.split("\n"); //拆分
    count.value = contentList.value.length - 1;
    changeContentLine();
  }
}
const changeContentLine = () => {
  showText.value = "";
  if (count.value > 0) {
    contentList.value.length = count.value;
    contentList.value.forEach(element => {
      showText.value += element + "\n";
    });
    timer.value = setTimeout(() => {
      changeContentLine();
    }, 100)
    count.value--;
  } else {
    clearTimeout(timer.value);
    isJump.value = true;

    setTimeout(() => {
      isShowGX.value = true;
    }, 1000);

    setTimeout(() => {
      if (keyValue.value === "1") { //project页面 
        router.push('/projects')
      } else if (keyValue.value === "2"){ //nodeServer页面
        router.push('/node-service/RPCs')
      }
    }, 3000);
  }
}

const updateFristState = async () => {
  
  try {
    await apiUpdateFristState();
    window.localStorage.setItem('firstShowProjects', "1");
    window.localStorage.setItem('firstShowNodeService', "1");
  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    getUser();
  }
}

const getUser = async () => {
  
  try {
    const { data } = await apiGetUser();
    
    localStorage.setItem('firstState', data.firstState);
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error: any) {
    console.log("erro:",error)
  } 
}

const changeContent = () => {
  showText.value = content.value.substring(0, count.value); //截取字符串
  count.value++;
  if (count.value != content.value.length + 1) {
    // speed.value -= 1; 速度越来越快
    // if (speed.value < 5) speed.value = 5;

    timer.value = setTimeout(() => {
      changeContent();
    }, speed.value)
  } else {
    clearTimeout(timer.value);
    isEnd.value = true;
  }
}
</script>
<style lang='less' scoped>
.content-div{
  width: 655px;
  height: 360px;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
  z-index: 99;
  position: relative;
  overflow: hidden; 
}
.content-bg{
  width: 100%;
  height: 100%;
  background: url(../../assets/icons/welcom-contentbg.svg);
  background-size: cover;
  padding: 50px;
  color: #FFFFFF;
  font-size: 16px; 
}
.welcome-gx-div{
  
  width: 100%;
  height: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
  z-index: 999;
  position: absolute;
  overflow: hidden; 
}
.welcome-gx{
  -webkit-animation: scaleGX 2s 1;
  animation: scaleGX 2s 1;
}
@keyframes scaleGX {
  
  0% {
    opacity: 0;
    // transform: scale(0.2, 0.2);
  }
  100% {
    opacity: 100;
    transform: scale(40, 40);
  }
}
.content-bg-show{
  -webkit-animation: scale 2s 1;
  animation: scale 2s 1; 
}
@keyframes scale {
  
  0% {
    opacity: 0;
    transform: scale(0.2, 0.2);
  }
  100% {
    opacity: 100;
    transform: scale(1, 1);
  }
}
.content-bg-hidden{
  -webkit-animation: scaleH 2s 1;
  animation: scaleH 2s 1; 
}
@keyframes scaleH {
  
  0% {
    opacity: 100;
    transform: scale(1, 1);
  }
  100% {
    opacity: 0;
    transform: scale(0, 0);
  }
}
.welcome-fd{
  position: absolute;
  z-index: 99;
  right: 10%;
  top: 8%;
  -webkit-animation: bounce 6s infinite;
  animation: bounce 6s infinite;
}
.welcome-fd-show{
  -webkit-animation: bounce 6s infinite;
  animation: bounce 6s infinite;
}
.welcome-fd-hidden{
  -webkit-animation: bounceH 2s 1;
  animation: bounceH 2s 1;
}
@keyframes bounce {
  0%,
  100% {
    transform: translate(0, 0);
    animation-timing-function: ease;
  }
  50% {
    transform: translate(-20px, 20px);
    animation-timing-function: ease;
  }
}
@keyframes bounceH {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
    transform: translate(200px, -200px);
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
  width: 300px;
  height: 300px;
  z-index: 9;
  position: absolute;
  overflow: hidden;
  bottom: 0px;
}
.welcome-xq::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  top: 20%;
  left: -20%;
  z-index: -1;
  background: url(../../assets/icons/welcome-xq.svg) 100% 100% no-repeat;
  background-size: cover;
}
.welcome-xq-show::before{
  -webkit-animation: rotate 50s linear infinite;
  -moz-animation: rotate 50s linear infinite;
  -o-animation: rotate 50s linear infinite;
  animation: rotate 50s linear infinite;
}
.welcome-xq-hidden{
  -webkit-animation: bouncexqH 2s 1;
  animation: bouncexqH 2s 1;
}
@keyframes bouncexqH {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
    transform: translate(-200px, 200px);
    animation-timing-function: ease;
  }
}
</style>