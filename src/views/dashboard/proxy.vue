<template>
  <div>
    <div class="m-card m-card-title">
      <div>代理列表</div>
      <n-button strong secondary type="success">创建代理</n-button>
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
  </div>
</template>

<script>
import {defineComponent, h} from "vue";
import {NButton, NDataTable, NSpace, NTag, useMessage} from "naive-ui";

const createColumns = ({sendMail}) => {
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

export default defineComponent({
  components: {
    NSpace, NDataTable, NButton
  },
  setup() {
    const message = useMessage();
    return {
      data: createData(),
      columns: createColumns({
        sendMail(rowData) {
          message.info("send mail to " + rowData.name);
        }
      }),
      pagination: {
        pageSize: 10
      }
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

</style>