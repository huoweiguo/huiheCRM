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
    const getProjectSettleList = (data: RuleSearch) => {
      return http.get('/projectSettlement/list', data)
    }
    const getProjectSettleDetail = (id: String | Number) => {
      return http.get(`/projectSettlement/${id}`)
    }
    const addProjectSettle = (data: RuleSearch) => {
      return http.post('/projectSettlement', data)
    }
    const updateProjectSettle = (data: RuleSearch) => {
      return http.put('/projectSettlement', data)
    }
    const deleteProjectSettle = (id: string) => {
      return http.delete('/projectSettlement', id)
    }

    const getFunction = (data: RuleSearch) => {
      return http.get('/projectSettlement/function', data)
    }
    const getFunctions = (data: RuleSearch) => {
      return http.get('/projectSettlement/functions', data)
    }

    // 修改项目计算公式
    const editFunction = (data: RuleSearch) => {
      return http.put('/projectSettlement/editFunction', data)
    }

    // 修改项目计算公式
    const editSingleFunction = (data: RuleSearch) => {
      return http.put('/projectSettlement/editSingleFunction', data)
    }

    // 最终汇算
    const getSettlementReduce = (data: RuleSearch) => {
      return http.get('/projectSettlement/settlementReduce', data)
    }

    // 最终汇算
    const getAmountSum = (data: RuleSearch) => {
      return http.get('/project/amountSum', data)
    }

    return {
      getAmountSum,
      getSettlementReduce,
      saleTeam,
      getProgramList,
      createProgram,
      updateProgram,
      getProgramDetail,
      deleteProgramItem,
      saleLevel,
      getProjectSettleList,
      getProjectSettleDetail,
      addProjectSettle,
      updateProjectSettle,
      deleteProjectSettle,
      getFunctions,
      getFunction,
      editFunction,
      editSingleFunction
    }
  },
  { persist: true }
)
