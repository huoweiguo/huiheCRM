import { defineStore } from 'pinia'
import http from '@/utils/http'

interface userRule {
  [key: string]: unknown
}

export const useProjectStore = defineStore('project', () => {
  const queryProjectList = (data: userRule) => {
    return http.get('/projectTrace/list', data)
  }
  const createProject = (data: userRule) => {
    return http.post('/projectTrace', data)
  }
  const updateProject = (data: userRule) => {
    return http.put('/projectTrace', data)
  }
  const deletProject = (data: string) => {
    return http.delete('/projectTrace', data)
  }
  const getProjectDetail = (data: string) => {
    return http.getUrl('/projectTrace', data)
  }
  const queryTrace = (data: string) => {
    return http.getUrl('/projectTrace/trace', data)
  }
  return {
    queryProjectList,
    createProject,
    deletProject,
    updateProject,
    getProjectDetail,
    queryTrace
  }
})
