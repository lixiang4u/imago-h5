<template>
  <div>
    <div class="m-card m-card-title">
      <div>代理日志列表</div>
    </div>
    <div class="m-card table">
      <n-space vertical :size="12">
        <n-data-table
            :bordered="false"
            :columns="columns"
            :data="proxyLogList"
            :remote="true"
            :pagination="pagination"/>
      </n-space>
    </div>

  </div>
</template>

<script>
import {defineComponent, h, onBeforeMount, reactive, ref} from "vue";
import {NButton, NDataTable, NSpace, NTag} from "naive-ui";
import api from "@/api/index.js";
import format from '@/utils/format.js'
import {useRoute} from "vue-router";

let route = null

const createColumns = () => {
  return [
    {
      title: "#",
      key: "id",
      render(_, index) {
        return `${index + 1}`
      }
    },
    {
      title: "文件ID",
      key: "meta_id"
    },
    {
      title: "请求地址",
      key: "request_url"
    },
    {
      title: "溯源",
      key: "is_cache",
      render(row) {
        if (row['is_cache'] === 1) {
          return h(NTag, {type: 'warning', bordered: false}, {default: () => '否'})
        } else {
          return h(NTag, {type: 'info', bordered: false}, {default: () => '是'})
        }
      }
    },
    {
      title: "是否存在",
      key: "is_exist",
      render(row) {
        if (row['is_exist'] === 1) {
          return h(NTag, {type: 'info', bordered: false}, {default: () => '是'})
        } else {
          return h(NTag, {type: 'warning', bordered: false}, {default: () => '否'})
        }
      }
    },
    {
      title: "创建时间",
      key: "created_at",
      render(row) {
        return format.formatDateTime(row.created_at)
      }
    }
  ];
};

const proxyId = ref(0)
const proxyLogList = ref([])

const modalTipsRef = ref(null)

const loadProxyLogList = () => {
  api.ListProxyLog(proxyId.value, {limit: pagination.pageSize, page: pagination.page}).then(resp => {
    proxyLogList.value = resp.data.data
    pagination.itemCount = resp.data.total
  }).catch(error => {
    modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  }).finally(() => {
  })
}

const onBeforeMountHandler = () => {
  console.log('[route]', route)
  proxyId.value = route.params['proxy_id'] ?? 0

  console.log('[proxyId.value]', proxyId.value)
  loadProxyLogList()
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  onChange: (page) => {
    console.log('[onChange]', page)
    pagination.page = page
    loadProxyLogList()
  },
  onUpdatePageSize: (pageSize) => {
    console.log('[onUpdatePageSize]', pageSize)
  },
})

export default defineComponent({
  components: {
    NSpace, NDataTable, NButton
  },
  setup() {
    route = useRoute()
    onBeforeMount(onBeforeMountHandler)
    return {
      proxyLogList,
      columns: createColumns({}),
      pagination,
    };
  }
});
</script>

<style scoped>

.m-card {
  background-color: #ffffff;
  width: 90%;
  margin: 26px auto 26px auto;
  padding: 18px 18px 18px 18px;
}

.table {
  line-height: 200%;
}

.m-card-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 120%;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;

  .item {
    margin: 0 0 0 20px;
  }
}

.op-btn {
  margin: 5px 5px 5px 5px;
}

</style>