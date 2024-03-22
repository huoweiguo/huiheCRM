import { defineStore } from 'pinia'
import http from '@/utils/http'
import { ref } from 'vue'
interface userRule {
  [key: string]: unknown
}

export const useRoleStore = defineStore(
  'role',
  () => {
    const businessList = ref<userRule[]>([])
    const scheduleList = ref<userRule[]>([])
    const lightSalesList = ref<userRule[]>([])
    const projectManagerList = ref<userRule[]>([])
    const lightProjectManagerList = ref<userRule[]>([])
    const getUserList = (data: userRule) => {
      return http.get('/user/list', data)
    }
    const modifyUser = (data: userRule) => {
      return http.put('/user', data)
    }
    const createUser = (data: userRule) => {
      return http.post('/user', data)
    }
    const deleteUser = (data: string) => {
      return http.delete('/user', data)
    }
    const queryUserInfoById = (data: string) => {
      return http.getUrl('/user', data)
    }
    const getRoleList = (data: userRule) => {
      return http.get('/role/list', data)
    }
    const queryAvailableRole = () => {
      return http.get('/role/available')
    }
    const deleteRoleById = (data: string) => {
      return http.delete('/role', data)
    }
    const addRole = (data: userRule) => {
      return http.post('/role', data)
    }
    const editRole = (data: userRule) => {
      return http.put('/role', data)
    }
    const getTeamList = (data: userRule) => {
      return http.get('/department/list', data)
    }
    const createTeam = (data: userRule) => {
      return http.post('/department', data)
    }
    const updateTeam = (data: userRule) => {
      return http.put('/department', data)
    }
    const deleteTeamById = (data: string) => {
      return http.delete('/department', data)
    }
    const queryUserByType = (data: userRule) => {
      return http.get('/user/filterUserByType', data)
    }
    return {
      editRole,
      addRole,
      businessList,
      scheduleList,
      lightSalesList,
      lightProjectManagerList,
      projectManagerList,
      getUserList,
      modifyUser,
      createUser,
      queryUserInfoById,
      deleteUser,
      getRoleList,
      queryAvailableRole,
      deleteRoleById,
      getTeamList,
      createTeam,
      updateTeam,
      deleteTeamById,
      queryUserByType
    }
  },
  { persist: true }
)
