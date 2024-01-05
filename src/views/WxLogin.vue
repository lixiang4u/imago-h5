<template>
  <div>
    <wx-login :appid="appId" :scope="scope" :redirect_uri="redirect"></wx-login>
  </div>
</template>

<script setup>

import WxLogin from 'vue-next-wxlogin'

const appId='wx8a587f4e8650f8da'
const scope = 'snsapi_login'
const redirect = '/'

</script>

<style scoped>

</style>