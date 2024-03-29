<template>
  <div>
    <el-form-item label="未税成本总价">
      <el-input v-model="ruleForm.num1" disabled />
    </el-form-item>
    <el-form-item label="去税面价">
      <el-input v-model="ruleForm.num2" :disabled="disabled" @input="iptChange('taxFreePrice', $event)" />
    </el-form-item>
    <el-form-item label="净价">
      <el-input v-model="ruleForm.num3" disabled />
    </el-form-item>
    <el-form-item label="净折扣">
      <el-input v-model="ruleForm.num4" disabled />
    </el-form-item>
    <el-form-item label="施工成本">
      <el-input v-model="ruleForm.num5" :disabled="disabled" @input="iptChange('shigongChengben', $event)" />
    </el-form-item>
    <el-form-item label="总推广费">
      <el-input v-model="ruleForm.num6" :disabled="disabled" @input="iptChange('promotionExpenses', $event)" />
    </el-form-item>
    <el-form-item label="运营费用率(%)">
      <el-input v-model="ruleForm.num7" :disabled="disabled" @input="limitIpt($event, 'num7')" />
    </el-form-item>
    <el-form-item label="运营费用">
      <el-input v-model="ruleForm.num8" disabled />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, watchEffect } from 'vue'
const props = defineProps(['form', 'disabled'])
const emit = defineEmits(['changeItem'])

const ruleForm = reactive({
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
  num5: 0,
  num6: 0,
  num7: 0,
  num8: 0
})

const iptChange = (key: String, value: string | number) => {
  emit('changeItem', key, value)
}

const limitIpt = (value: string, key: 'num7') => {
  if (value.slice(-1) === '.') return
  ruleForm[key] = Math.min(parseFloat(value) || 0, 100)
  iptChange('operatingExpenseRatio', ruleForm.num7)
}

onMounted(() => {
  ruleForm.num2 = props.form.taxFreePrice || 0
  ruleForm.num6 = props.form.promotionExpenses || 0
  ruleForm.num7 = props.form.operatingExpenseRatio || 0
})

watchEffect(() => {
  console.log('计算2')
  ruleForm.num1 = parseFloat(props.form.product.map((d: { totalCostExcludingTax: any }) => d.totalCostExcludingTax).reduce((p: any, c: any) => p + c, 0))
  // num1 向下取整保留两位小数
  ruleForm.num1 = parseFloat((Math.floor(ruleForm.num1 * 100) / 100).toFixed(2))

  ruleForm.num8 = parseFloat(((props.form.contractAmount || 0) * (ruleForm.num7 / 100)).toFixed(2))
  ruleForm.num3 = parseFloat((props.form.contractAmount - ruleForm.num6).toFixed(2))
  ruleForm.num4 = parseFloat((ruleForm.num3 / ruleForm.num2).toFixed(2))
  iptChange('jingjia', ruleForm.num3)
  iptChange('yunyingfeiyong', ruleForm.num8)
})
</script>

<style lang="less" scoped></style>
