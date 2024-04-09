<template>
  <div>
    <div class="cinema">
      <el-form-item label="添加推荐人">
        <el-button type="primary" icon="plus" @click="visible = true">添加</el-button>
      </el-form-item>
      <div class="mb20 pl140">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="referrersType" label="推荐人类型" />
          <el-table-column prop="referrersName" label="推荐人姓名" />
          <el-table-column prop="promotionRatio" label="推广费比例" />
          <el-table-column prop="promotionAmount" label="推广费金额" />
          <el-table-column prop="paidAmount" label="已付推广费" />
          <el-table-column prop="paidPromotionRatio" label="已付推广费比例" />
          <el-table-column prop="paidDate" label="已付推广费日期" />
          <el-table-column prop="paidPaidAmount" label="已付推广费金额" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="delrow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--添加推荐人-->
    <el-dialog v-model="visible" title="添加推荐人信息" width="750" align-center>
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :inline="true">
        <el-form-item label="推荐人类型" prop="referrersType">
          <el-input v-model="ruleForm.referrersType" placeholder="请输入推荐人类型" />
        </el-form-item>
        <el-form-item label="推荐人姓名" prop="referrersName">
          <el-input v-model="ruleForm.referrersName" placeholder="请输入推荐人姓名" />
        </el-form-item>
        <el-form-item label="推广费比例" prop="promotionRatio">
          <el-input v-model="ruleForm.promotionRatio" placeholder="请输入推广费比例" />
        </el-form-item>
        <el-form-item label="推广费金额" prop="promotionAmount">
          <el-input v-model="ruleForm.promotionAmount" placeholder="请输入推广费金额" />
        </el-form-item>
        <el-form-item label="已付推广费比例" prop="paidPromotionRatio">
          <el-input v-model="ruleForm.paidPromotionRatio" placeholder="请输入已付推广费比例" />
        </el-form-item>
        <el-form-item label="已付推广费" prop="paidAmount">
          <el-input v-model="ruleForm.paidAmount" placeholder="请输入已付推广费" />
        </el-form-item>
        <el-form-item label="已付推广费日期" prop="paidDate">
          <el-date-picker v-model="ruleForm.paidDate" type="date" placeholder="请选择已付推广费日期" style="width: 192px" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="已付推广费金额" prop="paidPaidAmount">
          <el-input v-model="ruleForm.paidPaidAmount" placeholder="请输入已付推广费金额" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

const emit = defineEmits(['update:form', 'changeItem'])
const props = defineProps(['form'])
const ruleFormRef = ref<FormInstance>()
const visible = ref(false)
const paidDate = ref('')
const tableData = ref([] as any)

const ruleForm = reactive({
  referrersType: '',
  referrersName: '',
  promotionRatio: '',
  promotionAmount: '',
  paidAmount: '',
  paidPromotionRatio: '',
  paidPaidAmount: '',
  paidDate: '',
  remark: ''
})

function isEmpty(obj: Record<string, string>): boolean {
  return Object.keys(obj).every(key => {
    return obj[key] === null || obj[key] === undefined || obj[key] === ''
  })
}

tableData.value = props.form

const save = (ruleFormRef: FormInstance | undefined) => {
  visible.value = false
  if (!isEmpty(ruleForm)) {
    tableData.value.push({ ...ruleForm })
    emit('update:form', tableData)
  }
  resetForm(ruleFormRef)
}

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
}

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
</script>
