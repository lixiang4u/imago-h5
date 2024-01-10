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
    <div class="m-card">
      <n-form
          inline
          :label-width="80"
          label-placement="left">
        <n-grid :cols="24">
          <n-form-item-gi :span="24" label="选择代理">
            <n-select
                v-model:value="selectedProxy"
                placeholder="所有代理"
                :options="proxyOptions"
                @update:value="onProxyChange"
                clearable/>
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <div style="height: 500px; width: 100%;">
        <v-chart class="chart" :option="chartOption" autoresize/>
      </div>

    </div>

  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue";
import api from "@/api/index.js";
import format from "@/utils/format.js";
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {LineChart, PieChart} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';


const proxyStat = ref({
  proxy_count: 0,
  request_count: 0,
  response_bytes: 0,
  saved_bytes: 0,
  response_unit: 'MB',
  saved_unit: 'MB',
})

let chartXAxisList = ref([])
let chartSeriesList = ref([])

const selectedProxy = ref(null)
const proxyOptions = ref([])

const chartOption = ref({
  // Make gradient line here
  visualMap: [
    {
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 400
    },
  ],
  title: [
    {
      left: 'center',
      text: '请求统计'
    }
  ],
  tooltip: {
    trigger: 'axis',
  },
  xAxis: [
    {
      data: chartXAxisList
    }
  ],
  yAxis: [{}],
  grid: [{}],
  series: [
    {
      type: 'line',
      showSymbol: false,
      data: chartSeriesList,
      smooth: true
    }
  ]
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
  if (resp.length === 2) {
    r.response_bytes = resp[0]
    r.response_unit = resp[1]
  }
  if (save.length === 2) {
    r.saved_bytes = save[0]
    r.saved_unit = save[1]
  }
  return r
}

const loadProxyList = () => {
  api.ListProxy().then(resp => {
    console.log('[resp.data.data]', resp.data.data)

    proxyOptions.value = resp.data.data.map(item => {
      return {
        label: `${item.host}(${item.title})`,
        value: item.id
      }
    })
    //proxyOptions

  }).catch(err => {
    // modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  })
}

const loadProxyStat = () => {
  api.ProxyStat().then(resp => {
    proxyStat.value = handleProxyStateFormat(resp.data.data)
  }).catch(err => {
    // modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  })
}

const loadProxyRequestStat = (proxyId) => {
  proxyId = parseInt(proxyId, 10)
  if (isNaN(proxyId)) {
    proxyId = 0
  }
  api.ProxyRequestStat(proxyId).then(resp => {
    if (!resp.data.data) {
      chartXAxisList.value = []
      chartSeriesList.value = []
    } else {
      chartXAxisList.value = resp.data.data.map(item => {
        return item['t']
      })
      chartSeriesList.value = resp.data.data.map(item => {
        return item['count']
      })
    }
  }).catch(err => {
    // modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  })
}

const onProxyChange = (value, option) => {
  loadProxyRequestStat(value)
}

const onBeforeMountHandler = () => {
  loadProxyList()
  loadProxyStat()
  loadProxyRequestStat()
}

export default defineComponent({
  components: {
    VChart,

  },
  setup() {
    use([
      CanvasRenderer,
      PieChart,
      TitleComponent,
      TooltipComponent,
      LegendComponent,
      VisualMapComponent,
      GridComponent,
      LineChart,
    ])

    onBeforeMount(onBeforeMountHandler)
    return {
      proxyStat,
      chartOption,
      selectedProxy,
      proxyOptions,
      onProxyChange,
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