<template>
  <div class="form-box" v-if="loadingd">
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="170px" :inline="true" status-icon>
      <div>
        <el-form-item label="签约金额" prop="contractAmount">
          <el-input v-model="ruleForm.contractAmount" placeholder="请输入签约金额，保留2位小数" @input="JS_contractAmount" />
        </el-form-item>
        <el-form-item label="销售团队">
          <el-select v-model="ruleForm.saleGroup" class="m-2" placeholder="请选择销售团队" style="width: 192px">
            <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商务">
          <el-select v-model="employee1" multiple class="m-2" placeholder="请选择商务" style="width: 192px">
            <el-option v-for="item in businessList" :key="item.userId" :label="item.nickName" :value="`${item.userId}||${item.nickName}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="灯具销售">
          <el-select v-model="employee2" multiple class="m-2" placeholder="请选择灯具销售" style="width: 192px">
            <el-option v-for="item in lightSalesList" :key="item.userId" :label="item.nickName" :value="`${item.userId}||${item.nickName}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理">
          <el-select v-model="employee3" multiple class="m-2" placeholder="请选择项目经理" style="width: 192px">
            <el-option v-for="item in projectManagerList" :key="item.userId" :label="item.nickName" :value="`${item.userId}||${item.nickName}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="灯具项目经理">
          <el-select v-model="employee4" multiple class="m-2" placeholder="请选择灯具项目经理" style="width: 192px">
            <el-option v-for="item in lightProjectManagerList" :key="item.userId" :label="item.nickName" :value="`${item.userId}||${item.nickName}`" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品开票比例" prop="productRate">
          <el-input v-model="ruleForm.productRate" placeholder="请输入产品开票比例" @input="JS_productRate"></el-input>
        </el-form-item>
        <el-form-item label="产品开票金额" prop="productAmount">
          <el-input v-model="ruleForm.productAmount" placeholder="请输入产品开票金额" @input="JS_productAmount" />
        </el-form-item>
        <el-form-item label="服务费开票比例" prop="serviceRate">
          <el-input v-model="ruleForm.serviceRate" placeholder="请输入服务费开票比例" @input="JS_serviceRate" />
        </el-form-item>
        <el-form-item label="服务费开票金额" prop="serviceAmount">
          <el-input v-model="ruleForm.serviceAmount" placeholder="请输入服务费开票金额" @input="JS_serviceAmount" />
        </el-form-item>
      </div>

      <!--推荐-->
      <Tuijian v-model:form="ruleForm.popularize" @changeItem="changeItem"></Tuijian>

      <!--开票-->
      <Kaipiao v-model:form="bill1"></Kaipiao>

      <!--收票-->
      <Shoupiao v-model:form="bill2"></Shoupiao>

      <!--收款-->
      <Shoukuan v-model:form="bill3"></Shoukuan>

      <!--付款-->
      <Fukuan v-model:form="bill4"></Fukuan>

      <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" type="textarea" maxlength="300" placeholder="请输入" show-word-limit style="width: 400px" />
      </el-form-item>

      <!-- 推广支付图片 -->
      <el-form-item label="推广支付图片">
        <TuiGuangImg v-model:form="ruleForm.promotionalPaymentsImage"></TuiGuangImg>
      </el-form-item>

      <!--产品录入-->
      <Luru v-model:form="ruleForm.product"></Luru>

      <!-- 附件模块 -->
      <Fujian v-model:form="ruleForm.annex"></Fujian>

      <!-- 其他税费 -->
      <Qita v-model:form="ruleForm.cost"></Qita>

      <div style="min-width: 2230px">
        <!--未含税-->
        <Shui :form="ruleForm" @changeItem="changeItem"></Shui>

        <!--商务-->
        <Suspense>
          <template #default>
            <Shangwu :form="ruleForm" @changeItem="changeItem">
              <template #item>
                <el-form-item label="开票成本" prop="invoiceCost">
                  <el-input v-model="ruleForm.invoiceCost" placeholder="请输入开票成本" />
                </el-form-item>
              </template>
            </Shangwu>
          </template>
          <template #fallback>
            <div>计算中...</div>
          </template>
        </Suspense>
      </div>
    </el-form>

    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">保存</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useProgramStore } from '@/store/program'
import { useRoleStore } from '@/store/role'
import { commonStore } from '@/store/common'

import Tuijian from './blocks/Tuijian.vue'
import Kaipiao from './blocks/Kaipiao.vue'
import Shoupiao from './blocks/Shoupiao.vue'
import Shoukuan from './blocks/Shoukuan.vue'
import Fukuan from './blocks/Fukuan.vue'
import Luru from './blocks/Luru.vue'
import Shui from './blocks/Shui.vue'
import Shangwu from './blocks/Shangwu.vue'
import Fujian from './blocks/Fujian.vue'
import Qita from './blocks/Qita.vue'
import TuiGuangImg from './blocks/TuiGuangImg.vue'

