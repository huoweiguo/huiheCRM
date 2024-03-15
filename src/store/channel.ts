import { defineStore } from 'pinia'
import http from '@/utils/http'

interface RuleForm {
  [key: string]: unknown
}

export const useChannelStore = defineStore('channel', () => {
  const queryChannelList = (data: RuleForm) => {
    return http.get('/channelTrace/list', data)
  }
  const createChannel = (data: RuleForm) => {
    return http.post('/channelTrace', data)
  }
  const updateChannel = (data: RuleForm) => {
    return http.put('/channelTrace', data)
  }
  const queryChannelDetail = (data: string) => {
    return http.getUrl('/channelTrace', data)
  }
  const deleteChannelItem = (data: string) => {
    return http.delete('/channelTrace', data)
  }
  const queryChannelOrder = (data: string) => {
    return http.getUrl('/channelTrace/orders', data)
  }
  const queryMaintenance = (data: string) => {
    return http.getUrl('/channelTrace/maintain', data)
  }
  return {
    queryChannelList,
    createChannel,
    updateChannel,
    queryChannelDetail,
    deleteChannelItem,
    queryChannelOrder,
    queryMaintenance
  }
})
