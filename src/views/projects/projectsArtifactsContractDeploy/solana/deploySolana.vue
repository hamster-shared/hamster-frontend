<template>
  <a-button class="btn" @click="deployClick" :loading="connecting || loading" >{{
      connecting ? 'Deploying' : 'Deploy'
    }}</a-button>
</template>

<script setup>
import {ref, toRefs} from "vue";
const emit = defineEmits(["Validate","setProjectsContractDeploy"]);

const loading = ref(false);
import {useWallet} from "solana-wallets-vue";

import {Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import { ClientTx } from './utils';
import {Common, BpfLoaderUpgradeable, Tx} from "./solana-bpf-upgradeable";

import bs58 from 'bs58';
import router from "@/router";
import {message} from "ant-design-vue";

const programBuffer = ref(null);

const props = defineProps({
  solanaAbi:{
    type: Object,
    required: true
  },
  network:{
    type: String,
    required: true
  }
});
const { solanaContractPrivkey, solanaAbi, network } = toRefs(props);

const { wallets, wallet, select, disconnect, connecting, connected } = useWallet();

const deploySolana = async() =>{
  const {byteCode} = solanaAbi.value;

  const binaryString = atob(byteCode);

  const byteArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  console.log(byteArray);

  programBuffer.value = byteArray;

  try {
    const { walletKp, programKp, deployTxHash } = await processDeploy();
    console.log("Deploy Success!! wallet = " + walletKp?.publicKey.toString() + ", program = " + programKp?.publicKey.toString())
    return { programKp, deployTxHash };

  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  }
}

const transfer = async (signer, toPubKey, lamports, conn) => {
  try {
    const instruction = SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: toPubKey,
      lamports: lamports
    })
    const tx = new Transaction();
    tx.add(instruction);
    let rt;
    console.log("has signTransaction", signer)
    if (signer.signTransaction) {
      rt = await ClientTx.sendWithWallet(tx, conn, signer)
    } else {
      rt = await ClientTx.send(tx, conn, signer)
    }

    console.log("transfer", rt)
    const rs = await conn.confirmTransaction(rt, "confirmed");
    if (rs.value.err) {
      return Promise.reject(`Transfer Failed: ${JSON.stringify(rs.value.err)}`)
    }
    console.log("transfer success, from: " + signer.publicKey.toString() + ", to: " + toPubKey.toString())
    return true;


  } catch (e) {
    console.error(e)
    return Promise.reject(`Transfer Failed: ${JSON.stringify(e)}`)
  }
}

const transferAll = async (fromWallet, toPubKey, conn) => {
  try {
    const walletBalance = await conn.getBalance(fromWallet.publicKey);

    console.log("wallet balance",fromWallet.publicKey.toString(), walletBalance)
    if (walletBalance) {
      const { blockhash } = await conn.getRecentBlockhash();
      // 根据区块哈希获取交易费用计算器
      const feeCalculator = await conn.getFeeCalculatorForBlockhash(blockhash);
      // 获取当前的交易费用
      const lamportsPerSignature = feeCalculator.value.lamportsPerSignature;
      console.log("fee", lamportsPerSignature / LAMPORTS_PER_SOL)
      if (walletBalance > lamportsPerSignature) {
        console.log("start transfer")
        await transfer(fromWallet, toPubKey, walletBalance-lamportsPerSignature, conn)
      } else {
        console.log("empty account to transfer")
      }
    }
  } catch (e) {

    console.error("transfer to user failed")
  }
}

