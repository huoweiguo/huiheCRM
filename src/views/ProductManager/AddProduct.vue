<template>
  <template v-if="isPermission">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" :inline="true" status-icon>
      <el-form-item label="产品类型" prop="type">
        <el-select v-model="ruleForm.type" class="m-2" placeholder="请选择产品类型" style="width: 192px">
          <el-option label="智能+影院" value="1" />
          <el-option label="灯具" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="ruleForm.model" placeholder="请输入型号" />
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input v-model="ruleForm.brand" placeholder="请输入品牌" />
      </el-form-item>
      <el-form-item label="系统单价" prop="systemUnitPrice">
        <el-input v-model="ruleForm.systemUnitPrice" placeholder="请输入系统单价" />
      </el-form-item>
      <el-form-item label="含税成本单价" prop="unitPriceIncludingTax">
        <el-input v-model="ruleForm.unitPriceIncludingTax" placeholder="请输入含税成本单价" />
      </el-form-item>
      <el-form-item label="未税成本单价" prop="unitPriceExcludingTax">
        <el-input v-model="ruleForm.unitPriceExcludingTax" placeholder="请输入未含税成本单价" disabled />
      </el-form-item>
    </el-form>
    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      <el-button id="resetBtn" @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </template>
  <template v-else>
    <div style="padding: 30px; text-align: center">无权限</div>
  </template>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useProductStore } from '@/store/product'
const ruleFormRef = ref<FormInstance>()
const useProduct = useProductStore()

interface RuleForm {
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
const ruleForm = reactive<RuleForm>({
  type: '1',
  name: '',
  model: '',
  brand: '',
  systemUnitPrice: '',
  unitPriceIncludingTax: '',
  unitPriceExcludingTax: ''
})
const rules = reactive<FormRules<RuleForm>>({})

// 获取是否权限
const isPermission = ref<boolean>(false)
useProduct.hasPermission().then(res => {
  if (res.data.code === 200) {
    isPermission.value = res.data.data
  } else {
    ElMessage.error(res.data.msg)
  }
})

watch(
  () => ruleForm.unitPriceIncludingTax,
  (newVal: any) => {
    ruleForm.unitPriceExcludingTax = (newVal / 1.13)?.toFixed(2)
  }
)

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(valid => {
    if (valid) {
      useProduct.createItem(ruleForm).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('新增产品成功')
          const resetBtn: HTMLButtonElement = document.querySelector('#resetBtn') as HTMLButtonElement
          resetBtn.click()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
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
