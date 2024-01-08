<template>
  <div>
    <div class="m-card m-card-title">
      <div>代理列表</div>
      <n-button strong secondary type="success" @click="onShowCreateProxyClick">创建代理</n-button>
    </div>
    <div class="m-card">
      <n-space vertical :size="12">
        <n-data-table
            :bordered="false"
            :single-line="false"
            :columns="columns"
            :data="data"
            :pagination="pagination"/>
      </n-space>
    </div>

    <n-modal v-model:show="showModal" preset="card" style="width: 800px">
      <template #header>添加代理</template>
      <n-form ref="proxyFormRef" :model="proxyFormValue" :rules="proxyFormRules">
        <n-form-item label="代理名称" path="title">
          <n-input v-model:value="proxyFormValue.title" type="text" placeholder="请输入代理名称"/>
        </n-form-item>
        <n-form-item label="源域名" path="origin">
          <n-input v-model:value="proxyFormValue.origin" type="text" placeholder="请输入源域名(http://或https://开头)"/>
        </n-form-item>
        <n-collapse>
          <n-collapse-item title="高级配置">
            <n-form-item label="图片质量" path="quality">
              <n-input v-model:value="proxyFormValue.quality" type="number" placeholder="请输入图片质量(1-100)"/>
            </n-form-item>
            <n-form-item label="用户代理(UA)" path="user_agent">
              <n-input v-model:value="proxyFormValue.user_agent" type="text" placeholder="请输入用户代理(UA)"/>
            </n-form-item>
            <n-form-item label="访问限制(CORS)" path="cors">
              <n-input v-model:value="proxyFormValue.cors" type="text" placeholder="请输入访问限制(CORS)"/>
            </n-form-item>
            <n-form-item label="状态" path="status">
              <n-select v-model:value="proxyFormValue.status" :options="proxyStatusOptions" placeholder="请选择状态"/>
            </n-form-item>
          </n-collapse-item>
        </n-collapse>

      </n-form>
      <template #action>
        <div class="modal-footer">
          <n-button class="item" type="warning" @click="showModal=false">取消</n-button>
          <n-button class="item" type="primary" @click="onCreateProxyClick">添加</n-button>
        </div>
      </template>
    </n-modal>

    <ModalTipsComponent ref="modalTipsRef"/>

  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import {NButton, NDataTable, NSpace, useMessage} from "naive-ui";
import ModalTipsComponent from "@/components/ModalTipsComponent.vue";
import api from "@/api/index.js";


const createColumns = () => {
  return [
    {
      title: "序号",
      key: "id"
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
      key: "status"
    },
    {
      title: "创建时间",
      key: "created_at"
    },

    // {
    //   title: "Tags",
    //   key: "tags",
    //   render(row) {
    //     const tags = row.tags.map((tagKey) => {
    //       return h(
    //           NTag,
    //           {
    //             style: {
    //               marginRight: "6px"
    //             },
    //             type: "info",
    //             bordered: false
    //           },
    //           {
    //             default: () => tagKey
    //           }
    //       );
    //     });
    //     return tags;
    //   }
    // },
    // {
    //   title: "Action",
    //   key: "actions",
    //   render(row) {
    //     return h(
    //         NButton,
    //         {
    //           size: "small",
    //           onClick: () => sendMail(row)
    //         },
    //         {default: () => "Send Email"}
    //     );
    //   }
    // }
  ];
};

const createData = () => [
  // {
  //   key: 0,
  //   name: "John Brown",
  //   age: 32,
  //   address: "New York No. 1 Lake Park",
  //   tags: ["nice", "developer"]
  // },
  // {
  //   key: 1,
  //   name: "Jim Green",
  //   age: 42,
  //   address: "London No. 1 Lake Park",
  //   tags: ["wow"]
  // },
  // {
  //   key: 2,
  //   name: "Joe Black",
  //   age: 32,
  //   address: "Sidney No. 1 Lake Park",
  //   tags: ["cool", "teacher"]
  // }
];

const modalTipsRef = ref(null)
const showModal = ref(true)
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
    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })

  })
}

export default defineComponent({
  components: {
    ModalTipsComponent,
    NSpace, NDataTable, NButton
  },
  setup() {
    const message = useMessage();
    return {
      data: createData(),
      columns: createColumns(),
      pagination: {
        pageSize: 10
      },
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

</style>