<template>
  <div>
    <n-form class="form" :rules="rules">
      <n-form-item class="form-item" path="email" label="邮箱">
        <n-input v-model:value="email" type="text" placeholder="请输入用户名或邮箱地址"/>
      </n-form-item>
      <n-form-item class="form-item" path="password" label="密码">
        <n-input v-model:value="password" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <div class="form-item">
        <n-button type="primary" class="login-btn">登录</n-button>
      </div>
      <n-form-item class="form-item content-right grey">
        没有账号？<router-link to="/register">注册</router-link>
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";

export default defineComponent({
  components: [],
  setup() {
    const rules = {
      email: [{
        required: true
      }],
      password: [{
        required: true
      }]
    }

    return {
      email: ref(null),
      password: ref(null),
      rules: rules,
    };
  }
})

</script>

<style scoped>

.content-right{
  justify-items: right;
}
.grey{
  color: #c3c3c3;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-item {
  width: 400px;

  .login-btn{
    width: 100%;
  }
}
</style>