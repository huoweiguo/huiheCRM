<template>
  <div>
    <el-form-item label="商务提成率(%)">
      <el-input v-model="ruleForm.num1" :disabled="disabled" @input="limitIpt($event, 'num1')" />
    </el-form-item>
    <el-form-item label="商务提成">
      <el-input v-model="ruleForm.num2" disabled />
    </el-form-item>
    <el-form-item label="销售副总分成率(%)">
      <el-input v-model="ruleForm.num3" :disabled="disabled" @input="limitIpt($event, 'num3')" />
    </el-form-item>
    <el-form-item label="销售副总提成">
      <el-input v-model="ruleForm.num4" disabled />
    </el-form-item>
    <el-form-item label="销售总监提成率(%)">
      <el-input v-model="ruleForm.num5" :disabled="disabled" @input="limitIpt($event, 'num5')" />
    </el-form-item>
    <el-form-item label="销售总监提成">
      <el-input v-model="ruleForm.num6" disabled />
    </el-form-item>

    <!-- category == 1 -->
    <template v-if="props.form.category == 1">
      <el-form-item label="项目经理提成率(%)">
        <el-input v-model="ruleForm.num7" :disabled="disabled" @input="limitIpt($event, 'num7')" />
      </el-form-item>
      <el-form-item label="项目经理提成">
        <el-input v-model="ruleForm.num8" disabled />
      </el-form-item>
      <el-form-item label="项目总监提成率(%)">
        <el-input v-model="ruleForm.num9" :disabled="disabled" @input="limitIpt($event, 'num9')" />
      </el-form-item>
      <el-form-item label="项目总监提成">
        <el-input v-model="ruleForm.num10" disabled />
      </el-form-item>
      <el-form-item label="深化提成率(%)">
        <el-input v-model="ruleForm.num11" :disabled="disabled" @input="limitIpt($event, 'num11')" />
      </el-form-item>
      <el-form-item label="深化提成">
        <el-input v-model="ruleForm.num12" disabled />
      </el-form-item>
      <el-form-item label="安装调试员提成率(%)">
        <el-input v-model="ruleForm.num13" :disabled="disabled" @input="limitIpt($event, 'num13')" />
      </el-form-item>
      <el-form-item label="安装调试员提成">
        <el-input v-model="ruleForm.num14" disabled />
      </el-form-item>
    </template>

    <!-- category == 2 -->
    <template v-if="props.form.category == 2">
      <el-form-item label="灯具销售提成率(%)">
        <el-input v-model="ruleForm.num7" :disabled="disabled" @input="limitIpt($event, 'num7')" />
      </el-form-item>
      <el-form-item label="灯具销售提成">
        <el-input v-model="ruleForm.num8" disabled />
      </el-form-item>
      <el-form-item label="灯具项目经理提成率(%)">
        <el-input v-model="ruleForm.num9" :disabled="disabled" @input="limitIpt($event, 'num9')" />
      </el-form-item>
      <el-form-item label="灯具项目经理提成">
        <el-input v-model="ruleForm.num10" disabled />
      </el-form-item>
      <template v-show="false">
        <el-form-item label="深化提成率(%)">
          <el-input v-model="ruleForm.num11" :disabled="disabled" @input="limitIpt($event, 'num11')" />
        </el-form-item>
        <el-form-item label="深化提成">
          <el-input v-model="ruleForm.num12" disabled />
        </el-form-item>
        <el-form-item label="安装调试员提成率(%)">
          <el-input v-model="ruleForm.num13" :disabled="disabled" @input="limitIpt($event, 'num13')" />
        </el-form-item>
        <el-form-item label="安装调试员提成">
          <el-input v-model="ruleForm.num14" disabled />
        </el-form-item>
      </template>
    </template>

    <!-- 对公返点进项税税额可抵(专票) -->
    <el-form-item label="对公返点进项税税额可抵(专票)">
      <el-input v-model="ruleForm.num20" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue'
import { useProgramStore } from '@/store/program'
import { useRoute } from 'vue-router'

const useProgram = useProgramStore()
const route = useRoute()
const props = defineProps(['form', 'disabled'])
const emit = defineEmits(['changeItem'])
const projectId = route.params.id

const ruleForm = reactive({
  id: '',
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
  num19: 0,
  num20: 0
})

