<template>
  <div class="form-box">
    <el-form label-width="150px">
      <el-form-item label="签约金额" prop="contractAmount">
        <span>{{ ruleForm.contractAmount?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="销售团队">
        <el-tag type="primary">{{ ruleForm.saleGroupName || '--' }}</el-tag>
      </el-form-item>

      <template v-for="(item, index) in ruleForm.employee" :key="index">
        <el-form-item :label="`${types2[item['type']]}`">
          <el-tag v-for="(e, i) in item['employees']" :key="i" type="primary" style="margin-right: 10px">{{ e['employeeName'] }}</el-tag>
        </el-form-item>
      </template>

      <!--员工-->
      <el-form-item label="员工" v-if="false">
        <el-table :data="ruleForm.employee" border style="width: 100%">
          <el-table-column prop="type" label="职位类型">
            <template #default="{ row }">
              <!-- 1 商务 2 灯具销售 3 项目经理 4 灯具项目经理 5 销售副总 -->
              <span v-if="row.type == 1">商务</span>
              <span v-if="row.type == 2">灯具销售</span>
              <span v-if="row.type == 3">项目经理</span>
              <span v-if="row.type == 4">灯具项目经理</span>
              <span v-if="row.type == 5">销售副总</span>
            </template>
          </el-table-column>
          <el-table-column prop="employeeName" label="员工姓名">
            <template #default="{ row }">
              <span v-for="(e, i) in row.employees" :key="i"> {{ e.employeeName }}, </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="产品开票比例">
        <span>{{ ruleForm.productRate?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="产品开票金额">
        <span>{{ ruleForm.productAmount?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="服务费开票比例">
        <span>{{ ruleForm.serviceRate?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="服务费开票金额">
        <span>{{ ruleForm.serviceAmount?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="去税面价">
        <span>{{ ruleForm.taxFreePrice?.toString() || '--' }}</span>
      </el-form-item>
      <el-form-item label="推广支付图片">
        <el-image
          v-for="(item, index) in imgList"
          :key="index"
          style="width: 100px; height: 100px"
          :src="item"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="imgList"
          :initial-index="index"
          fit="cover"
        />
      </el-form-item>
      <el-form-item label="运营费用率">
        <span>{{ ruleForm.operatingExpenseRatio?.toString() || '--' }}</span>
      </el-form-item>

      <!--推荐-->
      <el-form-item label="推荐">
        <!-- {{ ruleForm.popularize }} -->
        <el-table :data="ruleForm.popularize" border style="width: 100%">
          <el-table-column prop="referrersType" label="推荐人类型" />
          <el-table-column prop="referrersName" label="推荐人姓名" />
          <el-table-column prop="promotionRatio" label="推广费比例" />
          <el-table-column prop="promotionAmount" label="推广费金额" />
          <el-table-column prop="paidAmount" label="已付推广费" />
          <el-table-column prop="paidPromotionRatio" label="已付推广费比例" />
          <el-table-column prop="paidDate" label="已付推广费日期" />
          <el-table-column prop="paidPaidAmount" label="已付推广费金额" />
        </el-table>
      </el-form-item>

      <!--开票-->
      <template v-for="(item, index) in ruleForm.bill" :key="index">
        <el-form-item :label="`${types[item.type]}`">
          <el-table :data="item.bill" border style="width: 100%">
            <el-table-column prop="billDate" :label="`${types[item.type]}日期`" />
            <el-table-column prop="billAmount" :label="`${types[item.type]}金额`" />
            <el-table-column label="图片">
              <template #default="scope">
                <el-image v-for="(item, index) in scope.row.billImageOss" :key="index" style="width: 30px; height: 30px" :src="item.url" fit="contain" />
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-form-item>
      </template>

      <!--产品录入-->
      <el-form-item label="产品录入">
        <!-- {{ ruleForm.product }} -->
        <el-table :data="ruleForm.product" border style="width: 100%">
          <el-table-column prop="productId" label="id" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="model" label="型号" />
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="productNum" label="数量"></el-table-column>
          <el-table-column prop="systemUnitPrice" label="系统单价" width="120" />
          <el-table-column prop="unitPriceIncludingTax" label="含税成本单价" width="120" />
          <el-table-column prop="totalTaxes" label="税金合计" width="120"></el-table-column>
          <el-table-column prop="unitPriceExcludingTax2" label="未税成本单价" width="120"></el-table-column>
          <el-table-column prop="totalCostExcludingTax" label="未税成本总价" width="120"></el-table-column>
          <el-table-column prop="totalCostIncludingTax" label="含税成本总价" width="120"></el-table-column>
          <el-table-column prop="systemTotalPrice" label="系统总价" width="120"></el-table-column>
          <el-table-column prop="quantitySoldOut" label="已出货数量" width="120" />
        </el-table>
      </el-form-item>

      <!-- 其他税费 -->
      <el-form-item label="其他税费 ">
        <el-table :data="ruleForm.cost" border style="width: 100%">
          <el-table-column prop="recordDate" label="其他成本日期" />
          <el-table-column prop="amount" label="其他成本金额" />
          <el-table-column prop="remark" label="其他成本备注" />
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

import { useRoute } from 'vue-router'
import { useProgramStore } from '@/store/program'
import { commonStore } from '@/store/common'

interface RuleFormItem {
  contractAmount: string
  saleGroup: string
  productRate: string
  productAmount: string
  serviceRate: string
  serviceAmount: string
  taxFreePrice: string
  promotionalPaymentsImage: string
  operatingExpenseRatio: string
  saleGroupName: string
  employee: [
    {
      type: number
      employees: [
        {
          employeeName: string
        }
      ]
    }
  ]
  product: []
  popularize: []
  cost: []
  bill: {
    bill: {}
    billDate: string
    billAmount: number
    remark: string
    type: number
  }[]
}

const useCommon = commonStore()

const imgList = ref([])

const types = ['', '开票', '收票', '收款', '付款']
const types2 = ['', '商务', '灯具销售', '项目经理', '灯具项目经理', '销售副总']

const useProgram = useProgramStore()
const route = useRoute()
const props = defineProps(['category'])
const projectId = route.params.id

const ruleForm = ref({} as RuleFormItem)

useProgram.getSettlementReduce({ projectId, category: props.category }).then(d => {
  if (d.data.code == 200) {
    ruleForm.value = d.data.data

    // 获取图片
    if (ruleForm.value.promotionalPaymentsImage) {
      useCommon.getOssImgs(ruleForm.value.promotionalPaymentsImage).then(res => {
        if (res.data.code === 200) {
          if (res.data.data && res.data.data.length > 0) {
            imgList.value = res.data.data.map((d: any) => d.url)
          }
        }
      })
    }
  }
})
</script>
