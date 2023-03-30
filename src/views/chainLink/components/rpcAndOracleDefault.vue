<template>
   <a-upload
    v-model:file-list="fileList"
    name="defaultpage"
    list-type="picture-card"
    class="avatar-uploader"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" class="w-full h-full"/>
    <div v-else>
      <!-- <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined> -->
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>

  <div class="mt-6 text-center">
    <span class="text-2xl">Rpc or oracle</span>
    <span class="mx-auto block mt-2 mb-4 w-[600px]">The Oracle is the messenger for the interaction between the blockchain and the real world data. 
      It is an indispensable infrastructure for the web3 ecology, 
      and its development plays a vital role in the prosperity of the web3 ecology. 
      In order to allow developers to quickly access more suitable oracle services with zero code or low code, 
      the Hamster platform aggregates various oracle solution middleware on the market.
    </span>
    <a-button>Get service now</a-button>
  </div>

</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { message } from 'ant-design-vue';
  // import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import nodeserviceGuide from '@/assets/images/nodeservice-guide.jpg'
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

  const fileList = ref([]);
  const loading = ref<boolean>(false);
  const imageUrl = ref<string>('');
  
  const getBase64 = (img: Blob, callback: (base64Url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  }

  const handleChange = (info: UploadChangeParam) => {
      if (info.file.status === 'uploading') {
        loading.value = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }
      if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
      }
    };

    const beforeUpload = (file: UploadProps['fileList'][number]) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };
</script>

<style scoped lang="less">
.ant-upload-picture-card-wrapper {
  text-align: center;
  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 400px;
    height: 300px;
    margin: 100px auto 0;
  }
}
  
</style>