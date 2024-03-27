import { defineStore } from 'pinia'
import http from '@/utils/http'

export const commonStore = defineStore('common', () => {
  const getRuleSelectList = () => {
    return http.get('/role/available')
  }
  const getTeamSelectList = () => {
    return http.get('/department/available')
  }

  const getOssImgs = (ossIds: string) => {
    return http.get(`/oss/listByIds/${ossIds}`)
  }

  return {
    getRuleSelectList,
    getTeamSelectList,
    getOssImgs
  }
})
