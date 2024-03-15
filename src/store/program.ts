import { defineStore } from 'pinia'
import http from '@/utils/http'
import { ref } from 'vue'

interface RuleSearch {
  [key: string]: unknown
}

export const useProgramStore = defineStore(
  'program',
  () => {
    const saleTeam = ref<RuleSearch[]>([])
    const getProgramList = (data: RuleSearch) => {
      return http.get('/project/list', data)
    }
    const createProgram = (data: RuleSearch) => {
      return http.post('/project', data)
    }
    const updateProgram = (data: RuleSearch) => {
      return http.put('/project', data)
    }
    const getProgramDetail = (data: string) => {
      return http.getUrl('/project', data)
    }
    const deleteProgramItem = (data: string) => {
      return http.delete('/project', data)
    }
    const saleLevel = () => {
      return http.get('/projectSettlement/statistic')
    }
    const getProjectSettle = (data: string) => {
      return http.getUrl('/projectSettlement', data)
    }
    return {
      saleTeam,
      getProgramList,
      createProgram,
      updateProgram,
      getProgramDetail,
      deleteProgramItem,
      saleLevel,
      getProjectSettle
    }
  },
  { persist: true }
)