// 获取计算数据
let res = await useProgram.getFunction({ settlementId: props.form.id, projectId, type: props.form.category })
if (res.data.code === 200) {
  let data = res.data.data
  ruleForm.id = data.id || ''
  ruleForm.num1 = props.form.businessExpenseRatio || data.businessExpenseRatio || 0
  ruleForm.num3 = props.form.saleAgmExpenseRatio || data.saleAgmExpenseRatio || 0
  ruleForm.num5 = props.form.sdExpenseRatio || data.sdExpenseRatio || 0
  ruleForm.num7 = props.form.pmExpenseRatio || data.pmExpenseRatio || 0
  ruleForm.num9 = props.form.pdExpenseRatio || data.pdExpenseRatio || 0
  ruleForm.num11 = props.form.deepenExpenseRatio || data.deepenExpenseRatio || 0
  ruleForm.num13 = props.form.commissionerExpenseRatio || data.commissionerExpenseRatio || 0
}

const limitIpt = (value: string, key: 'num1' | 'num3' | 'num5' | 'num7' | 'num9' | 'num11' | 'num13') => {
  if (value.slice(-1) === '.') return
  let value_ = Math.min(parseFloat(value) || 0, 100)
  ruleForm[key] = parseFloat(value_.toFixed(2))
}

const jingjia = (value: any) => {
  // 商务提成
  ruleForm.num2 = parseFloat(((value * ruleForm.num1) / 100).toFixed(2))

  // 销售总监提成
  ruleForm.num6 = parseFloat(((value * ruleForm.num5) / 100).toFixed(2))

  // 项目经理提成
  ruleForm.num8 = parseFloat(((value * ruleForm.num7) / 100).toFixed(2))

  // 项目总监提成
  ruleForm.num10 = parseFloat(((value * ruleForm.num9) / 100).toFixed(2))

  // 深化提成
  ruleForm.num12 = parseFloat(((value * ruleForm.num11) / 100).toFixed(2))

  // 安装调试员提成
  ruleForm.num14 = parseFloat(((value * ruleForm.num13) / 100).toFixed(2))
}

// 计算成本总计
watchEffect(() => {
  console.log('计算')

  // 净价
  jingjia(props.form.jingjia)

  // 其他成本
  let qita = 0
  if (props.form.cost && props.form.cost.length) {
    let qita_arr = props.form.cost.map((item: any) => item.amount)
    qita = qita_arr.reduce((pre: string, cur: string) => parseFloat(pre) + parseFloat(cur), 0)
  }

  let num = 0

  // 智能+影院
  // 成本总计 = 施工成本+总推广费+运营费用+其他成本+商务提成+销售总监提成+项目经理提成+项目总监提成+深化提成+安装调试员提成
  if (props.form.category == 1) {
    num =
      parseFloat(props.form.constructionCost || 0) +
      parseFloat(props.form.promotionExpenses || 0) +
      parseFloat(props.form.yunyingfeiyong || 0) +
      parseFloat(qita.toString()) +
      parseFloat((ruleForm.num2 || 0).toFixed(6)) +
      parseFloat((ruleForm.num6 || 0).toFixed(6)) +
      parseFloat((ruleForm.num8 || 0).toFixed(6)) +
      parseFloat((ruleForm.num10 || 0).toFixed(6)) +
      parseFloat((ruleForm.num12 || 0).toFixed(6)) +
      parseFloat((ruleForm.num14 || 0).toFixed(6))
  }

  // 灯具
  // 成本总计 = 施工成本+总推广费+运营费用+其他成本+商务提成+灯具销售提成+灯具项目经理提成
  if (props.form.category == 2) {
    num =
      parseFloat(props.form.constructionCost || 0) +
      parseFloat(props.form.promotionExpenses || 0) +
      parseFloat(props.form.yunyingfeiyong || 0) +
      parseFloat(qita.toString()) +
      parseFloat((ruleForm.num2 || 0).toFixed(6)) +
      parseFloat((ruleForm.num8 || 0).toFixed(6)) +
      parseFloat((ruleForm.num10 || 0).toFixed(6))
  }

  ruleForm.num15 = parseFloat(num.toFixed(2))

  // 项目利润=签约金额-成本总计+对公返点进项税税额可抵(专票)
  ruleForm.num16 = parseFloat(((props.form.contractAmount || 0) - num + (parseFloat(ruleForm.num20.toString()) || 0)).toFixed(2))

  // 销售副总提成=项目利润*销售副总分成率(%)
  ruleForm.num4 = parseFloat(((ruleForm.num16 * ruleForm.num3) / 100).toFixed(2))

  // 公司利润=项目利润-销售副总提成
  ruleForm.num17 = parseFloat((ruleForm.num16 - ruleForm.num4).toFixed(2))

  // 公司利润率=公司利润/合同金额
  ruleForm.num18 = parseFloat((ruleForm.num17 / (props.form.contractAmount || 0)).toFixed(2))

  // 毛利率=项目利润/签约金额
  ruleForm.num19 = parseFloat((ruleForm.num16 / (props.form.contractAmount || 0)).toFixed(2))

  // 计算公式ID回传
  emit('changeItem', 'functions', ruleForm)
})
</script>

<style lang="less" scoped></style>
