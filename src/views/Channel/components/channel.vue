<template>
  <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :inline="true" status-icon>
    <el-form-item label="公司名称" prop="companyName">
      <el-input v-model="ruleForm.companyName" />
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <el-input v-model="ruleForm.principal" />
    </el-form-item>
    <el-form-item label="职位" prop="position">
      <el-input v-model="ruleForm.position" />
    </el-form-item>
    <el-form-item label="公司地址" prop="companyAddress">
      <el-input v-model="ruleForm.companyAddress" />
    </el-form-item>
    <el-form-item label="家庭地址" prop="familyAddress">
      <el-input v-model="ruleForm.familyAddress" />
    </el-form-item>
    <el-form-item label="所属商务" prop="name">
      <el-select v-model="businessValue" class="m-2" multiple placeholder="请选择" style="width: 192px" @change="changeBusiness">
        <el-option v-for="item in businessList" :key="item.userId" :label="item.nickName" :value="item.nickName + '_' + item.userId" />
      </el-select>
    </el-form-item>
    <el-form-item label="所属副总" prop="name">
      <el-select v-model="scheduleValue" class="m-2" multiple placeholder="请选择" style="width: 192px" @change="changeSchedule">
        <el-option v-for="item in scheduleList" :key="item.userId" :label="item.nickName" :value="item.nickName + '_' + item.userId" />
      </el-select>
    </el-form-item>
    <el-form-item label="年度提单数量" prop="annualOrders">
      <el-input v-model="ruleForm.annualOrders" />
    </el-form-item>
    <el-form-item label="年度签约金额" prop="annualAmount">
      <el-input v-model="ruleForm.annualAmount" />
    </el-form-item>
    <el-form-item label="提单项目" prop="projectOrder">
      <el-input v-model="ruleForm.projectOrder" type="textarea" style="width: 192px" />
    </el-form-item>
    <el-form-item label="维护情况" prop="maintainRecords">
      <el-input v-model="ruleForm.maintainRecords" type="textarea" style="width: 192px" />
    </el-form-item>
  </el-form>
  <div style="padding-left: 120px">
    <el-button type="primary" @click="submitForm(ruleFormRef)" v-hasPermi="['channel:add:save']">保存</el-button>
    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect, defineEmits, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useRoleStore } from '@/store/role'
import { useChannelStore } from '@/store/channel'
const ruleFormRef = ref<FormInstance>()
const emits = defineEmits(['visibleEmit'])
interface scheduleRule {
  userId: string
  nickName: string
}

interface EmployeeRule {
  type: string
  employees: DataRule[]
}

interface DataRule {
  employeeId: string
  employeeName: string
}
interface RuleForm {
  id?: string
  companyAddress: string
  companyName: string
  principal: string
  familyAddress: string
  position: string
  annualOrders: string
  annualAmount: string
  projectOrder: string
  maintainRecords: string
  employee: EmployeeRule[]
}

const ruleForm = reactive<RuleForm>({
  id: '',
  companyAddress: '',
  familyAddress: '',
  companyName: '',
  principal: '',
  position: '',
  annualOrders: '',
  annualAmount: '',
  projectOrder: '',
  maintainRecords: '',
  employee: [
    {
      type: '1',
      employees: []
    },
    {
      type: '5',
      employees: []
    }
  ]
})
const useRole = useRoleStore()
const useChannel = useChannelStore()
const business = ref<DataRule[]>([])
const schedule = ref<DataRule[]>([])
const businessValue = ref<string[]>([])
const scheduleValue = ref<string[]>([])
const businessList = ref<scheduleRule[]>([])
const scheduleList = ref<scheduleRule[]>([])
const props = defineProps({
  ids: String,
  isModify: Boolean
})

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(valid => {
    if (valid) {
      props.isModify ? updateChannel(ruleFormRef) : createChannel(ruleFormRef)
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  businessValue.value = []
  scheduleValue.value = []
}

const updateChannel = (ruleFormRef: FormInstance | undefined) => {
  console.log(business.value, schedule.value)
  ruleForm.employee[0].employees = business.value.length ? business.value : []
  ruleForm.employee[1].employees = schedule.value.length ? schedule.value : []
  useChannel.updateChannel(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改渠道跟进成功')
      ruleFormRef?.resetFields()
      emits('visibleEmit')
      business.value = []
      schedule.value = []
      businessValue.value = []
      scheduleValue.value = []
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
const createChannel = (ruleFormRef: FormInstance | undefined) => {
  ruleForm.employee[0].employees = business.value.length ? business.value : []
  ruleForm.employee[1].employees = schedule.value.length ? schedule.value : []
  useChannel.createChannel(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('新增渠道跟进成功')
      ruleFormRef?.resetFields()
      business.value = []
      schedule.value = []
      businessValue.value = []
      scheduleValue.value = []
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const changeBusiness = (value: []) => {
  business.value = []
  if (value.length > 0) {
    value.forEach((v: string) => {
      const newValue = v.split('_')
      business.value = [...business.value, { employeeName: newValue[0], employeeId: newValue[1] }]
    })
  }
}

const changeSchedule = (value: []) => {
  schedule.value = []
  if (value.length > 0) {
    value.forEach((v: string) => {
      const newValue = v.split('_')
      schedule.value = [...schedule.value, { employeeName: newValue[0], employeeId: newValue[1] }]
    })
  }
}

const dealArrayByType = (data: DataRule[]): string[] => {
  let arr: string[] = []
  data.map(v => {
    arr.push(`${v.employeeName}_${v.employeeId}`)
  })
  return arr
}

watchEffect(() => {
  if (props.ids != '-1' && props.ids) {
    useChannel.queryChannelDetail(props.ids).then(res => {
      if (res.data.code === 200) {
        const { id, companyAddress, familyAddress, companyName, principal, position, annualOrders, annualAmount, projectOrder, maintainRecords, employee } = res.data.data
        ruleForm.id = id
        ruleForm.companyAddress = companyAddress
        ruleForm.familyAddress = familyAddress
        ruleForm.companyName = companyName
        ruleForm.principal = principal
        ruleForm.position = position
        ruleForm.annualOrders = annualOrders
        ruleForm.annualAmount = annualAmount
        ruleForm.projectOrder = projectOrder
        ruleForm.maintainRecords = maintainRecords

        if (employee.length) {
          employee.map((item: { [key: string]: unknown }) => {
            if (item.type == '1') {
              businessValue.value = dealArrayByType(item.employees as DataRule[])
              business.value = item.employees as DataRule[]
            } else if (item.type == '5') {
              scheduleValue.value = dealArrayByType(item.employees as DataRule[])
              schedule.value = item.employees as DataRule[]
            }
          })
          console.log(businessValue.value, scheduleValue.value)
        } else {
          businessValue.value = []
          scheduleValue.value = []
        }
      }
    })
  }
})

onMounted(() => {
  useRole.queryUserByType({ type: '1' }).then(res => {
    if (res.data.code === 200) {
      businessList.value = res.data.data
    }
  })

  useRole.queryUserByType({ type: '5' }).then(res => {
    if (res.data.code === 200) {
      scheduleList.value = res.data.data
    }
  })
})
</script>

<style scoped></style>
