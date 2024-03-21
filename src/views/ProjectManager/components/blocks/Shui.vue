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
      <el-input v-model="ruleForm.num5" />
    </el-form-item>
    <el-form-item label="总推广费">
      <el-input v-model="ruleForm.num6" />
    </el-form-item>
    <el-form-item label="运营费用率">
      <el-input v-model="ruleForm.num7" />
    </el-form-item>
    <el-form-item label="运营费用">
      <el-input v-model="ruleForm.num8" disabled />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
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

watch(
  () => props.form.product,
  value => {
    //监听多个源用数组传入
    if (value)
      ruleForm.num1 = value
        .map(d => d.totalCostExcludingTax)
        .reduce((p, c) => p + c, 0)
        ?.toFixed(2)
  },
  { deep: true }
)

const iptChange = (key: String, value: string | number) => {
  emit('changeItem', key, value)
}
</script>

<style lang="less" scoped></style>
