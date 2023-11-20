<template>
  <div class="text-center installations">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getUserInfo } from "@/apis/login";
const loginType = ref();


const getUserInfoData = async () => {
  const { data } = await getUserInfo()

  console.log(data, 'data')
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('test', 'test connect gIthub后更新的userInfo')
    console.log(data, 'connect gIthub后更新的userInfo， 有username吗？')
    window.close();
    window.opener.location.reload();
  }
}

onMounted(() => {
  let token = localStorage.getItem('token') || '';
  if (token) {
    let loginData = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
    console.log(loginData, 'connectGithub回调页')
    loginType.value = loginData.loginType;
    if (loginType.value == 2) {
      getUserInfoData();
    }
  }
})

</script>

<style scoped lang="less">
.installations {
  margin: 0 auto;
  padding-top: 10%;
}
</style>