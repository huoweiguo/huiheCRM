import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/utils/http'

interface LoginInfos {
  username: string
  password: string
  code: string
  uuid: string
}

interface userInfo {
  [index: string]: unknown
}

export const useLoginStore = defineStore(
  'main',
  () => {
    const token = ref<string>('')
    const userInfo = ref<userInfo>({})
    const login = (data: LoginInfos, config: any) => {
      return http.post(`/login`, { ...data }, config)
    }

    const getCode = () => {
      return http.get(`/captchaImage`)
    }

    const getUserInfo = () => {
      return http.get('/getInfo')
    }

    const logOut = () => {
      return http.post('/logout')
    }

    const getRouters = () => {
      return http.get('/getRouters')
    }

    return {
      token,
      userInfo,
      getRouters,
      login,
      logOut,
      getCode,
      getUserInfo
    }
  },
  { persist: true }
)
