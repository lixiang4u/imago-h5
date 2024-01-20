<template>
  <div>
    <div class="header flex flex-row">
      <div>
        <div class="logo">imago</div>
      </div>
      <div class="flex flex-row">
        <div>关于</div>
        <span class="split">|</span>
        <div class="cursor">退出</div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style>

</style>
<style scoped>

.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.header{
  height: 76px;
  line-height: 76px;
  justify-content: space-between;

  background-color: #f9fafb;
  padding: 0 100px 0 100px ;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);

  .logo {
    font-size: 36px;
    font-family: "Source Code Pro", serif;
    font-weight: 500;
  }

  .split {
    margin: 0 5px 0 5px;
    color: #c3c3c3;
  }

}
</style>