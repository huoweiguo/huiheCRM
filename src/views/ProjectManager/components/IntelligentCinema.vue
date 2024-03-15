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
        <el-select multiple class="m-2" v-model="business" placeholder="请选择商务" style="width: 192px">
          <el-option v-for="item in useRole.businessList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="灯具销售">
        <el-select multiple class="m-2" v-model="light" placeholder="请选择灯具销售" style="width: 192px">
          <el-option v-for="item in useRole.lightSalesList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理">
        <el-select multiple class="m-2" v-model="programList" placeholder="请选择项目经理" style="width: 192px">
          <el-option v-for="item in useRole.projectManagerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="灯具项目经理">
        <el-select multiple class="m-2" v-model="lightProgram" placeholder="请选择灯具项目经理" style="width: 192px">
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
      <div class="cinema">
        <el-form-item label="添加推荐人">
          <el-button type="primary" icon="plus" @click="centerDialogVisible = true">添加</el-button>
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
          </el-table>
        </div>
      </div>

      <!--开票-->
      <div class="cinema">
        <el-form-item label="开票">
          <el-button type="primary" icon="plus" @click="visiableTicket = true">添加</el-button>
        </el-form-item>
        <div class="mb20 pl140">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="billDate" label="开票日期" />
            <el-table-column prop="billAmount" label="开票金额" />
          </el-table>
        </div>
      </div>

      <!--收票-->
      <div class="cinema">
        <el-form-item label="收票">
          <el-button type="primary" icon="plus" @click="visiableReceiveTicket = true">添加</el-button>
        </el-form-item>
        <div class="mb20 pl140">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="billDate" label="收票日期" />
            <el-table-column prop="billAmount" label="收票金额" />
          </el-table>
        </div>
      </div>

      <!--收款-->
      <div class="cinema">
        <el-form-item label="收款">
          <el-button type="primary" icon="plus" @click="visiableCash = true">添加</el-button>
        </el-form-item>
        <div class="mb20 pl140">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="billDate" label="收款日期" />
            <el-table-column prop="billAmount" label="收款金额" />
          </el-table>
        </div>
      </div>

      <!--付款-->
      <div class="cinema">
        <el-form-item label="付款">
          <el-button type="primary" icon="plus" @click="visiablePayCash = true">添加</el-button>
        </el-form-item>
        <div class="mb20 pl140">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="billDate" label="付款日期" />
            <el-table-column prop="billAmount" label="付款金额" />
          </el-table>
        </div>
      </div>

      <el-form-item label="备注">
        <el-input v-model="ruleForm.name" type="textarea" maxlength="300" placeholder="请输入" show-word-limit style="width: 400px" />
      </el-form-item>

      <!--产品录入-->
      <div class="cinema">
        <el-form-item label="产品录入">
          <ProductInput />
        </el-form-item>
      </div>

      <!--未含税-->
      <div>
        <el-form-item label="未税成本总价" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="去税面价" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="净价" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="净折扣" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="施工成本" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="总推广费" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="运营费用率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="运营费用" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <div class="cinema">
          <el-form-item label="其他">
            <el-button type="primary" icon="plus" @click="centerDialogVisible = true">添加</el-button>
          </el-form-item>
          <div class="mb20 pl140">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="date" label="其他成本日期" />
              <el-table-column prop="name" label="其他成本金额" />
              <el-table-column prop="name" label="其他成本备注" />
            </el-table>
          </div>
          <!--
          <el-form-item label="上传图片">
            <UploadFiles :fileList="fileList"></UploadFiles>
          </el-form-item>
          -->
        </div>
      </div>
      <!--商务-->
      <div>
        <el-form-item label="商务提成率" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商务提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="销售副总提成率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="销售副总提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="销售总监提成率" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="销售总监提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="项目经理提成率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="项目经理提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="项目总监提成率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="项目总监提成" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="深化提成率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="深化提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="安装调试员提成率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="安装调试员提成" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="成本总计" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="项目利润" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="公司利润" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="公司利润率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="毛利率" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
      </div>
    </el-form>

    <div style="padding-left: 120px">
      <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </div>

  <!--添加推荐人-->
  <el-dialog v-model="centerDialogVisible" title="添加推荐人信息" width="750" align-center>
    <el-form ref="ruleFormRef" :model="recommend" label-width="120px" :inline="true">
      <el-form-item label="推荐人类型" prop="referrersType">
        <el-input v-model="recommend.referrersType" placeholder="请输入推荐人类型" />
      </el-form-item>
      <el-form-item label="推荐人姓名" prop="referrersName">
        <el-input v-model="recommend.referrersName" placeholder="请输入推荐人姓名" />
      </el-form-item>
      <el-form-item label="推广费比例" prop="promotionRatio">
        <el-input v-model="recommend.promotionRatio" placeholder="请输入推广费比例" />
      </el-form-item>
      <el-form-item label="推广费金额" prop="promotionAmount">
        <el-input v-model="recommend.promotionAmount" placeholder="请输入推广费金额" />
      </el-form-item>
      <el-form-item label="已付推广费" prop="paidAmount">
        <el-input v-model="recommend.paidAmount" placeholder="请输入已付推广费" />
      </el-form-item>
      <el-form-item label="已付推广费比例" prop="paidPromotionRatio">
        <el-input v-model="recommend.paidPromotionRatio" placeholder="请输入已付推广费比例" />
      </el-form-item>
      <el-form-item label="已付推广费日期" prop="paidDate">
        <el-date-picker v-model="paidDate" type="date" placeholder="请选择已付推广费日期" style="width: 192px"></el-date-picker>
      </el-form-item>
      <el-form-item label="已付推广费金额" prop="paidPaidAmount">
        <el-input v-model="recommend.paidPaidAmount" placeholder="请输入已付推广费金额" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">重置</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>

  <!--添加开票-->
  <el-dialog v-model="visiableTicket" title="添加开票" width="750" align-center>
    <AddTickets tickType="1" @openTicket="openTicket" />
  </el-dialog>

  <!--添加收票-->
  <el-dialog v-model="visiableReceiveTicket" title="添加收票" width="750" align-center>
    <AddTickets tickType="2" @receiveTicket="receiveTicket" />
  </el-dialog>

  <!--添加收款-->
  <el-dialog v-model="visiableCash" title="添加收款" width="750" align-center>
    <AddTickets tickType="3" @receiveCash="receiveCash" />
  </el-dialog>

  <!--添加付款-->
  <el-dialog v-model="visiablePayCash" title="添加付款" width="750" align-center>
    <AddTickets tickType="4" @payCash="payCash" />
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import ProductInput from './ProductInput.vue'
import AddTickets from './AddTickets.vue'
import { useProgramStore } from '@/store/program'
import { useRoleStore } from '@/store/role'
import { useRoute } from 'vue-router'
const useProgram = useProgramStore()
const useRole = useRoleStore()
const ruleFormRef = ref<FormInstance>()
const centerDialogVisible = ref<boolean>(false)
const visiableTicket = ref<boolean>(false)
const visiableReceiveTicket = ref<boolean>(false)
const visiableCash = ref<boolean>(false)
const visiablePayCash = ref<boolean>(false)

const route = useRoute()
const tableData = ref([])
const business = ref([])
const light = ref([])
const programList = ref([])
const lightProgram = ref([])
const paidDate = ref('')

const recommend = reactive({
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
const fileList = ref<UploadUserFile[]>([])

const ruleForm = reactive({
  name: '',
  projectId: route.params.id,
  category: '1', // 1、智能+影院项目汇算 2、灯具项目汇算
  type: '1', // 1、初始项目 2、增减项目
  contractAmount: '',
  saleGroup: '',
  productRate: '',
  productAmount: '',
  serviceRate: '',
  serviceAmount: '',
  employee: [
    { type: '1', employees: [] },
    { type: '2', employees: [] },
    { type: '3', employees: [] },
    { type: '4', employees: [] }
  ],
  bill: []
})

const openTicket = data => {
  console.log(data, 'open')
  tableData.value = data
  visiableTicket.value = false
}
const receiveTicket = () => {}
const receiveCash = () => {}
const payCash = () => {}

// 保存表单
const submitForm = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    }
  })
}

// 重置表单
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
</script>
