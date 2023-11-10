<template>
  <a-button class="btn" @click="deployClick" :loading="connecting" >{{
      connecting ? 'Deploying' : 'Deploy'
    }}</a-button>
</template>
<script setup>
import {ref, toRefs} from "vue";
const emit = defineEmits(["Validate"])
const loading = ref(false);
import {useWallet} from "solana-wallets-vue";

const props = defineProps({
  solanaAbi:{
    type: Object,
    required:true
  }
});
const { solanaAbi } = toRefs(props);

const { wallets, wallet, select, disconnect, connecting, connected } = useWallet();

const deploySolana = () =>{
  const {byteCode} = solanaAbi.value;
  const binaryString = atob(byteCode);

  const byteArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  console.log(byteArray);


}
const deployClick = async () => {
  // emit("Validate");



    try{


      const phantom = wallets.value.find(item => item.adapter.name === "Phantom")
      if (phantom) {
        if (phantom.readyState !== "Installed") {
          window.open(phantom.adapter.url, '_blank')
        } else {
          await select(phantom.adapter.name)
          console.log("=========wallet======",wallet.value.adapter?.publicKey?.toBase58())
          deploySolana()
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
