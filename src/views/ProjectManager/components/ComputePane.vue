<template>
  <el-form ref="ruleFormRef" :model="ruleForm"  label-width="140px" :inline="true" status-icon>
    <h3 class="h3_title mb20">智能+影院项目汇算公示</h3>
    <el-form-item label="商务提成率" prop="businessExpenseRatio">
      <el-input v-model="ruleForm.cinema.businessExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售副总提成率" prop="saleAgmExpenseRatio">
      <el-input v-model="ruleForm.cinema.saleAgmExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售总监提成率" prop="sdExpenseRatio">
      <el-input v-model="ruleForm.cinema.sdExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="项目经理提成率" prop="pmExpenseRatio">
      <el-input v-model="ruleForm.cinema.pmExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="项目总监提成率" prop="pdExpenseRatio">
      <el-input v-model="ruleForm.cinema.pdExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="安装调试员提成率" prop="commissionerExpenseRatio">
      <el-input v-model="ruleForm.cinema.commissionerExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <h3 class="h3_title mb20 mt40">灯具项目汇算公式</h3>
    <el-form-item label="商务提成率" prop="businessExpenseRatio">
      <el-input v-model="ruleForm.light.businessExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售副总提成率" prop="saleAgmExpenseRatio">
      <el-input v-model="ruleForm.light.saleAgmExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售总监提成率" prop="sdExpenseRatio">
      <el-input v-model="ruleForm.light.sdExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="灯具销售提成率" prop="pmExpenseRatio">
      <el-input v-model="ruleForm.light.pmExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="灯具项目经理提成率" prop="pdExpenseRatio">
      <el-input v-model="ruleForm.light.pdExpenseRatio">
        <template #append>%</template>
      </el-input>
    </el-form-item>
  </el-form>
  <div style="padding-left: 120px">
    <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
    "cinema": {
      "id": 0,
      "type": 0,
      "businessExpenseRatio": 0,
      "saleAgmExpenseRatio": 0,
      "sdExpenseRatio": 0,
      "pmExpenseRatio": 0,
      "pdExpenseRatio": 0,
      "commissionerExpenseRatio": 0,
      "remark": ""
    },
    "light": {
      "id": 0,
      "type": 0,
      "businessExpenseRatio": 0,
      "saleAgmExpenseRatio": 0,
      "sdExpenseRatio": 0,
      "pmExpenseRatio": 0,
      "pdExpenseRatio": 0,
      "commissionerExpenseRatio": 0,
      "remark": ""
    }
  })

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
</script>

<style scoped></style>
