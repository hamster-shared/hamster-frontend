<template>
  <a-button class="btn" @click="submit" :loading="connecting || loading" >{{
      connecting ? 'Transacting' : 'Transact'
    }}</a-button>
</template>
<script setup>

import {computed,ref, toRefs} from "vue";
import * as anchor from "@coral-xyz/anchor";
import {AnchorProvider} from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
} from "@solana/web3.js"

import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {walletAdapterIdentity} from "@metaplex-foundation/umi-signer-wallet-adapters";
import {findMetadataPda, mplTokenMetadata, findMasterEditionPda, MPL_TOKEN_METADATA_PROGRAM_ID,} from "@metaplex-foundation/mpl-token-metadata";
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress,} from "@solana/spl-token";

import {publicKey} from "@metaplex-foundation/umi";


const resultUrl = ref("");
const loading = ref(false);
import {useWallet} from "solana-wallets-vue";
import {message} from "ant-design-vue";
const { wallets, wallet, select, disconnect, connecting, connected } = useWallet();
const emit = defineEmits(["submitSolana"]);
const props = defineProps({
  formState:Object,
  formData:Object
});
const { formState,formData } = toRefs(props);


const submit = async() =>{
  loading.value = true;

  try{
    const phantom = wallets.value.find(item => item.adapter.name === "Phantom")
    if (phantom) {
      if (phantom.readyState !== "Installed") {
        window.open(phantom.adapter.url, '_blank')
      } else {
        await select(phantom.adapter.name)
        // console.log("=========wallet======",wallet.value.adapter?.publicKey?.toBase58())
        // emit("submitSolana",wallet.value.adapter);
        await submitToSolana()
      }
    }
  }catch (e){
    message.error(e);
    console.log("solana login error:",e)
  }finally {
    loading.value = false;
  }
}


const submitToSolana = async() =>{


  const {network,contractAddress,abiInfo} = formState?.value;
  console.log(formState?.value,formData.value)
  return;

  const networkData =[{name: 'Mainnet', id: 'Mainnet', networkName: 'mainnet-beta'},{name: 'Devnet', id: 'devnet', networkName: 'devnet'},{name: 'Testnet',id:'testnet',networkName: 'testnet'}]
  let chain = networkData.filter((item)=>item.name=== network);

  if(!chain.length) return;
//
  const chainName = chain[0].networkName;
  const signer = wallet.value.adapter;

  const connection = new Connection(clusterApiUrl(chainName))
  const provider = new AnchorProvider(connection, signer, AnchorProvider.defaultOptions());
  anchor.setProvider(provider);


  const mint = anchor.web3.Keypair.generate();
  const programId = new PublicKey(contractAddress);
  const idl = JSON.parse(abiInfo);


  const associatedTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      signer.publicKey
  );
  const umi = createUmi(clusterApiUrl(chainName))
      .use(walletAdapterIdentity(signer))
      .use(mplTokenMetadata());

  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];
//
  const program = new anchor.Program(idl, programId, provider);

  const {name,symbol, uri} = formData.value;

  const tx = await program.methods
      .initNft(name,symbol, uri)
      .accounts({
        signer: signer.publicKey,
        mint: mint.publicKey,
        associatedTokenAccount,
        metadataAccount,
        masterEditionAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

  resultUrl.value = `https://explorer.solana.com/address/${mint.publicKey}?cluster=${chainName}`;
  console.log(resultUrl.value)
}
</script>
