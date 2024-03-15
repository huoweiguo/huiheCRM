<template>
  <div class="login-container">
    <div class="login-form">
      <h3>慧合CRM管理系统</h3>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
        <el-form-item prop="username">
          <el-input prefix-icon="user-filled" v-model="ruleForm.username" size="large" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="lock" v-model="ruleForm.password" type="password" size="large" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input prefix-icon="key" v-model="ruleForm.code" size="large" placeholder="请输入验证码">
            <template #append><img class="code-image" :src="codeSrc" /></template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-button class="login-btn" id="loginBtn" size="large" type="primary" :loading="loading" @click="login(ruleFormRef)">登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useLoginStore } from '@/store/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
interface FormType {
  username: string
  password: string
  code: string
  uuid: string
}
const router = useRouter()
const userLogin = useLoginStore()
const codeSrc = ref('')
const rules = ref<FormRules<FormType>>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})
const ruleForm = reactive<FormType>({
  username: '',
  password: '',
  code: '',
  uuid: ''
})

const login = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      userLogin.login(ruleForm, {}).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('登录成功')
          userLogin.token = res.data.data.token
          localStorage.setItem('token', res.data.data.token)
          setTimeout(() => {
            router.push('/')
          }, 700)
        } else {
          ElMessage.error(res.data.msg)
          getCode()
        }
        loading.value = false
      })
    } else {
      console.log('error submit!', fields)
      loading.value = false
    }
  })
}

// 获取验证码
const getCode = () => {
  userLogin.getCode().then(res => {
    if (res.data.code === 200) {
      codeSrc.value = `data:image/png;base64,${res.data.data.img}`
      ruleForm.uuid = res.data.data.uuid || ''
    }
  })
}

const fromClick = (ev: KeyboardEvent) => {
  if (ev.keyCode === 13) {
    const loginBtn: HTMLButtonElement = document.querySelector('#loginBtn') as HTMLButtonElement
    loginBtn.click()
  }
}

onMounted(() => {
  getCode()
  window.addEventListener('keydown', fromClick, false)
})

onUnmounted(() => {
  window.removeEventListener('keydown', fromClick)
})
</script>

<style lang="scss">
.login-form {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('@/assets/login-bj.jpg');
  .code-image {
    height: 40px;
  }
  .login-form {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    .login-btn {
      width: 100%;
    }
    h3 {
      text-align: center;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .el-input {
      font-size: 14px;
      margin-bottom: 5px;
    }
  }
}
</style>
