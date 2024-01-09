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
            :remote="true"
            :pagination="pagination"/>
      </n-space>
    </div>

    <n-modal v-model:show="showModalConf.show" preset="card" style="width: 800px">
      <template #header>代理信息</template>
      <n-form ref="proxyFormRef" :model="proxyFormValue" :rules="proxyFormRules">
        <n-form-item label="代理ID" path="id" v-if="showModalConf.show && !showModalConf.isCreate">
          <n-input v-model:value="proxyFormValue.id" :disabled="true" type="number"
                   placeholder="代理ID"/>
        </n-form-item>
        <n-form-item label="代理名称" path="title">
          <n-input v-model:value="proxyFormValue.title" :disabled="showModalConf.readOnly" type="text"
                   placeholder="请输入代理名称"/>
        </n-form-item>
        <n-form-item label="源域名" path="origin">
          <n-input v-model:value="proxyFormValue.origin" :disabled="showModalConf.readOnly" type="text"
                   placeholder="请输入源域名(http://或https://开头)"/>
        </n-form-item>
        <n-form-item label="主机地址" path="host">
          <n-input v-model:value="proxyFormValue.host" :disabled="true" type="text"
                   placeholder="主机地址(系统生成)"/>
        </n-form-item>
        <n-collapse :default-expanded-names="[showModalConf.readOnly?'1':'']">
          <n-collapse-item title="高级配置" name="1">
            <n-form-item label="图片质量" path="quality">
              <n-input v-model:value="proxyFormValue.quality" :disabled="showModalConf.readOnly" value="80"
                       type="number" placeholder="请输入图片质量(1-100)"/>
            </n-form-item>
            <n-form-item label="用户代理(UA)" path="user_agent">
              <n-input v-model:value="proxyFormValue.user_agent" :disabled="showModalConf.readOnly" type="text"
                       placeholder="请输入用户代理(UA)"/>
            </n-form-item>
            <n-form-item label="访问限制(CORS)" path="cors">
              <n-input v-model:value="proxyFormValue.cors" :disabled="showModalConf.readOnly" type="text"
                       placeholder="请输入访问限制(CORS)"/>
            </n-form-item>
            <n-form-item label="状态" path="status">
              <n-select v-model:value="proxyFormValue.status" :disabled="showModalConf.readOnly"
                        :options="proxyStatusOptions" placeholder="请选择状态"/>
            </n-form-item>
          </n-collapse-item>
        </n-collapse>

      </n-form>
      <template #action>
        <div class="modal-footer">
          <n-button class="item" type="warning" @click="showModalConf.show=false">取消</n-button>
          <n-button class="item" type="primary" v-if="showModalConf.isCreate" @click="onCreateProxyClick">添加
          </n-button>
          <n-button class="item" type="primary" v-if="showModalConf.isUpdate" @click="onUpdateProxyClick">修改
          </n-button>
        </div>
      </template>
    </n-modal>

    <ModalTipsComponent ref="modalTipsRef"/>

  </div>
</template>

<script>
import {defineComponent, h, onBeforeMount, reactive, ref} from "vue";
import {NButton, NDataTable, NSpace, NTag, useMessage} from "naive-ui";
import ModalTipsComponent from "@/components/ModalTipsComponent.vue";
import api from "@/api/index.js";
import format from '@/utils/format.js'

const createColumns = ({opProxyShow, opProxyUpdate, opProxyUpdateStatus, opProxyDelete}) => {
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
      },
      defaultSortOrder: false,
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 2
      }
    },
    {
      title: "创建时间",
      key: "created_at",
      render(row) {
        return format.formatDateTime(row.created_at)
      },
      defaultSortOrder: false,
      sorter: {
        compare: (a, b) => format.formatToUnixTime(a.created_at) - format.formatToUnixTime(b.created_at),
        multiple: 2
      }
    },
    {
      title: '操作',
      key: 'A',
      render(row) {
        const ops = []
        const style = {
          marginLeft: '5px',
          marginRight: '5px',
          marginTop: '5px',
          marginBottom: '5px',
        }
        ops.push(h(NButton, {
          class: 'op-btn',
          strong: 'strong',
          secondary: 'secondary',
          style: style,
          onClick: () => opProxyShow(row),
        }, {
          default: () => '详情'
        }))

        ops.push(h(NButton, {
          class: 'op-btn',
          type: 'warning',
          strong: 'strong',
          secondary: 'secondary',
          style: style,
          onClick: () => opProxyUpdate(row),
        }, {
          default: () => '编辑'
        }))

        if (row.status === 1) {
          ops.push(h(NButton, {
            class: 'op-btn',
            type: 'warning',
            strong: 'strong',
            secondary: 'secondary',
            style: style,
            onClick: () => {
              if (row.status === 1) {
                row.status = 0
              } else {
                row.status = 1
              }
              opProxyUpdateStatus(row)
            },
          }, {
            default: () => '禁用'
          }))
        } else {
          ops.push(h(NButton, {
            class: 'op-btn',
            type: 'info',
            strong: 'strong',
            style: style,
            secondary: 'secondary',
            onClick: () => {
              if (row.status === 1) {
                row.status = 0
              } else {
                row.status = 1
              }
              opProxyUpdateStatus(row)
            },
          }, {
            default: () => '启用'
          }))
        }

        ops.push(h(NButton, {
          class: 'op-btn',
          type: 'error',
          strong: 'strong',
          style: style,
          secondary: 'secondary',
          onClick: () => opProxyDelete(row),
        }, {
          default: () => '删除'
        }))
        return ops
      }
    }
  ];
};

