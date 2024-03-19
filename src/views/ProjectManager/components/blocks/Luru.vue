<template>
  <div>
    <div class="cinema">
      <el-form-item label="产品录入">
        <el-button type="primary" class="mb20" @click="addProduct">产品录入</el-button>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="60" align="center" fixed="left">
            <template #default="scope">
              <span>{{ scope.$index + 1 + (seacrForm.pageNum - 1) * seacrForm.pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="id" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="model" label="型号" />
          <el-table-column prop="brand" label="品牌" />
          <el-table-column label="数量">
            <template #default="scope">
              <el-input v-model="scope.row.productNum" @input="iptChange(scope.row, scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column prop="systemUnitPrice" label="系统单价" width="120" />
          <el-table-column prop="unitPriceIncludingTax" label="含税成本单价" width="120" />
          <el-table-column label="税金合计" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalTaxes.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="未税成本单价" width="120">
            <template #default="scope">
              <b>{{ scope.row.unitPriceExcludingTax2.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="未税成本总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalCostExcludingTax.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="含税成本总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalCostIncludingTax.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="系统总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.systemTotalPrice.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column prop="quantitySoldOut" label="已出货数量" width="120" />
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click="delrow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </div>

    <!--产品录入弹出框-->
    <el-dialog v-model="visible" title="产品录入" width="1100" align-center>
      <el-form ref="ruleFormRef" :model="seacrForm" label-width="50px" class="mb20" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input v-model="seacrForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="seacrForm.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="seacrForm.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="multipleTableRef" row-key="id" :data="list" border style="width: 100%" class="mb20" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" width="55" />
        <el-table-column label="序号" width="60" align="center" fixed="left">
          <template #default="scope">
            <span>{{ scope.$index + 1 + (seacrForm.pageNum - 1) * seacrForm.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="产品类型" align="center">
          <template #default="scope">
            <span>{{ scope.row.type === 1 ? '智能+影院' : '灯具' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="model" label="型号" align="center" />
        <el-table-column prop="brand" label="品牌" align="center" />
        <el-table-column prop="systemUnitPrice" label="系统单价" align="center" />
        <el-table-column prop="unitPriceIncludingTax" label="含税成本单价" align="center" />
        <!-- <el-table-column prop="address" label="税金合计" align="center" /> -->
        <el-table-column prop="unitPriceExcludingTax" label="未税成本单价" align="center" />
        <el-table-column prop="quantitySoldOut" label="已出货数量" align="center">
          <template #default="scope">
            <span>{{ scope.row.quantitySoldOut === null ? '--' : scope.row.quantitySoldOut }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrForm.pageSize" @change="changeTable" /></div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSelect">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElTable } from 'element-plus'
import { useProductStore } from '@/store/product'
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const useProduct = useProductStore()
const emit = defineEmits(['update:form'])
const props = defineProps(['form'])
const loading = ref(false)
const visible = ref<boolean>(false)

const ruleFormRef = ref<FormInstance>()

const tableData = ref([...props.form])
const selectList = ref([])
const list = ref([])

const totalNum = ref(0)
const seacrForm = reactive({
  type: '',
  name: '',
  model: '',
  brand: '',
  pageSize: 10,
  pageNum: 1
})

const getProductList = () => {
  loading.value = true
  useProduct.getProductList(seacrForm).then(res => {
    loading.value = false
    if (res.data.code === 200) {
      list.value = res.data.rows
      totalNum.value = res.data.total
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const addProduct = () => {
  list.value = []
  visible.value = true
  getProductList()
}

const search = () => {
  seacrForm.pageNum = 1
  getProductList()
}

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

const changeTable = (current: number) => {
  seacrForm.pageNum = current
  getProductList()
}

const handleSelectionChange = (val: []) => {
  selectList.value = val
}

const onSelect = () => {
  let arr = selectList.value.map(item => ({
    productId: item.id,

    productNum: 1,

    // 税金合计=含税成本单价/1.13*0.13*数量
    totalTaxes: (item.unitPriceIncludingTax / 1.13) * 0.13 * (item.productNum || 1),

    // 未税成本单价=含税成本单价/1.13
    unitPriceExcludingTax2: item.unitPriceIncludingTax / 1.13,

    // 未税成本总价=未税成本单价*数量
    totalCostExcludingTax: (item.unitPriceIncludingTax / 1.13) * (item.productNum || 1),

    // 含税成本总价=含税成本单价*数量
    totalCostIncludingTax: item.unitPriceIncludingTax * (item.productNum || 1),

    // 系统总价=系统单价*数量
    systemTotalPrice: item.systemUnitPrice * (item.productNum || 1),

    ...item
  }))

  tableData.value = Object.assign(tableData.value, arr)
  emit('update:form', tableData.value)
  visible.value = false
}

const iptChange = (row: any, index: number) => {
  row.totalTaxes = (row.unitPriceIncludingTax / 1.13) * 0.13 * (row.productNum || 0)
  row.unitPriceExcludingTax2 = row.unitPriceIncludingTax / 1.13
  row.totalCostExcludingTax = (row.unitPriceIncludingTax / 1.13) * (row.productNum || 0)
  row.totalCostIncludingTax = row.unitPriceIncludingTax * (row.productNum || 0)
  row.systemTotalPrice = row.systemUnitPrice * (row.productNum || 0)
  tableData.value.splice(index, 1, row)

  emit('update:form', tableData.value)
}

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
  emit('update:form', tableData.value)
}
</script>
