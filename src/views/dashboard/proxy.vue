<template>
  <div>
    <div class="m-card m-card-title">
      <div>代理列表</div>
      <n-button strong secondary type="success" @click="onShowCreateProxyClick">创建代理</n-button>
    </div>
    <div class="m-card table">
      <n-space vertical :size="12">
        <n-data-table
            :bordered="false"
            :single-line="false"
            :columns="columns"
            :data="proxyList"
            :pagination="pagination"/>
      </n-space>
    </div>

    <n-modal v-model:show="showModal" preset="card" style="width: 800px">
      <template #header>代理信息</template>
      <n-form ref="proxyFormRef" :model="proxyFormValue" :rules="proxyFormRules">
        <n-form-item label="代理ID" path="id" v-if="showModalReadOnly">
          <n-input v-model:value="proxyFormValue.id" :disabled="showModalReadOnly" type="number" placeholder="代理ID"/>
        </n-form-item>
        <n-form-item label="代理名称" path="title">
          <n-input v-model:value="proxyFormValue.title" :disabled="showModalReadOnly" type="text" placeholder="请输入代理名称"/>
        </n-form-item>
        <n-form-item label="源域名" path="origin">
          <n-input v-model:value="proxyFormValue.origin" :disabled="showModalReadOnly" type="text" placeholder="请输入源域名(http://或https://开头)"/>
        </n-form-item>
        <n-collapse :default-expanded-names="[showModalReadOnly?'1':'']" >
          <n-collapse-item title="高级配置" name="1">
            <n-form-item label="图片质量" path="quality">
              <n-input v-model:value="proxyFormValue.quality" :disabled="showModalReadOnly" value="80" type="number" placeholder="请输入图片质量(1-100)"/>
            </n-form-item>
            <n-form-item label="用户代理(UA)" path="user_agent">
              <n-input v-model:value="proxyFormValue.user_agent" :disabled="showModalReadOnly" type="text" placeholder="请输入用户代理(UA)"/>
            </n-form-item>
            <n-form-item label="访问限制(CORS)" path="cors">
              <n-input v-model:value="proxyFormValue.cors" :disabled="showModalReadOnly" type="text" placeholder="请输入访问限制(CORS)"/>
            </n-form-item>
            <n-form-item label="状态" path="status">
              <n-select v-model:value="proxyFormValue.status" :disabled="showModalReadOnly" :options="proxyStatusOptions" placeholder="请选择状态"/>
            </n-form-item>
          </n-collapse-item>
        </n-collapse>

      </n-form>
      <template #action>
        <div class="modal-footer">
          <n-button class="item" type="warning" :disabled="showModalReadOnly" @click="showModal=false">取消</n-button>
          <n-button class="item" type="primary" :disabled="showModalReadOnly" @click="onCreateProxyClick">添加</n-button>
        </div>
      </template>
    </n-modal>

    <ModalTipsComponent ref="modalTipsRef"/>

  </div>
</template>

<script>
import {defineComponent, h, onBeforeMount, ref} from "vue";
import {NButton, NDataTable, NSpace, NTag, useMessage} from "naive-ui";
import ModalTipsComponent from "@/components/ModalTipsComponent.vue";
import api from "@/api/index.js";
import format from '@/utils/format.js'

const createColumns = ({opProxyShow, opProxyUpdate, opProxyDelete}) => {
  return [
    {
      title: "#",
      key: "id",
      render(_, index) {
        return `${index + 1}`
      }
    },
    {
      title: "名称",
      key: "title"
    },
    {
      title: "主机",
      key: "host"
    },
    {
      title: "源",
      key: "origin"
    },
    {
      title: "状态",
      key: "status",
      render(row) {
        return proxyStatusOptions.map(item => {
          if (item.value === row.status) {
            if (item.value === 1) {
              return h(NTag, {type: 'info', bordered: false}, {default: () => item.label})
            } else {
              return h(NTag, {type: 'warning', bordered: false}, {default: () => item.label})
            }
          }
        })
      }
    },
    {
      title: "创建时间",
      key: "created_at",
      render(row) {
        return format.formatDateTime(row.created_at)
      }
    },
    {
      title: '操作',
      key: 'A',
      render(row) {
        const ops = []
        ops.push(h(NButton, {
          class: 'op-btn',
          strong: 'strong',
          secondary: 'secondary',
          onClick: () => opProxyShow(row),
        }, {default: () => '详情'}))

        ops.push(h(NButton, {
          class: 'op-btn',
          type: 'warning',
          strong: 'strong',
          secondary: 'secondary',
          onClick: () => opProxyUpdate(row),
        }, {default: () => '编辑'}))

        ops.push(h(NButton, {
          class: 'op-btn',
          type: 'warning',
          strong: 'strong',
          secondary: 'secondary',
          onClick: () => {
            console.log('[opProxyUpdate(row)]')
            opProxyUpdate(row)
          },
        }, {default: () => '启用'}))

        ops.push(h(NButton, {
          class: 'op-btn',
          type: 'error',
          strong: 'strong',
          secondary: 'secondary',
          onClick: () => opProxyDelete(row),
        }, {default: () => '删除'}))
        return ops
      }
    }
  ];
};
const proxyList = ref([])

