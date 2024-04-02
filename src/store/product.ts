import { defineStore } from 'pinia'
import http from '@/utils/http'

interface ProductInfos {
  type: string
  name: string
  model: string
  brand: string
  pageSize: number
  pageNum: number
}

interface RuleProduct {
  id?: string
  name?: string
  type: string
  model?: string
  brand?: string
  systemUnitPrice?: string
  unitPriceIncludingTax?: string
  unitPriceExcludingTax?: string
  quantitySoldOut?: string
  remark?: string
}

export const useProductStore = defineStore('product', () => {
  const getProductList = (params: ProductInfos) => {
    return http.get('/product/list', params)
  }
  const deleteItem = (data: string) => {
    return http.delete('/product', data)
  }
  const createItem = (data: RuleProduct) => {
    return http.post('/product', data)
  }
  const editItem = (data: RuleProduct) => {
    return http.put('/product', data)
  }
  const importProducts = (data: any) => {
    return http.post('/product/import', data)
  }
  const hasPermission = () => {
    return http.get('/product/hasPermission')
  }
  return {
    editItem,
    createItem,
    getProductList,
    deleteItem,
    importProducts,
    hasPermission
  }
})
