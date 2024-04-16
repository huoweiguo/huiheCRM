<template>
  <div>
    <el-form ref="ruleFormRef" :model="cinema" label-width="170px" :inline="true" status-icon>
      <h3 class="h3_title mb20">智能+影院项目汇算公示</h3>
      <el-form-item label="商务提成率" prop="businessExpenseRatio">
        <el-input v-model="cinema.businessExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售副总分成率" prop="saleAgmExpenseRatio">
        <el-input v-model="cinema.saleAgmExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售总监提成率" prop="sdExpenseRatio">
        <el-input v-model="cinema.sdExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="项目经理提成率" prop="pmExpenseRatio">
        <el-input v-model="cinema.pmExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="项目总监提成率" prop="pdExpenseRatio">
        <el-input v-model="cinema.pdExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="深化提成率" prop="pdExpenseRatio">
        <el-input v-model="cinema.deepenExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="安装调试员提成率" prop="commissionerExpenseRatio">
        <el-input v-model="cinema.commissionerExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form ref="lightFormRef" :model="light" label-width="140px" :inline="true" status-icon>
      <h3 class="h3_title mb20 mt40">灯具项目汇算公式</h3>
      <el-form-item label="商务提成率" prop="businessExpenseRatio">
        <el-input v-model="light.businessExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售副总分成率" prop="saleAgmExpenseRatio">
        <el-input v-model="light.saleAgmExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="销售总监提成率" prop="sdExpenseRatio">
        <el-input v-model="light.sdExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="灯具销售提成率" prop="pmExpenseRatio">
        <el-input v-model="light.pmExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="灯具项目经理提成率" prop="pdExpenseRatio">
        <el-input v-model="light.pdExpenseRatio">
          <template #append>%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm(ruleFormRef, lightFormRef)">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useProgramStore } from '@/store/program'
const route = useRoute()
const useProgram = useProgramStore()

const ruleFormRef = ref<FormInstance>()
const lightFormRef = ref<FormInstance>()

interface RuleCompute {
  [key: string]: unknown
}

const cinema = reactive<RuleCompute>({
  id: '',
  type: '',
  projectId: '',
  businessExpenseRatio: '',
  saleAgmExpenseRatio: '',
  sdExpenseRatio: '',
  pmExpenseRatio: '',
  pdExpenseRatio: '',
  commissionerExpenseRatio: '',
  deepenExpenseRatio: ''
})
const light = reactive<RuleCompute>({
  id: '',
  type: '',
  projectId: '',
  businessExpenseRatio: '',
  saleAgmExpenseRatio: '',
  sdExpenseRatio: '',
  pmExpenseRatio: '',
  pdExpenseRatio: '',
  commissionerExpenseRatio: '',
  deepenExpenseRatio: ''
})

useProgram.getFunctions({ projectId: route.params.id }).then(res => {
  if (res.data.code === 200) {
    for (let attr in cinema) {
      cinema[attr] = res.data.data.cinema[attr]
    }
    for (let item in light) {
      light[item] = res.data.data.light[item]
    }
  }
})

// 保存表单
const submitForm = () => {
  cinema.projectId = route.params.id
  light.projectId = route.params.id
  useProgram.editFunction({ cinema, light }).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('保存计算公式成功')
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined, lightFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  if (!lightFormRef) return
  ruleFormRef.resetFields()
  lightFormRef.resetFields()
}
</script>

<style scoped></style>
