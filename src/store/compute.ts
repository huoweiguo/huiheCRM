import { defineStore } from 'pinia'
import http from '@/utils/http'

interface RuleComputeParams {
  cinema: {
    [key: string]: unknown
  }
  light: {
    [key: string]: unknown
  }
}

export const useComputeStore = defineStore('compute', () => {
  const getCompute = () => {
    return http.get('/computationalFormula')
  }
  const modifyCompute = (data: RuleComputeParams) => {
    return http.put('/computationalFormula', data)
  }
  return {
    getCompute,
    modifyCompute
  }
})
