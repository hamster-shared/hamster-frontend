<template>
  <div class="login-box">
    <div class="flex justify-between login-header">
      <a target="_bank" @click="goHome">
        <img src="@/assets/images/logo-block.png" class="h-[28px] mt-[16px]" />
      </a>
    </div>
    <div class="text-center login-content ">
      <img src="@/assets/images/logo.png" class="h-[92px]" />
      <div class="text-[32px] text-[#ffffff] font-bold mb-[32px]">Welcome to Hamster</div>
      <div class="login-btn mb-[24px] bg-[#ffffff] text-[#000000] cursor-pointer" @click="loginBox">
        <img src="@/assets/icons/Frame-white.svg" class="h-[24px]" />
        <span class="align-middle ml-[6px]">Continue with GitHub</span>
      </div>
      <div class="login-btn mb-[24px] bg-[#ffffff] text-[#000000] cursor-pointer" @click="awakeWallet">
        <svg-icon name="metamaskLogo" size="18" class="mr-[4px]" />
        <span class="align-middle ml-[6px]">Continue with MetaMask</span>
      </div>
      <div class="login-btn btn-dis mb-[24px] bg-[#333230] text-[#FFFFFF]">
        <img src="@/assets/icons/icon-gitLab.svg" />
        <span class="align-middle ml-[6px]">Continue with GitLab</span>
      </div>
      <div class="login-btn btn-dis bg-[#333230] text-[#FFFFFF]">
        <img src="@/assets/icons/icon-bitbucket.svg" />
        <span class="align-middle ml-[6px]">Continue with Bitbucket</span>
      </div>
    </div>
  </div>
  <MetaMaskDownloadModal :metaMaskVisible="metaMaskVisible" @closeMetaMaskModal="closeMetaMaskModal">
  </MetaMaskDownloadModal>
</template>
<script lang='ts' setup>
import { message } from "ant-design-vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login, saveWallet, metamaskLogin, getUserInfo, getUserInfoById } from "@/apis/login";
import Web3 from 'web3';
import { ethers } from 'ethers';
import MetaMaskDownloadModal from "./components/metaMaskDownloadModal.vue";


const metaMaskVisible = ref(false);
const router = useRouter()
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
const oauthUrl = ref('https://github.com/login/oauth/authorize');

// const githubLogin = async () => {
//   try {
//     const { data } = await login({ code: '5df6a81800434eb00145' });
//     localStorage.setItem('token', data);
//     console.log(data, 'ggg')
//     getUserInfoData()
//   } catch (err: any) {

//   }
// }


// const loginBox = () => {
//   // router.push("/loginTransition?code=5df6a81800434eb00145");
//   const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
//   if (JSON.stringify(userInfo) === '{}') {
//     // 登录
//     const state = new Date().getTime();
//     const url = `${oauthUrl.value}?client_id=${clientId.value}&scope=read:user&state=${state}`;
//     const myWindow = window.open(url, 'login-github', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
//     myWindow?.focus()
//   } else {
//     if (userInfo.token) {
//       localStorage.setItem('token', userInfo.token);
//       commonJump()
//     } else {
//       // install
//       // const state = new Date().getTime();
//       // const url = `${oauthUrl.value}?client_id=${clientId.value}&scope=read:user&state=${state}`;
//       // const myWindow = window.open(url, 'login-github', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
//       // myWindow?.focus()
//     }
//   }
// }

const loginBox = () => {
  const state = new Date().getTime();
  const url = `${oauthUrl.value}?client_id=${clientId.value}&scope=read:user&state=${state}&redirect_uri=${apiUrl.value}/loginTransition`;
  const myWindow = window.open(url, 'login-github', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
  myWindow?.focus()
}

const getMetamaskLogin = async (address: string) => {
  try {
    const { data } = await metamaskLogin({ address: address })
    if (data && data.length > 0) {
      localStorage.setItem('token', data);
      console.log(data, '小狐狸登录的data')
      getUserInfoData();
      saveWallet(address).then();
    } else {
      message.error('登录失败，请稍候重试！')
    }

  } catch (err: any) {
    message.error(err.message);
  }

}


const getMetaMaskUserInfo = async (id: string) => {
  const { data } = await getUserInfoById(id);
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
    commonJump()
  }
}

const getUserInfoData = async () => {
  try {
    const { data } = await getUserInfo();

    console.log(data, 'data125678')
    if (data.userId == 0) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      commonJump()
    } else {
      getMetaMaskUserInfo(data.userId)
    }
    // getMetaMaskUserInfo(data.userId)
    // localStorage.setItem('userInfo', JSON.stringify(data));
    // commonJump()
  } catch (err: any) {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    router.push('/');
    message.error(err.message);
  }

}

const commonJump = () => {
  if (localStorage.getItem('firstState') === "0" && false) {
    //第一次登录
    router.push('/welcome')
  } else {
    router.push('/projects')
  }
}




// 通过钱包登录
const awakeWallet = async () => {
  if (window.ethereum) {
    const { ethereum } = window;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];

    console.log(accounts, 'accounts')
    const web3 = new Web3(window.ethereum);
    console.log(web3, ethereum.identicon, ethereum.chainId, 'web3web3')
    if (address) {
      try {
        // 请求用户授权连接到 MetaMask
        //  await window.ethereum.enable();
        // 创建一个要签署的消息
        const message = `hamsternet.io wants you to sign in with your Ethereum account: ${address} 
        
Please ensure that the domain above matches the URL of the current website.

Version: ${web3.version}`

        // 使用 Web3.js 发送请求签名的消息
        web3.eth.personal.sign(message, window.ethereum.selectedAddress, (error, signature) => {
          if (!error) {
            console.log('签名结果：', signature);
            // 在这里你可以将签名发送到后端服务器进行验证
            getMetamaskLogin(address);
            window.localStorage.setItem("walletAccount", address);
          } else {
            console.error('签名请求失败：', error);
          }
        });
        // 用户已连接，可以使用 web3 进行操作
        console.log('已连接到 MetaMask');
        // getMetamaskLogin(address)
      } catch (error) {
        console.error('用户拒绝连接：', error);
      }
      console.log(`Metamask wallet address: ${address}`, accounts);
    }

  } else {
    metaMaskVisible.value = true;
  }
}


const goHome = () => {
  let linkVal = "https://portal.hamster.newtouch.com"
  if (window.location.href.indexOf('hamsternet.io') !== -1) {
    linkVal = "https://hamsternet.io";
  }
  window.open(linkVal)
};



const closeMetaMaskModal = () => {
  metaMaskVisible.value = false;
}


onMounted(() => {
  if (localStorage.getItem('token')) {
    if (localStorage.getItem('firstState') === "0" && false) {
      router.push('/welcome')
    }
    else {
      router.push('/projects')
    }
  }
})


</script>
<style lang='less' scoped>
.login-box {
  min-height: 100vh;
  padding: 0 32px;
  background: url("../../assets/images/login-bg.jpg") 100% 100% no-repeat;
  background-size: cover;

  .login-header {
    height: 64px;
  }

  .login-content {
    font-size: 16px;
    width: 400px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .login-btn {
      border-radius: 8px;
      line-height: 56px;
    }

    .btn-dis {
      width: 100%;
      height: 56px;
      position: relative;

      &::before {
        content: 'coming soon';
        position: absolute;
        top: 0;
        right: 0;
        width: 89px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        border-radius: 0 8px 0 8px;
        color: #ffffff;
        background-color: #E2B578;
      }
    }
  }
}
</style>
