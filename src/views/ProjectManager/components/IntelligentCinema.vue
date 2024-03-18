<template>
  <div class="form-box">
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="140px" :inline="true" status-icon>
      <el-form-item label="签约金额" prop="contractAmount">
        <el-input v-model="ruleForm.contractAmount" placeholder="请输入签约金额，保留2位小数" />
      </el-form-item>
      <el-form-item label="销售团队">
        <el-select v-model="ruleForm.saleGroup" class="m-2" placeholder="请选择销售团队" style="width: 192px">
          <el-option v-for="item in useProgram.saleTeam" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商务">
        <el-select multiple class="m-2" placeholder="请选择商务" style="width: 192px">
          <el-option v-for="item in useRole.businessList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="灯具销售">
        <el-select multiple class="m-2" placeholder="请选择灯具销售" style="width: 192px">
          <el-option v-for="item in useRole.lightSalesList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理">
        <el-select multiple class="m-2" placeholder="请选择项目经理" style="width: 192px">
          <el-option v-for="item in useRole.projectManagerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="灯具项目经理">
        <el-select multiple class="m-2" placeholder="请选择灯具项目经理" style="width: 192px">
          <el-option v-for="item in useRole.lightProjectManagerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>

      <div>
        <el-form-item label="产品开票比例" prop="productRate">
          <el-input v-model="ruleForm.productRate" placeholder="请输入产品开票比例"></el-input>
        </el-form-item>
        <el-form-item label="产品开票金额" prop="productAmount">
          <el-input v-model="ruleForm.productAmount" placeholder="请输入产品开票金额" />
        </el-form-item>
        <el-form-item label="服务费开票比例" prop="serviceRate">
          <el-input v-model="ruleForm.serviceRate" placeholder="请输入服务费开票比例" />
        </el-form-item>
        <el-form-item label="服务费开票金额" prop="serviceAmount">
          <el-input v-model="ruleForm.serviceAmount" placeholder="请输入服务费开票金额" />
        </el-form-item>
      </div>

      <!--推荐-->
      <Tuijian v-model:form="ruleForm.popularize"></Tuijian>

      <!--开票-->
      <Kaipiao v-model:form="bill1"></Kaipiao>

      <!--收票-->
      <Shoupiao v-model:form="bill2"></Shoupiao>

      <!--收款-->
      <Shoukuan v-model:form="bill3"></Shoukuan>

      <!--付款-->
      <Fukuan v-model:form="bill4"></Fukuan>

      <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" type="textarea" maxlength="300" placeholder="请输入" show-word-limit style="width: 400px" />
      </el-form-item>

      <!--产品录入-->
      <Luru v-model:form="ruleForm.product"></Luru>

      <!--未含税-->
      <Shui :form="ruleForm" @changeItem="changeItem"></Shui>

      <!-- 其他税费 -->
      <Qita v-model:form="ruleForm.cost"></Qita>

      <!--商务-->
      <Shangwu :form="ruleForm" @changeItem="changeItem"></Shangwu>
    </el-form>

    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { useProgramStore } from '@/store/program'
import { useRoleStore } from '@/store/role'

import Tuijian from './blocks/Tuijian.vue'
import Kaipiao from './blocks/Kaipiao.vue'
import Shoupiao from './blocks/Shoupiao.vue'
import Shoukuan from './blocks/Shoukuan.vue'
import Fukuan from './blocks/Fukuan.vue'
import Luru from './blocks/Luru.vue'
import Shui from './blocks/Shui.vue'
import Shangwu from './blocks/Shangwu.vue'
import Qita from './blocks/Qita.vue'

const props = defineProps(['type', 'category'])

const ruleFormRef = ref<FormInstance>()
const useProgram = useProgramStore()
const useRole = useRoleStore()
const route = useRoute()

const ruleForm = reactive({
  id: 0,
  projectId: route.params.id,
  category: props.category, // 1、智能+影院项目汇算 2、灯具项目汇算
  type: props.type, // 1、初始项目 2、增减项目
  settleName: '',
  contractAmount: '',
  saleGroup: '',
  productRate: '',
  productAmount: '',
  serviceRate: '',
  serviceAmount: '',
  taxFreePrice: '',
  promotionalPaymentsImage: '',
  operatingExpenseRatio: '',
  remark: '',
  popularize: [],
  bill: [],
  product: [],
  employee: [],
  cost: []
})

const bill1 = ref({})
const bill2 = ref({})
const bill3 = ref({})
const bill4 = ref({})

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      // 合并项目汇算票据/支付信息
      ruleForm.bill = []
      bill1.value.bill?.length > 0 && ruleForm.bill.push(bill1.value)
      bill2.value.bill?.length > 0 && ruleForm.bill.push(bill2.value)
      bill3.value.bill?.length > 0 && ruleForm.bill.push(bill3.value)
      bill4.value.bill?.length > 0 && ruleForm.bill.push(bill4.value)

      console.log('submit!', ruleForm)
      
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}


const changeItem = (key:String,val:any)=>{
  ruleForm[key] = val
}
</script>

<style lang="less" scoped></style>
