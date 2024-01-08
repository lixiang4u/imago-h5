<template>
  <div>
    <n-form class="form" ref="formRef" :model="modelValue" :rules="rules">
      <n-form-item class="form-item" path="email" label="邮箱">
        <n-input v-model:value="modelValue.email" type="text" placeholder="请输入用户名或邮箱地址"/>
      </n-form-item>
      <n-form-item class="form-item" path="password" label="密码">
        <n-input v-model:value="modelValue.password" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item class="form-item" path="password2" label="再次输入密码">
        <n-input v-model:value="modelValue.password2" type="password" placeholder="请重新输入密码"/>
      </n-form-item>
      <div class="form-item">
        <n-button type="primary" class="login-btn" @click="handleLoginClick">注册</n-button>
      </div>
      <n-form-item class="form-item content-right grey">
        已有账号？
        <router-link to="/login">登录</router-link>
      </n-form-item>
    </n-form>

    <ModalTipsComponent ref="modalTipsRef"/>

  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import api from "@/api/index.js";
import ErrorFilled from '@vicons/material/ErrorFilled'
import ModalTipsComponent from '@/components/ModalTipsComponent.vue'
import {useRouter} from 'vue-router'

let router = null
const formRef = ref({})
const modelValue = ref({
  email: null,
  password: null,
  password2: null,
})

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
      if (!value || /^\d+$/.test(value) || value.length < 6) {
        return new Error('密码过于简单');
      }
      return true;
    }
  }],
  password2: [{
    required: true,
    validator(rule, value) {
      if (!modelValue.value.password2) {
        return new Error('密码不能为空');
      }
      if (modelValue.value.password !== modelValue.value.password2) {
        return new Error('两次输入密码不同');
      }
      return true;
    }
  }]
}

const modalTipsRef = ref(null)

const handleLoginClick = (e) => {
  formRef.value?.validate((error) => {
    if (error) {
      modalTipsRef.value.showError({'message': error[0][0].message ?? '表单输入错误'})
      return
    }

    const data = {nickname: '', email: modelValue.value.email, password: modelValue.value.password,}
    api.UserRegister(data).then(resp => {
      modalTipsRef.value.showSuccess({'message': '注册成功，即将跳转登录'})
      setTimeout(() => {
        router.push('/login?email=' + data.email)
      }, 3e3)
    }).catch(error => {
      console.log('[xxx]', error)
      modalTipsRef.value.showError({'message': error.message ?? '系统错误'})
    }).finally(() => {
    })

  })
}

export default defineComponent({
  components: {
    ErrorFilled,
    ModalTipsComponent,
  },
  setup() {
    router = useRouter()

    return {
      modalTipsRef,
      formRef,
      modelValue,
      rules,
      handleLoginClick,
      ErrorFilled,
      ModalTipsComponent,
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