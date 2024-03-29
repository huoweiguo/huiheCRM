<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="170px" :inline="true" status-icon>
    <el-form-item label="公司名称" prop="projectName">
      <el-input v-model="ruleForm.projectName" />
    </el-form-item>
    <el-form-item label="所属商务">
      <el-select v-model="businessValue" class="m-2" multiple placeholder="请选择" style="width: 192px" @change="changeBusiness">
        <el-option v-for="item in businessList" :key="item.userId" :label="item.nickName" :value="item.nickName + '_' + item.userId" />
      </el-select>
    </el-form-item>
    <el-form-item label="所属副总">
      <el-select v-model="scheduleValue" class="m-2" multiple placeholder="请选择" style="width: 192px" @change="changeSchedule">
        <el-option v-for="item in scheduleList" :key="item.userId" :label="item.nickName" :value="item.nickName + '_' + item.userId" />
      </el-select>
    </el-form-item>
    <el-form-item label="CRM报备/有效报备" prop="crm">
      <el-input v-model="ruleForm.crm" />
    </el-form-item>
    <el-form-item label="本月必签" prop="requireSignIn">
      <el-input v-model="ruleForm.requireSignIn" />
    </el-form-item>
    <el-form-item label="是否已签" prop="signIn">
      <el-input v-model="ruleForm.signIn" />
    </el-form-item>
    <el-form-item label="展厅参观" prop="exhibitionHallVisit">
      <el-input v-model="ruleForm.exhibitionHallVisit" />
    </el-form-item>
    <el-form-item label="别墅/平层" prop="construction">
      <el-input v-model="ruleForm.construction" />
    </el-form-item>
    <el-form-item label="预计签单日期" prop="contractDate">
      <el-date-picker v-model="ruleForm.contractDate" type="datetime" placeholder="请选择预计签单日期" style="width: 170px" value-format="YYYY-MM-DD hh:mm:ss"></el-date-picker>
    </el-form-item>
    <el-form-item label="项目面积" prop="projectArea">
      <el-input v-model="ruleForm.projectArea" />
    </el-form-item>
    <el-form-item label="方案预算（万）" prop="schemeBudget">
      <el-input v-model="ruleForm.schemeBudget" />
    </el-form-item>
    <el-form-item label="预计业主预算（万）" prop="proprietorBudget">
      <el-input v-model="ruleForm.proprietorBudget" />
    </el-form-item>
    <el-form-item label="项目进度" prop="projectProgress">
      <el-input v-model="ruleForm.projectProgress" />
    </el-form-item>
    <el-form-item label="项目来源" prop="projectSource">
      <el-input v-model="ruleForm.projectSource" />
    </el-form-item>
    <el-form-item label="竞品品牌" prop="contendBrand">
      <el-input v-model="ruleForm.contendBrand" />
    </el-form-item>
    <el-form-item label="跟进情况（数据更新日期）" prop="traceRecord">
      <el-input v-model="ruleForm.traceRecord" type="textarea" style="width: 192px" />
    </el-form-item>
  </el-form>
  <div style="padding-left: 120px">
    <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, defineEmits, defineProps, watchEffect } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useProjectStore } from '@/store/project'
import { useRoleStore } from '@/store/role'

interface DataRule {
  employeeId: string
  employeeName: string
}
interface EmployeeRule {
  type: string
  employees: DataRule[]
}
interface scheduleRule {
  userId: string
  nickName: string
}

const ruleFormRef = ref<FormInstance>()
const useProject = useProjectStore()
const useRole = useRoleStore()
const business = ref<DataRule[]>([])
const schedule = ref<DataRule[]>([])
const businessValue = ref<string[]>([])
const scheduleValue = ref<string[]>([])
const props = defineProps({
  ids: String,
  isModify: Boolean
})
const emits = defineEmits(['visibleEmit'])

const businessList = ref<scheduleRule[]>([])
const scheduleList = ref<scheduleRule[]>([])

interface RuleForm {
  id: string
  projectName: string
  schedule: string
  crm: string
  requireSignIn: string
  signIn: string
  exhibitionHallVisit: string
  construction: string
  contractDate: string
  projectArea: string
  schemeBudget: string
  proprietorBudget: string
  projectProgress: string
  projectSource: string
  contendBrand: string
  traceRecord: string
  employee: EmployeeRule[]
}
const ruleForm = reactive<RuleForm>({
  id: '',
  schedule: '1',
  projectName: '',
  crm: '',
  requireSignIn: '',
  signIn: '',
  exhibitionHallVisit: '',
  construction: '',
  contractDate: '',
  projectArea: '',
  schemeBudget: '',
  proprietorBudget: '',
  projectProgress: '',
  projectSource: '',
  contendBrand: '',
  traceRecord: '',
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
const rules = reactive<FormRules<RuleForm>>({})

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

const createProject = (ruleFormRef: FormInstance | undefined) => {
  ruleForm.employee[0].employees = business.value.length ? business.value : []
  ruleForm.employee[1].employees = schedule.value.length ? schedule.value : []
  useProject.createProject(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('新增项目跟进成功')
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

const updateProject = (ruleFormRef: FormInstance | undefined) => {
  ruleForm.employee[0].employees = business.value.length ? business.value : []
  ruleForm.employee[1].employees = schedule.value.length ? schedule.value : []
  useProject.updateProject(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改成功')
      ruleFormRef?.resetFields()
      emits('visibleEmit')
      businessValue.value = []
      scheduleValue.value = []
      business.value = []
      schedule.value = []
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(valid => {
    if (valid) {
      ruleForm.id = props.ids as string
      props.isModify ? updateProject(ruleFormRef) : createProject(ruleFormRef)
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
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
    useProject.getProjectDetail(props.ids).then(res => {
      if (res.data.code === 200) {
        const {
          id,
          projectName,
          construction,
          contendBrand,
          crm,
          requireSignIn,
          signIn,
          exhibitionHallVisit,
          contractDate,
          projectArea,
          schemeBudget,
          proprietorBudget,
          projectProgress,
          projectSource,
          traceRecord,
          employee
        } = res.data.data
        ruleForm.id = id
        ruleForm.projectName = projectName
        ruleForm.construction = construction
        ruleForm.contendBrand = contendBrand
        ruleForm.crm = crm
        ruleForm.requireSignIn = requireSignIn
        ruleForm.signIn = signIn
        ruleForm.exhibitionHallVisit = exhibitionHallVisit
        ruleForm.contractDate = contractDate
        ruleForm.projectArea = projectArea
        ruleForm.schemeBudget = schemeBudget
        ruleForm.proprietorBudget = proprietorBudget
        ruleForm.projectProgress = projectProgress
        ruleForm.projectSource = projectSource
        ruleForm.traceRecord = traceRecord
        //ruleForm.employee = employee

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
