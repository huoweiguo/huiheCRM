<template>
  <div class="form-box" v-if="loadingd">
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="140px" :inline="true" status-icon>
      <div>
        <el-form-item label="签约金额" prop="contractAmount">
          <el-input v-model="ruleForm.contractAmount" placeholder="请输入签约金额，保留2位小数" />
        </el-form-item>
        <el-form-item label="销售团队">
          <el-select v-model="ruleForm.saleGroup" class="m-2" placeholder="请选择销售团队" style="width: 192px">
            <el-option v-for="item in useProgram.saleTeam" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商务">
          {{ employee1 }}
          <el-select v-model="employee1" multiple class="m-2" placeholder="请选择商务" style="width: 192px">
            <el-option v-for="item in useRole.businessList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="灯具销售">
          {{ employee2 }}
          <el-select v-model="employee2" multiple class="m-2" placeholder="请选择灯具销售" style="width: 192px">
            <el-option v-for="item in useRole.lightSalesList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理">
          {{ employee3 }}
          <el-select v-model="employee3" multiple class="m-2" placeholder="请选择项目经理" style="width: 192px">
            <el-option v-for="item in useRole.projectManagerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="灯具项目经理">
          {{ employee4 }}
          <el-select v-model="employee4" multiple class="m-2" placeholder="请选择灯具项目经理" style="width: 192px">
            <el-option v-for="item in useRole.lightProjectManagerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品开票比例" prop="productRate">
          <el-input v-model="ruleForm.productRate" placeholder="请输入产品开票比例"></el-input>
        </el-form-item>
        <el-form-item label="产品开票金额" prop="productAmount">
          <el-input v-model="ruleForm.productAmount" placeholder="请输入产品开票金额" />
        </el-form-item>
        <el-form-item label="服务费开票比例" prop="serviceRate">
          <el-input v-model="ruleForm.serviceRate" placeholder="请输入服务费开票比例" />
        </el-form-item>
        <el-form-item label="服务费开票金额" prop="serviceAmount">
          <el-input v-model="ruleForm.serviceAmount" placeholder="请输入服务费开票金额" />
        </el-form-item>
      </div>

      <!--推荐-->
      <Tuijian v-model:form="ruleForm.popularize"></Tuijian>

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

      <!--产品录入-->
      <Luru v-model:form="ruleForm.product"></Luru>

      <!-- 其他税费 -->
      <Qita v-model:form="ruleForm.cost"></Qita>

      <!--未含税-->
      <Shui :form="ruleForm" @changeItem="changeItem"></Shui>

      <!--商务-->
      <Shangwu :form="ruleForm" @changeItem="changeItem"></Shangwu>
    </el-form>

    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">保存</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useProgramStore } from '@/store/program'
import { useRoleStore } from '@/store/role'

import Tuijian from './blocks/Tuijian.vue'
import Kaipiao from './blocks/Kaipiao.vue'
import Shoupiao from './blocks/Shoupiao.vue'
import Shoukuan from './blocks/Shoukuan.vue'
import Fukuan from './blocks/Fukuan.vue'
import Luru from './blocks/Luru.vue'
import Shui from './blocks/Shui.vue'
import Shangwu from './blocks/Shangwu.vue'
import Qita from './blocks/Qita.vue'

const props = defineProps(['proTabData', 'category'])

const emit = defineEmits(['save'])

const loading = ref(false)
const loadingd = ref(false)
const ruleFormRef = ref<FormInstance>()
const useProgram = useProgramStore()
const useRole = useRoleStore()
const route = useRoute()

interface FormValue {
  [key: string]: any
}
interface BillValue {
  [key: string]: any
}
interface employeeValue {
  type: number
  employee: any[]
}

const ruleForm = ref({
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
  //
  taxFreePrice: '',
  promotionalPaymentsImage: '',
  operatingExpenseRatio: '',
  remark: '',
  popularize: [],
  bill: [],
  product: [],
  employee: [],
  cost: []
})

const bill1 = ref({} as BillValue)
const bill2 = ref({} as BillValue)
const bill3 = ref({} as BillValue)
const bill4 = ref({} as BillValue)

// 员工安排 职位类型 1 商务 2 灯具销售 3 项目经理 4 灯具项目经理
const employee1 = ref([])
const employee2 = ref([])
const employee3 = ref([])
const employee4 = ref([])

// 获取详情
useProgram.getProjectSettleDetail(props.proTabData.id).then(d => {
  loadingd.value = true
  if (d.data.code == 200) {
    ruleForm.value = Object.assign({}, ruleForm.value, d.data.data)

    ruleForm.value.employee.forEach((item: any) => {
      if (item.type == 1) {
        employee1.value = item.employee || []
      }
      if (item.type == 2) {
        employee2.value = item.employee || []
      }
      if (item.type == 3) {
        employee3.value = item.employee || []
      }
      if (item.type == 4) {
        employee4.value = item.employee || []
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
      employee1.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 1, employee: employee1.value }) // 商务
      employee2.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 2, employee: employee2.value }) // 灯具销售
      employee3.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 3, employee: employee3.value }) // 项目经理
      employee4.value.length > 0 && (ruleForm.value.employee as employeeValue[]).push({ type: 4, employee: employee4.value }) // 灯具项目经理

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
</script>

<style lang="less" scoped></style>