const props = defineProps(['proTabData', 'category'])

const emit = defineEmits(['save'])
const teamList = ref<Team[]>([])
const loading = ref(false)
const loadingd = ref(false)
const ruleFormRef = ref<FormInstance>()
const useProgram = useProgramStore()
const useRole = useRoleStore()
const route = useRoute()
const useCommon = commonStore()

const businessList = ref<any[]>([])
const lightSalesList = ref<any[]>([])
const projectManagerList = ref<any[]>([])
const lightProjectManagerList = ref<any[]>([])

interface Team {
  id: number
  name: string
}

interface FormValue {
  [key: string]: any
}
interface BillValue {
  [key: string]: any
}
interface employeeValue {
  type: number
  employees: any[]
}

interface FunctionValue {
  [key: string]: any
}

const ruleForm = ref({
  id: '',
  projectId: route.params.id,
  category: props.category, // 1、智能+影院项目汇算 2、灯具项目汇算
  type: props.proTabData.type, // 1、初始项目 2、增减项目
  settleName: props.proTabData.settleName,
  contractAmount: '',
  saleGroup: '',
  productRate: '',
  productAmount: '',
  serviceRate: '',
  serviceAmount: '',
  invoiceCost: '',
  promotionExpenses: '',
  //
  taxFreePrice: '',
  promotionalPaymentsImage: '',
  operatingExpenseRatio: '',
  remark: '',
  popularize: [],
  bill: [],
  product: [],
  employee: [],
  cost: [],
  annex: [],
  constructionCost: '',
  taxDeduction: '',

  // 计算公式ID
  functions: {} as FunctionValue
})

const bill1 = ref({} as BillValue)
const bill2 = ref({} as BillValue)
const bill3 = ref({} as BillValue)
const bill4 = ref({} as BillValue)

// 员工安排 职位类型 1 商务 2 灯具销售 3 项目经理 4 灯具项目经理
const employee1 = ref([] as Array<string>)
const employee2 = ref([] as Array<string>)
const employee3 = ref([] as Array<string>)
const employee4 = ref([] as Array<string>)

// 获取团队
useCommon.getTeamSelectList().then(res => {
  if (res.data.code === 200) {
    teamList.value = res.data.data
  }
})

useRole.queryUserByType({ type: '1' }).then(res => {
  if (res.data.code === 200) {
    businessList.value = res.data.data
  }
})
useRole.queryUserByType({ type: '2' }).then(res => {
  if (res.data.code === 200) {
    lightSalesList.value = res.data.data
  }
})
useRole.queryUserByType({ type: '3' }).then(res => {
  if (res.data.code === 200) {
    projectManagerList.value = res.data.data
  }
})
useRole.queryUserByType({ type: '4' }).then(res => {
  if (res.data.code === 200) {
    lightProjectManagerList.value = res.data.data
  }
})

const encodeVal = (val: Array<any>) => {
  return val.map((item: any) => `${item['employeeId']}||${item['employeeName']}`)
}
const decodeVal = (val: Array<any>) => {
  return val.map((item: any) => {
    return { employeeId: item.split('||')[0], employeeName: item.split('||')[1] }
  })
}

// 获取详情
useProgram.getProjectSettleDetail(props.proTabData.id).then(d => {
  loadingd.value = true
  if (d.data.code == 200) {
    ruleForm.value = Object.assign({}, ruleForm.value, d.data.data)

    ruleForm.value.employee.forEach((item: any) => {
      if (item.type == 1) {
        employee1.value = encodeVal(item.employees || [])
      }
      if (item.type == 2) {
        employee2.value = encodeVal(item.employees || [])
      }
      if (item.type == 3) {
        employee3.value = encodeVal(item.employees || [])
      }
      if (item.type == 4) {
        employee4.value = encodeVal(item.employees || [])
      }
    })

    ruleForm.value.bill.forEach((item: any) => {
      if (item.type == 1) {
        bill1.value = item || {}
      }
      if (item.type == 2) {
        bill2.value = item || {}
      }
      if (item.type == 3) {
        bill3.value = item || {}
      }
      if (item.type == 4) {
        bill4.value = item || {}
      }
    })
  }
})

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      // 合并员工安排
      ruleForm.value.employee = []
      // employeeValue
      employee1.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 1, employees: decodeVal(employee1.value) }) // 商务
      employee2.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 2, employees: decodeVal(employee2.value) }) // 灯具销售
      employee3.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 3, employees: decodeVal(employee3.value) }) // 项目经理
      employee4.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 4, employees: decodeVal(employee4.value) }) // 灯具项目经理

      // 合并项目汇算票据/支付信息
      ruleForm.value.bill = []
      bill1.value.bill?.length > 0 && (ruleForm.value.bill as any[]).push(bill1.value)
      bill2.value.bill?.length > 0 && (ruleForm.value.bill as any[]).push(bill2.value)
      bill3.value.bill?.length > 0 && (ruleForm.value.bill as any[]).push(bill3.value)
      bill4.value.bill?.length > 0 && (ruleForm.value.bill as any[]).push(bill4.value)

      console.log('submit!', ruleForm.value)
      submitData(ruleForm.value)
    }
  })
}

