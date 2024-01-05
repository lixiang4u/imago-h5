<template>
  <div>
    <div class="m-card">

      <div class="sub-cards">

        <div class="sub-card">
          <div class="h">
            <span class="title">总代理数量</span>
            <span class="q"></span>
          </div>
          <div class="v"><span class="value">12,862</span><span class="uint">个</span></div>
          <div class="desc">所有代理配置数量</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总请求数</span>
            <span class="q"></span>
          </div>
          <div class="v"><span class="value">12862</span><span class="uint">MB</span></div>
          <div class="desc">所有有效请求数量</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总响应流量</span>
            <span class="q"></span>
          </div>
          <div class="v"><span class="value">12,862</span><span class="uint">MB</span></div>
          <div class="desc">所有有效请求返回的数据大小</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总节省流量</span>
            <span class="q"></span>
          </div>
          <div class="v"><span class="value">12,862</span><span class="uint">MB</span></div>
          <div class="desc">所有返回图片压缩后节约流量</div>
        </div>
      </div>
    </div>
    <!--<div class="m-card"></div>-->

  </div>
</template>

<script setup></script>

<style scoped>

.m-card {
  background-color: #ffffff;
  width: 90%;
  margin: 26px auto 26px auto;
  padding: 18px 18px 18px 18px;
}

.sub-cards {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 15px 8px 15px;

  .sub-card {
    line-height: 200%;

    .h {

      .title {
        font-size: 110%;
        font-weight: 500;
      }

      .q {
      }
    }

    .v {
      margin: 15px 0 15px 0;

      .value {
        font-size: 32px;
        font-weight: 500;
      }

      .uint {
        margin-left: 5px;
      }
    }


    .desc {
      color: #9e9e9e;
      font-size: 90%;
    }
  }

}


</style>