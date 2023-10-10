<template>
  <div>
    <BreadCrumb :routes="breadCrumbInfo" />
    <ContractBase></ContractBase>
    <div class="bg-[#1D1C1A] rounded-[12px] p-[32px] mt-[32px]">
      <div class="text-[24px] font-bold mb-[32px]">Contract Explorer</div>
      <ContractList v-if="frameType" :abiInfo="contractInfo.abiInfo" :contractAddress="contractInfo.contractAddress" :frameType="frameType"
        @checkContract="checkContract" :canisterId="contractInfo.canisterId">
      </ContractList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import ContractBase from './components/ContractBase.vue';
import ContractList from '@/views/projects/projectsContractsDetails/components/ContractList.vue';

const breadCrumbInfo = ref<any>([]);

const contractName = ref('');
const frameType = ref(2);
const contractInfo = ref({
  abiInfo: "{\"address\":\"0x5fb889ec5490c7660d90fe48fe06f5e5e3a367dd0b650b62e6e54123e84f4b06\",\"name\":\"wrapper\",\"friends\":[],\"exposed_functions\":[{\"name\":\"initiate_collection\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"\u0026signer\",\"address\",\"0x1::string::String\",\"0x1::string::String\",\"u64\"],\"return\":[]},{\"name\":\"wrap_obj_address\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":true,\"generic_type_params\":[],\"params\":[\"0x1::string::String\"],\"return\":[\"address\"]},{\"name\":\"wrap_token\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"\u0026signer\",\"0x1::string::String\",\"u64\",\"0x1::object::Object\u003c0x5fb889ec5490c7660d90fe48fe06f5e5e3a367dd0b650b62e6e54123e84f4b06::wrapper::Wrapper\u003e\"],\"return\":[]}],\"structs\":[{\"name\":\"ObjectMap\",\"is_native\":false,\"abilities\":[\"key\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"wraopObjMap\",\"type\":\"0x1::simple_map::SimpleMap\u003cvector\u003cu8\u003e, address\u003e\"}]},{\"name\":\"Wrapper\",\"is_native\":false,\"abilities\":[\"key\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"collection\",\"type\":\"0x1::string::String\"},{\"name\":\"creator_address\",\"type\":\"address\"},{\"name\":\"treasury_cap\",\"type\":\"0x1::account::SignerCapability\"}]}]}",
  contractAddress: "0x5fb889ec5490c7660d90fe48fe06f5e5e3a367dd0b650b62e6e54123e84f4b06",
  canisterId: "0x5fb889ec5490c7660d90fe48fe06f5e5e3a367dd0b650b62e6e54123e84f4b06",
});

const checkContract = (name: string) => {
  contractName.value = name
}

onMounted(async () => {
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: 'projectsDashboardExplorer',
      path: ''
    },
  ]
})
</script>

<style lang="less" scoped>

</style>