<template>
  <div class="text-[16px] text-center login-transition">
    <div class="text-[20px] font-bold mb-[12px]">Authenticating</div>
    <div>Hamster is validating your identity</div>
    <div class="mb-[8px]">Please wait...</div>
    <a-spin />
  </div>

</template>
<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { apiLogin } from "@/apis/login";

const router = useRouter();
const code = ref('');
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
// const clientId = ref('9fce2a15f6df21849e20'); //测试
// const clientId = ref('a782e08a53e86517dcc5'); //生产

const login = async () => {
  try {
    const { data } = await apiLogin({ code: code.value, clientId: clientId.value });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data));
    window.close();
    window.opener.location.reload();
  } catch (err) {
    window.close();
    router.push('/');
    message.error(err.message);
  }

}

onMounted(async () => {
  if (localStorage.getItem('token')) {
    const userInfo = localStorage.getItem('userInfo');
    if (JSON.parse(userInfo)?.firstState === 0) {
      //第一次登录
      router.push('/welcome')
    } else {
      router.push('/projects')
    }
  } else {
    code.value = router.currentRoute.value.query?.code;
    if (code.value) {
      login()
    }
  }
})
</script>
<style lang='less' scoped>
.login-transition {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>