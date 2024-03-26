<template>
  <div>
    <el-form-item label="未税成本总价">
      <el-input v-model="ruleForm.num1" disabled />
    </el-form-item>
    <el-form-item label="去税面价">
      <el-input v-model="ruleForm.num2" @input="iptChange('taxFreePrice', $event)" />
    </el-form-item>
    <el-form-item label="净价">
      <el-input v-model="ruleForm.num3" disabled />
    </el-form-item>
    <el-form-item label="净折扣">
      <el-input v-model="ruleForm.num4" disabled />
    </el-form-item>
    <el-form-item label="施工成本">
      <el-input v-model="ruleForm.num5" @input="iptChange('shigongChengben', $event)" />
    </el-form-item>
    <el-form-item label="总推广费">
      <el-input v-model="ruleForm.num6" @input="iptChange('promotionExpenses', $event)" />
    </el-form-item>
    <el-form-item label="运营费用率(%)">
      <el-input v-model="ruleForm.num7" @input="limitIpt($event, 'num7')" />
    </el-form-item>
    <el-form-item label="运营费用">
      <el-input v-model="ruleForm.num8" disabled @input="iptChange('operatingExpenseRatio', $event)" />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
const props = defineProps(['form'])
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

onMounted(() => {
  ruleForm.num2 = props.form.taxFreePrice
  ruleForm.num6 = props.form.promotionExpenses
  ruleForm.num8 = props.form.operatingExpenseRatio
})

// 未税成本总价
watch(
  () => props.form.product,
  value => {
    if (value)
      ruleForm.num1 = parseFloat(
        value
          .map((d: { totalCostExcludingTax: any }) => d.totalCostExcludingTax)
          .reduce((p: any, c: any) => p + c, 0)
          ?.toFixed(2)
      )
  },
  { deep: true }
)
watch(
  () => ruleForm.num7,
  value => {
    ruleForm.num8 = parseFloat((((props.form.contractAmount || 0) * value) / 100).toFixed(2))
    iptChange('operatingExpenseRatio', ruleForm.num8)
  },
  { deep: true }
)

// 净价
watch(
  () => [props.form.contractAmount, ruleForm.num6],
  (value, oldValue) => {
    value[0] = value[0] || 0
    ruleForm.num3 = parseFloat((value[0] - value[1]).toFixed(2))
    iptChange('jingjia', ruleForm.num3)
  }
)

// 净折扣价
watch(
  () => [ruleForm.num2, ruleForm.num3],
  (value, oldValue) => {
    ruleForm.num4 = parseFloat((value[0] / value[1]).toFixed(2))
  }
)

const iptChange = (key: String, value: string | number) => {
  emit('changeItem', key, value)
}

const limitIpt = (value: string, key: 'num7') => {
  ruleForm[key] = Math.min(parseFloat(value) || 0, 100)
}
</script>

<style lang="less" scoped></style>
