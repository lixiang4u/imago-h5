<template>
  <div>
    <div class="header">
      <Header/>
    </div>
    <div class="container">
      <div class="sidebar">
        <Sidebar/>
      </div>
      <div class="main">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Header from './header.vue'
import Sidebar from './sidebar.vue'
</script>

<style scoped>
.header {
  height: 58px;
  box-shadow: 0 0 2px #c3c3c3;
  background-color: #ffffff;
}

.container {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 58px);

  .sidebar {
    display: flex;
    width: 223px; /** bug **/
    height: 100%;
  }

  .main {
    background-color: #f9fafb;
    width: 100%;

    overflow: auto;
  }

  /* 自定义滚动条 */

  ::-webkit-scrollbar {
    width: 8px; /* 滚动条宽度 */
  }

  /* 滚动条轨道 */

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* 轨道背景色 */
  }

  /* 滚动条滑块 */

  ::-webkit-scrollbar-thumb {
    background-color: #888; /* 滑块颜色 */
    border-radius: 4px; /* 滑块圆角 */
  }

  /* 鼠标悬停时的滚动条滑块 */

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 悬停时的滑块颜色 */
  }


}


</style>