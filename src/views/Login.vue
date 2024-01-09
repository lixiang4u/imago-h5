<template>
  <div>
    <n-form class="form" ref="formRef" :rules="rules" :model="formValue">
      <n-form-item class="form-item" path="email" label="邮箱">
        <n-input v-model:value="formValue.email" type="text" placeholder="请输入用户名或邮箱地址"/>
      </n-form-item>
      <n-form-item class="form-item" path="password" label="密码">
        <n-input v-model:value="formValue.password" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <div class="form-item">
        <n-button type="primary" class="login-btn" @click="onClickLogin">登录</n-button>
      </div>
      <n-form-item class="form-item content-right grey">
        没有账号？
        <router-link to="/register">注册</router-link>
      </n-form-item>
    </n-form>

    <ModalTipsComponent ref="modalTipsRef"/>

  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import api from "@/api/index.js";
import ModalTipsComponent from '@/components/ModalTipsComponent.vue'
import localStorage from "@/utils/localstorage.js";

let route = null
let router = null
const formRef = ref(null)
const formValue = ref({
  email: null,
  password: null,
})

const modalTipsRef = ref(null)

const onBeforeMountHandler = () => {
  formValue.value.email = route.query['email']
}

const rules = {
  email: [{
    required: true,
    validator(rule, value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return new Error('邮箱地址格式错误');
      }
      return true;
    }
  }],
  password: [{
    required: true,
    validator(rule, value) {
      if (!value || value.length < 6) {
        return new Error('请填写密码');
      }
      return true;
    }
  }]
}

const onClickLogin = () => {
  formRef.value?.validate(error => {
    if (error) {
      modalTipsRef.value.showError({'message': error[0][0].message ?? '表单输入错误'})
      return
    }
    const d = {email: formValue.value.email, password: formValue.value.password, version: '1.0'}
    api.UserLogin(d).then(resp => {
      localStorage.setAccessToken(resp.data.data['access_token'])
      localStorage.setRefreshToken(resp.data.data['refresh_token'])
      localStorage.setNickname(resp.data.data['nickname'])
      router.push('/home')
    }).catch(error => {
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    })
  })
}


export default defineComponent({
  components: {
    ModalTipsComponent
  },
  setup() {
    console.log('[setup]')
    route = useRoute()
    router = useRouter()
    onBeforeMount(onBeforeMountHandler)

    return {
      modalTipsRef,
      formValue,
      formRef,
      rules,
      onClickLogin,
    };
  }
})

</script>

<style scoped>

.content-right {
  justify-items: right;
}

.grey {
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

  .login-btn {
    width: 100%;
  }
}
</style>