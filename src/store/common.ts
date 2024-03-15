import { defineStore } from 'pinia'
import http from '@/utils/http'

export const commonStore = defineStore('common', () => {
  const getRuleSelectList = () => {
    return http.get('/role/available')
  }
  const getTeamSelectList = () => {
    return http.get('/department/available')
  }

  return {
    getRuleSelectList,
    getTeamSelectList
  }
})