const processDeploy = async () => {

  const conn = new Connection(clusterApiUrl(network.value), "confirmed")

  const signerWallet = wallet.value.adapter;

  const walletKp = Keypair.generate();
  const payerAccountAddr = walletKp.publicKey.toString()
  console.log("payer publicKey: ", payerAccountAddr)

  const bufferKp = Keypair.generate();
  console.log("payer privateKey: ", bs58.encode(walletKp.secretKey))
  console.log("buffer privateKey: ", bs58.encode(bufferKp.secretKey))
  const bufferAddr = bufferKp.publicKey.toString()
  console.log("buffer publicKey: ", bufferAddr)

  const programKp = web3.Keypair.fromSecretKey(solanaContractPrivkey)
  const programPk = programKp.publicKey;
  const programAddr = programPk.toString()
  console.log("programPk privateKey: ", bs58.encode(programKp.secretKey))
  console.log("Solana ProgramId: ", programAddr)

  try {
    const programLen = programBuffer.value.length;
    console.log("program size: " + programLen + " bytes")
    const bufferSize = BpfLoaderUpgradeable.getBufferAccountSize(programLen);
    const bufferBalance = await conn.getMinimumBalanceForRentExemption(
        bufferSize
    );
    console.log("buffer account rent exemption: ", bufferBalance)

    const needTransfer = bufferBalance * 2 + 0.01 * LAMPORTS_PER_SOL;
    console.log("need Transfer", needTransfer/LAMPORTS_PER_SOL)

    await transfer(signerWallet, walletKp.publicKey, needTransfer, conn)

    console.log("Creating Buffer Account ... ");
    const createBufferTx = await BpfLoaderUpgradeable.createBuffer(
        walletKp.publicKey,
        bufferKp.publicKey,
        bufferBalance,
        programLen,
    );

    const createBufferTxHash = await ClientTx.send(createBufferTx, conn, walletKp, [bufferKp]);

    console.log("Create Buffer TX hash: " + createBufferTxHash);
    const result = await conn.confirmTransaction(createBufferTxHash, "confirmed");
    console.log("create buffer account result: ", result)
    if (result.value.err) {
      return Promise.reject(`create buffer account faild: ${JSON.stringify(result.value.err)}`)
    }
    console.log("Create Buffer Account Success !!!")

    console.log("Loading Program Buffer ...")
    await BpfLoaderUpgradeable.loadBuffer(
        conn,
        walletKp,
        bufferKp.publicKey,
        programBuffer.value
    );
    console.log("Program Buffer Loaded !")

    const programSize = BpfLoaderUpgradeable.getBufferAccountSize(
        BpfLoaderUpgradeable.BUFFER_PROGRAM_SIZE
    );
    const programBalance = await conn.getMinimumBalanceForRentExemption(programSize);
    console.log("Program Account Size: " + programSize + " bytes")
    console.log("program account rent exemption: ", programBalance)

    const deployTx = await BpfLoaderUpgradeable.deployProgram(
        walletKp.publicKey,
        bufferKp.publicKey,
        programKp.publicKey,
        bufferBalance,
        programLen,
    )
    const deployTxHash = await ClientTx.send(deployTx, conn, walletKp, [programKp]);
    console.log("deployTxHash", deployTxHash)
    const deployResult = await conn.confirmTransaction(deployTxHash, "confirmed");
    if (deployResult.value.err) {
      return Promise.reject(`deploy program failed ${JSON.stringify(deployResult.value.err)}`)
    }
    console.log("deploy success", result)
    return {walletKp, programKp,deployTxHash };

  } catch (e) {
    console.error(e)
    return Promise.reject(`Deploy Failed:${JSON.stringify(e)}`)
  } finally {

    try {
      console.log("Withdraw from sign wallet...")
      await transferAll(walletKp, signerWallet.publicKey, conn)
    } catch (e) {
      console.error("Withdraw from sign wallet failed")
    }

  }
}

const deployClick = async () => {
  emit("Validate");
  loading.value = true;

    try{
      const phantom = wallets.value.find(item => item.adapter.name === "Phantom")
      if (phantom) {
        if (phantom.readyState !== "Installed") {
          window.open(phantom.adapter.url, '_blank')
        } else {
          await select(phantom.adapter.name)
          console.log("=========wallet======",wallet.value.adapter?.publicKey?.toBase58())
          let rt = await deploySolana()
          const { programKp, deployTxHash } = rt;
          const { id, projectId, version } = solanaAbi.value;

          emit("setProjectsContractDeploy", network.value, programKp?.publicKey.toString(), id, deployTxHash);
          router.push(`/projects/${projectId}/contracts-details/${version}`)
        }
      }
  }catch (e){
      message.error(e);
    console.log("solana login error:",e)
  }finally {
      loading.value = false;
    }
}
</script>

<style lang='less' scoped>

</style>
