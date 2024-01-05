<template>
  <div class="content">
    <ul>
      <router-link to="/home" active-class="active">
        <li>首页</li>
      </router-link>
      <router-link to="/proxy" active-class="active">
        <li>代理</li>
      </router-link>
      <router-link to="/about" active-class="active">
        <li>关于</li>
      </router-link>
    </ul>

    <div class="footer">
      <div class="title">@imago</div>
    </div>

  </div>
</template>
<script>

</script>
<style scoped>

.content {
  display: flex;
  flex-direction: column;

  flex-grow: 1;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  flex-grow: 1;

  li {
    line-height: 50px;
    padding-left: 30px;
    margin: 2px 0 2px 0;
  }

  a {
    text-decoration: none;
    color: rgb(100, 116, 139);
  }

  li:hover {
    background-color: #f0f8ff;
    color: #001489;
  }

  .active li {
    background-color: #f0f8ff;
    color: #001489;
    border-right: 3px solid #31aeff;
  }

}

.footer {
  display: flex;
  flex-direction: column;


  .title {
    line-height: 40px;
    text-align: center;
    color: #a4a5b1;
  }
}


</style>