const proxyList = ref([])

const modalTipsRef = ref(null)

const showModalConf = ref({
  show: false,
  readOnly: false,
  isCreate: false,
  isUpdate: false,
})

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
  proxyFormRef.value = null

  showModalConf.value = {
    show: true,
    readOnly: false,
    isCreate: true,
    isUpdate: false,
  }

  proxyFormValue.value = {
    quality: '80',
    status: 1,
  }
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
      modalTipsRef.value.showSuccess({'message': resp.data.msg})
      showModalConf.value.show = false

      loadProxyList()

    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })

  })
}

const onUpdateProxyClick = () => {
  console.log('[proxyFormRef', proxyFormRef)
  proxyFormRef.value?.validate(error => {
    if (error) {
      modalTipsRef.value.showError({'message': error[0][0].message ?? '表单输入错误'})
      return
    }
    const id = +proxyFormValue.value.id
    const data = {
      title: proxyFormValue.value.title,
      origin: proxyFormValue.value.origin,
      quality: +proxyFormValue.value.quality,
      user_agent: proxyFormValue.value.user_agent,
      cors: proxyFormValue.value.cors,
      referer: proxyFormValue.value.referer,
      status: +proxyFormValue.value.status,
    }
    if (id <= 0) {
      modalTipsRef.value.showError({'message': '更新数据异常'})
      return
    }
    api.UpdateProxy(id, data).then(resp => {
      console.log('[resp]', resp)
      modalTipsRef.value.showSuccess({'message': resp.data.msg})
      showModalConf.value.show = false

      loadProxyList()

    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })

  })

}

const loadProxyList = () => {
  api.ListProxy({limit: pagination.pageSize, page: pagination.page}).then(resp => {
    proxyList.value = resp.data.data
    pagination.itemCount = resp.data.total
  }).catch(error => {
    modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  }).finally(() => {
  })
}

const onBeforeMountHandler = () => {
  loadProxyList()
}

const opProxyShow = (row) => {
  showModalConf.value = {
    show: true,
    readOnly: true,
    isCreate: false,
    isUpdate: false,
  }

  row.id = '' + row.id
  row.quality = '' + row.quality
  proxyFormValue.value = Object.assign({}, row)
}

const opProxyUpdate = (row) => {
  showModalConf.value = {
    show: true,
    readOnly: false,
    isCreate: false,
    isUpdate: true,
  }

  row.id = '' + row.id
  row.quality = '' + row.quality
  proxyFormValue.value = Object.assign({}, row)
}

const opProxyUpdateStatus = (row) => {
  const id = +row.id
  const data = {
    title: row.title,
    origin: row.origin,
    quality: +row.quality,
    user_agent: row.user_agent,
    cors: row.cors,
    referer: row.referer,
    status: +row.status,
  }
  if (id <= 0) {
    modalTipsRef.value.showError({'message': '未选择更新数据'})
    return
  }
  api.UpdateProxy(id, data).then(resp => {
    console.log('[resp]', resp)
    modalTipsRef.value.showSuccess({'message': resp.data.msg})
    showModalConf.value.show = false

    loadProxyList()

  }).catch(error => {
    modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
  }).finally(() => {
  })
}

const opProxyDelete = (row) => {
  if (+row.id <= 0) {
    modalTipsRef.value.showError({'message': '未选择删除数据'})
    return
  }
  modalTipsRef.value.showConfirm({'message': `确定删除 <b>${row.title}</b>？`}, () => {
    api.DeleteProxy(row.id).then(resp => {
      console.log('[resp]', resp)
      modalTipsRef.value.showSuccess({'message': resp.data.msg})
      showModalConf.value.show = false

      loadProxyList()
    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })
  })
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  onChange: (page) => {
    console.log('[onChange]', page)
    pagination.page = page
    loadProxyList()
  },
  onUpdatePageSize: (pageSize) => {
    console.log('[onUpdatePageSize]', pageSize)
  },
})

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
      columns: createColumns({opProxyShow, opProxyUpdate, opProxyUpdateStatus, opProxyDelete}),
      pagination,
      showModalConf,
      modalTipsRef,
      onShowCreateProxyClick,
      onCreateProxyClick,
      onUpdateProxyClick,
      proxyFormValue,
      proxyFormRef,
      proxyFormRules,
      proxyStatusOptions,
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