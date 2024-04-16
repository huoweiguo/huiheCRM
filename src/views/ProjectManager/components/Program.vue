<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" :inline="true" status-icon>
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="ruleForm.projectName" placeholder="请输入项目名称" />
    </el-form-item>
    <el-form-item label="项目地址" prop="projectAddress">
      <el-input v-model="ruleForm.projectAddress" placeholder="请输入项目地址" />
    </el-form-item>
    <el-form-item label="房屋类型" prop="houseType">
      <el-input v-model="ruleForm.houseType" placeholder="请输入房屋类型" />
    </el-form-item>
    <el-form-item label="客户名称" prop="clientName">
      <el-input v-model="ruleForm.clientName" placeholder="请输入客户名称" />
    </el-form-item>
    <el-form-item label="客户电话" prop="clientPhone">
      <el-input v-model="ruleForm.clientPhone" placeholder="请输入客户电话" />
    </el-form-item>
    <el-form-item label="付款方式" prop="paymentMethod">
      <el-input v-model="ruleForm.paymentMethod" placeholder="请输入付款方式" />
    </el-form-item>
    <el-form-item label="对公公司名称" prop="firmName">
      <el-input v-model="ruleForm.firmName" placeholder="请输入对公公司名称" />
    </el-form-item>
    <el-form-item label="公司税号" prop="firmTin">
      <el-input v-model="ruleForm.firmTin" placeholder="请输入公司税号" />
    </el-form-item>
    <el-form-item label="公司注册地址" prop="firmRegisterAddress">
      <el-input v-model="ruleForm.firmRegisterAddress" placeholder="请输入公司注册地址" />
    </el-form-item>
    <el-form-item label="开户行" prop="firmOpeningBank">
      <el-input v-model="ruleForm.firmOpeningBank" placeholder="请输入开户行" />
    </el-form-item>
    <el-form-item label="开户行账号" prop="firmBankAccount">
      <el-input v-model="ruleForm.firmBankAccount" placeholder="请输入开户行账号" />
    </el-form-item>
    <el-form-item label="项目进度" prop="projectProgress">
      <el-select v-model="ruleForm.projectProgress" class="m-2" placeholder="请选择项目进度" style="width: 192px">
        <el-option v-for="item in projectSchedule" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
  <div style="padding-left: 120px">
    <el-button type="primary" @click="submitForm(ruleFormRef)" v-hasPermi="['project:insert:save']">保存</el-button>
    <el-button id="resetBtn" @click="resetForm(ruleFormRef)">重置</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, defineEmits, defineProps } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { projectSchedule } from '@/utils/fixedData'
import { useProgramStore } from '@/store/program'

interface RuleData {
  id?: string
  projectName: string
  projectAddress: string
  houseType: string
  clientName: string
  clientPhone: string
  paymentMethod: string
  firmName: string
  firmTin: string
  firmRegisterAddress: string
  firmOpeningBank: string
  firmBankAccount: string
  projectProgress: string
  remark: string
}

const ruleForm = reactive<RuleData>({
  id: '',
  projectName: '',
  projectAddress: '',
  houseType: '',
  clientName: '',
  clientPhone: '',
  paymentMethod: '',
  firmName: '',
  firmTin: '',
  firmRegisterAddress: '',
  firmOpeningBank: '',
  firmBankAccount: '',
  projectProgress: '1',
  remark: ''
})

const rules = reactive({})
const ruleFormRef = ref<FormInstance>()
const useProgram = useProgramStore()
const emits = defineEmits(['visibleEmit'])
const props = defineProps({
  ids: String,
  isModify: Boolean
})

const createProgram = () => {
  useProgram.createProgram(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('新增项目成功')
      const resetBtn: HTMLButtonElement = document.querySelector('#resetBtn') as HTMLButtonElement
      resetBtn.click()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const updateProgram = () => {
  useProgram.updateProgram(ruleForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改成功')
      const resetBtn: HTMLButtonElement = document.querySelector('#resetBtn') as HTMLButtonElement
      resetBtn.click()
      emits('visibleEmit')
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
      props.isModify ? updateProgram() : createProgram()
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

watchEffect(() => {
  if (props.ids != '-1' && props.ids) {
    useProgram.getProgramDetail(props.ids).then(res => {
      if (res.data.code === 200) {
        const { id, clientName, projectProgress, projectName, projectAddress, paymentMethod, houseType, firmTin, firmRegisterAddress, firmOpeningBank, firmName, firmBankAccount, clientPhone } =
          res.data.data
        ruleForm.id = id
        ruleForm.clientName = clientName
        ruleForm.projectProgress = JSON.stringify(projectProgress)
        ruleForm.projectName = projectName
        ruleForm.projectAddress = projectAddress
        ruleForm.paymentMethod = paymentMethod
        ruleForm.houseType = houseType
        ruleForm.firmTin = firmTin
        ruleForm.firmRegisterAddress = firmRegisterAddress
        ruleForm.firmOpeningBank = firmOpeningBank
        ruleForm.firmName = firmName
        ruleForm.firmBankAccount = firmBankAccount
        ruleForm.clientPhone = clientPhone
      }
    })
  }
})
</script>
