<template>
  <div>
    <div class="m-card">

      <div class="sub-cards" v-if="proxyStat">

        <div class="sub-card">
          <div class="h">
            <span class="title">总代理数量</span>
            <span class="q"></span>
          </div>
          <div class="v" @click="$router.push('/proxy')">
            <span class="value">{{ proxyStat.proxy_count }}</span>
            <span class="uint">个</span>
          </div>
          <div class="desc">所有代理配置数量</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总请求数</span>
            <span class="q"></span>
          </div>
          <div class="v">
            <span class="value">{{ proxyStat.request_count }}</span>
            <span class="uint">条</span>
          </div>
          <div class="desc">所有有效请求数量</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总响应流量</span>
            <span class="q"></span>
          </div>
          <div class="v">
            <span class="value">{{ proxyStat.response_bytes }}</span>
            <span class="uint">{{ proxyStat.response_unit }}</span>
          </div>
          <div class="desc">所有有效请求返回的数据大小</div>
        </div>

        <div class="sub-card">
          <div class="h">
            <span class="title">总节省流量</span>
            <span class="q"></span>
          </div>
          <div class="v">
            <span class="value">{{ proxyStat.saved_bytes }}</span>
            <span class="uint">{{ proxyStat.saved_unit }}</span>
          </div>
          <div class="desc">所有返回图片压缩后节约流量</div>
        </div>
      </div>
    </div>
    <!--<div class="m-card"></div>-->

  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue";
import api from "@/api/index.js";
import format from "@/utils/format.js";

const proxyStat = ref({
  proxy_count: 0,
  request_count: 0,
  response_bytes: 0,
  saved_bytes: 0,
  response_unit: 'MB',
  saved_unit: 'MB',
})

const handleProxyStateFormat = (data) => {
  const r = {
    proxy_count: data.proxy_count,
    request_count: data.request_count,
    response_bytes: 0,
    saved_bytes: 0,
    response_unit: '',
    saved_unit: '',
  }
  const resp = format.formatBytes(data.response_bytes).split(' ')
  const save = format.formatBytes(data.saved_bytes).split(' ')

  console.log('[resp]', resp, resp.length)

  if (resp.length === 2) {
    r.response_bytes = resp[0]
    r.response_unit = resp[1]
  }
  if (save.length === 2) {
    r.saved_bytes = save[0]
    r.saved_unit = save[1]
  }

  console.log('[r]', r)

  return r
}

const loadProxyStat = () => {
  api.ProxyStat().then(resp => {
    console.log('[resp.data]', resp.data.data)
    proxyStat.value = handleProxyStateFormat(resp.data.data)
  }).catch(err => {
    modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  })
}

const onBeforeMountHandler = () => {
  loadProxyStat()
}

export default defineComponent({
  setup() {
    onBeforeMount(onBeforeMountHandler)
    return {
      proxyStat,
    }
  }
})

</script>

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