// 保存计算公式
const saveFunction = async (pid: string) => {
  let data = {
    id: ruleForm.value.functions.id,
    settlementId: pid,
    type: props.category, // 1、智能+影院项目汇算 2、灯具项目汇算
    projectId: route.params.id,
    businessExpenseRatio: ruleForm.value.functions.num1,
    saleAgmExpenseRatio: ruleForm.value.functions.num3,
    sdExpenseRatio: ruleForm.value.functions.num5,
    pmExpenseRatio: ruleForm.value.functions.num7,
    pdExpenseRatio: ruleForm.value.functions.num9,
    deepenExpenseRatio: ruleForm.value.functions.num11,
    commissionerExpenseRatio: ruleForm.value.functions.num13
  }

  await useProgram.editSingleFunction(data)
}

// 提交数据
const submitData = async (data: any) => {
  if (props.proTabData.id) data.id = props.proTabData.id
  data.category = props.category

  let res: any = ''
  loading.value = true

  // 如果ID存在修改，否则新增
  if (props.proTabData.id) {
    res = await useProgram.updateProjectSettle(data)
  } else {
    res = await useProgram.addProjectSettle(data)
  }

  if (res.data.code === 200) {
    await saveFunction(props.proTabData.id || res.data.data.settlementId)
    ElMessage.success('保存成功')
    emit('save')
  } else {
    ElMessage.error(res.data.msg)
  }
  loading.value = false
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

// 监听赋值
const changeItem = (key: string, val: any) => {
  ;(ruleForm.value as FormValue)[key] = val
}

// 监听计算
const JS_contractAmount = (newVal: any) => {
  if (ruleForm.value.productRate && newVal) {
    // 产品开票金额=签约金额*产品开票比例
    ruleForm.value.productAmount = (parseFloat(newVal) * (parseFloat(ruleForm.value.productRate) / 100)).toFixed(2)
  }

  if (ruleForm.value.serviceRate && newVal) {
    // 服务开票金额=签约金额*服务开票比例
    ruleForm.value.serviceAmount = (parseFloat(newVal) * (parseFloat(ruleForm.value.serviceRate) / 100)).toFixed(2)
  }
}

const JS_productRate = (newVal: any) => {
  if (newVal.slice(-1) === '.') return
  let newVal_ = Math.min(parseFloat(newVal) || 0, 100)
  ruleForm.value.productRate = newVal_.toString()

  if (ruleForm.value.contractAmount && newVal) {
    // 产品开票金额=签约金额*产品开票比例
    ruleForm.value.productAmount = (parseFloat(ruleForm.value.contractAmount) * (newVal_ / 100)).toFixed(2)
  }
}
const JS_productAmount = (newVal: any) => {
  if (ruleForm.value.contractAmount && newVal) {
    // 产品开票比例=产品开票金额/签约金额
    ruleForm.value.productRate = ((parseFloat(newVal) / parseFloat(ruleForm.value.contractAmount)) * 100).toFixed(2)
  }
}

const JS_serviceRate = (newVal: any) => {
  if (newVal.slice(-1) === '.') return
  let newVal_ = Math.min(parseFloat(newVal) || 0, 100)
  ruleForm.value.serviceRate = newVal_.toString()

  if (ruleForm.value.contractAmount && newVal) {
    // 服务开票金额=签约金额*服务开票比例
    ruleForm.value.serviceAmount = ((parseFloat(ruleForm.value.contractAmount) * newVal_) / 100).toFixed(2)
  }
}

const JS_serviceAmount = (newVal: any) => {
  if (ruleForm.value.contractAmount && newVal) {
    // 服务开票比例=服务开票金额/签约金额
    ruleForm.value.serviceRate = ((parseFloat(newVal) / parseFloat(ruleForm.value.contractAmount)) * 100).toFixed(2)
  }
}
</script>

<style lang="less" scoped></style>
