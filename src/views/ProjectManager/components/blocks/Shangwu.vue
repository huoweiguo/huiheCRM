<template>
  <el-form-item label="商务提成率">
    <el-input v-model="ruleForm.num1" disabled />
  </el-form-item>
  <el-form-item label="商务提成">
    <el-input v-model="ruleForm.num2" disabled />
  </el-form-item>
  <el-form-item label="销售副总提成率">
    <el-input v-model="ruleForm.num3" disabled />
  </el-form-item>
  <el-form-item label="销售副总提成">
    <el-input v-model="ruleForm.num4" disabled />
  </el-form-item>
  <el-form-item label="销售总监提成率">
    <el-input v-model="ruleForm.num5" disabled />
  </el-form-item>
  <el-form-item label="销售总监提成">
    <el-input v-model="ruleForm.num6" disabled />
  </el-form-item>
  <el-form-item label="项目经理提成率">
    <el-input v-model="ruleForm.num7" disabled />
  </el-form-item>
  <el-form-item label="项目经理提成">
    <el-input v-model="ruleForm.num8" disabled />
  </el-form-item>
  <el-form-item label="项目总监提成率">
    <el-input v-model="ruleForm.num9" disabled />
  </el-form-item>
  <el-form-item label="项目总监提成">
    <el-input v-model="ruleForm.num10" disabled />
  </el-form-item>
  <el-form-item label="深化提成率">
    <el-input v-model="ruleForm.num11" disabled />
  </el-form-item>
  <el-form-item label="深化提成">
    <el-input v-model="ruleForm.num12" disabled />
  </el-form-item>
  <el-form-item label="安装调试员提成率">
    <el-input v-model="ruleForm.num13" disabled />
  </el-form-item>
  <el-form-item label="安装调试员提成">
    <el-input v-model="ruleForm.num14" disabled />
  </el-form-item>
  <el-form-item label="成本总计">
    <el-input v-model="ruleForm.num15" disabled />
  </el-form-item>
  <el-form-item label="项目利润">
    <el-input v-model="ruleForm.num16" disabled />
  </el-form-item>
  <el-form-item label="公司利润">
    <el-input v-model="ruleForm.num17" disabled />
  </el-form-item>
  <el-form-item label="公司利润率">
    <el-input v-model="ruleForm.num18" disabled />
  </el-form-item>
  <el-form-item label="毛利率">
    <el-input v-model="ruleForm.num19" disabled />
  </el-form-item>
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
  num8: 0,
  num9: 0,
  num10: 0,
  num11: 0,
  num12: 0,
  num13: 0,
  num14: 0,
  num15: 0,
  num16: 0,
  num17: 0,
  num18: 0,
  num19: 0
})

watch(
  () => props.form.product,
  value => {
    //监听多个源用数组传入
    console.log('value2,', value)
  },
  { deep: true }
)

const iptChange = (key: String, value: string | number) => {
  emit('changeItem',key,value)
}
</script>

<style lang="less" scoped></style>
