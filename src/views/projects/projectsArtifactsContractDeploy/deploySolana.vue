<template>
  <a-button class="btn" @click="deployClick" :loading="connecting" >{{
      connecting ? 'Deploying' : 'Deploy'
    }}</a-button>
</template>
<script setup>
import {ref} from "vue";
const emit = defineEmits(["Validate"])
const loading = ref(false);
import {useWallet} from "solana-wallets-vue";

const { wallets, wallet, select, disconnect, connecting, connected } = useWallet();

// const deploySolana = () =>{
//
//

// }
const deployClick = async () => {
  // emit("Validate");

    try{

    console.log("=========connect======",loading.value)
      const phantom = wallets.value.find(item => item.adapter.name === "Phantom")
      if (phantom) {
        if (phantom.readyState !== "Installed") {
          window.open(phantom.adapter.url, '_blank')
        } else {
          await select(phantom.adapter.name)
        }
      }
    // await connect(clusterApiUrl(WalletAdapterNetwork.Mainnet))
    // console.log("=========connect======",wallet.value)
  }catch (e){
    console.log("=========connect======",e)
  }
}
</script>
<style lang='less' scoped>

</style>