const modalTipsRef = ref(null)
const showModal = ref(false)
const showModalReadOnly = ref(false)
const proxyFormValue = ref({
  id: null,
  title: null,
  origin: null,
  host: null,
  quality: null,
  user_agent: null,
  cors: null,
  referer: null,
  status: 1,
})
const proxyFormRef = ref(null)
const proxyFormRules = {
  title: [{
    required: true,
    validator(rule, value) {
      if (!value || value.length < 2) {
        return new Error('请输入代理名称');
      }
      return true;
    }
  }],
  origin: [{
    required: true,
    validator(rule, value) {
      const pattern = /^(https?:\/\/)/i;
      if (!value || !pattern.test(value)) {
        return new Error('请输入正确的源域名');
      }
      return true;
    }
  }],
  quality: [{
    required: true,
    validator(rule, value) {
      if (value < 1 || value > 100) {
        return new Error('图片质量取值1-100之间整数');
      }
      return true;
    }
  }]
}

const proxyStatusOptions = [{label: '启用', value: 1,}, {label: '禁用', value: 0,}]

const onShowCreateProxyClick = () => {
  showModal.value = true
  showModalReadOnly.value = false
}

const onCreateProxyClick = () => {
  proxyFormRef.value?.validate(error => {
    if (error) {
      modalTipsRef.value.showError({'message': error[0][0].message ?? '表单输入错误'})
      return
    }
    const data = {
      title: proxyFormValue.value.title,
      origin: proxyFormValue.value.origin,
      host: proxyFormValue.value.host,
      quality: +proxyFormValue.value.quality,
      user_agent: proxyFormValue.value.user_agent,
      cors: proxyFormValue.value.cors,
      referer: proxyFormValue.value.referer,
      status: +proxyFormValue.value.status,
    }
    api.CreateProxy(data).then(resp => {
      console.log('[resp]', resp)
      modalTipsRef.value.showSuccess({'message': '创建成功'})
      showModal.value = false

      loadProxyList()

    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })

  })
}

const loadProxyList = () => {
  api.ListProxy({q: 1, p: 2}).then(resp => {
    proxyList.value = resp.data.data
  }).catch(error => {
    modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  }).finally(() => {
  })
}

const onBeforeMountHandler = () => {
  loadProxyList()
}

const opProxyShow = (row) => {
  console.log('[opProxyShow]', row)
  showModal.value = true
  showModalReadOnly.value = true

  row.id = ''+row.id
  row.quality = ''+row.quality
  proxyFormValue.value = row
}
const opProxyUpdate = (row) => {
  console.log('[opProxyUpdate]', row)
}
const opProxyDelete = (row) => {
  console.log('[opProxyDelete]', row)
}

export default defineComponent({
  components: {
    ModalTipsComponent,
    NSpace, NDataTable, NButton
  },
  setup() {
    const message = useMessage();

    onBeforeMount(onBeforeMountHandler)

    return {
      proxyList,
      columns: createColumns({opProxyShow, opProxyUpdate, opProxyDelete}),
      pagination: {
        pageSize: 10
      },
      showModalReadOnly,
      modalTipsRef,
      onShowCreateProxyClick,
      onCreateProxyClick,
      showModal,
      proxyFormValue,
      proxyFormRef,
      proxyFormRules,
      proxyStatusOptions,
    };
  }
});
</script>

<style>

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