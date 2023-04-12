<template>
  <div v-if="type == 'RPC'" class="mt-12">
    <div class="relative text-center">
      <img src="@/assets/images/Rpc.png" class="w-[300px]" />
      <div class="absolute text-4xl font-bold left-[47%] bottom-[12px]">RPC</div>
    </div>
    <div class="text-center">
      <span class="block w-[80%] mx-auto mt-2 mb-4">Web3 development is inseparable from the support of blockchain nodes,
        and building and maintaining nodes requires a lot of cost and effort.
        In order to enable developers to obtain efficient and stable node services,
        Miwago provides RPC services to meet the development needs of developers for various ecological projects .
      </span>
      <a-button @click="router.push('/miwaspace?key=RPC')">Get service now</a-button>
    </div>
  </div>

  <div v-if="type == 'Oracle'" class="mt-12">
    <div class="text-center">
      <img src="@/assets/images/oracle.png" class="w-[300px]" />
      <div class="text-4xl font-bold">Oracle</div>
    </div>
    <div class="text-center">
      <span class="block w-[80%] mx-auto mt-2 mb-4">The Oracle is the messenger for the interaction between the blockchain
        and the real world data.
        It is an indispensable infrastructure for the web3 ecology,
        and its development plays a vital role in the prosperity of the web3 ecology.
        In order to allow developers to quickly access more suitable oracle services with zero code or low code,
        the Hamster platform aggregates various oracle solution middleware on the market.
      </span>
      <a-button @click="router.push('/miwaspace?key=oracle')">Get service now</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'

const routes = useRoute();
const router = useRouter();
const type = ref('');
type.value = routes.params.type;

watch(() => router.currentRoute.value,
  (value) => {
    type.value = value.params.type;
    // console.log(value, 'value')
  }, { deep: true, immediate: true }
)
</script>

<style scoped lang="less"></style>