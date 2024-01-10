<template>
  <div class="h flex flex-row">
    <div class="flex flex-row">
      <div class="logo">imago</div>
    </div>
    <div class="flex flex-row">
      <div>@{{nickname}}</div>
      <span class="split">|</span>
      <div class="cursor" @click="onLogoutClick">退出</div>
    </div>
  </div>
</template>
<script>

import {defineComponent} from "vue";
import {useRouter} from "vue-router";
import localStorage from '@/utils/localstorage.js'

let router = null
const onLogoutClick = () => {
  localStorage.clear()
  router.push('/login?from=logout')
}

const nickname = localStorage.getNickname()

export default defineComponent({
  setup() {
    router = useRouter()
    return {
      nickname,
      onLogoutClick,
    }
  }
})

</script>
<style scoped>
.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.h {
  padding: 0 30px 0 30px;
  line-height: 58px;
  justify-content: space-between;

  .logo {
    font-size: 36px;
    font-family: "Source Code Pro", serif;
    font-weight: 500;
  }

  .split {
    margin: 0 5px 0 5px;
    color: #c3c3c3;
  }

  .cursor{
    cursor: pointer;
  }
}
</style>