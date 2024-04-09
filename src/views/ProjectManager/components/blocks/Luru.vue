<template>
  <div>
    <div class="cinema">
      <el-form-item label="产品录入">
        <div style="width: 100%">
          <el-button type="primary" class="mb20" @click="addProduct">产品录入</el-button>
          <el-row>
            <el-col :span="6">
              税金合计总计:
              <span>{{ tableData.reduce((pre, cur) => pre + cur.totalTaxes, 0).toFixed(2) }}</span>
            </el-col>
            <el-col :span="6">
              未税成本总价总计:
              <span>{{ tableData.reduce((pre, cur) => pre + cur.totalCostExcludingTax, 0).toFixed(2) }}</span>
            </el-col>
            <el-col :span="6">
              含税成本总价总计:
              <span>{{ tableData.reduce((pre, cur) => pre + cur.totalCostIncludingTax, 0).toFixed(2) }}</span>
            </el-col>
            <el-col :span="6">
              系统总价总计:
              <span>{{ tableData.reduce((pre, cur) => pre + cur.systemTotalPrice, 0).toFixed(2) }}</span>
            </el-col>
          </el-row>
        </div>
        <el-table :data="tableData" row-key="productId" border style="width: 100%">
          <el-table-column label="序号" width="60" align="center" fixed="left">
            <template #default="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="model" label="型号" />
          <el-table-column prop="brand" label="品牌" />
          <el-table-column label="数量">
            <template #default="scope">
              <el-input v-model="scope.row.productNum" @input="iptChange(scope.row, scope.$index)" :disabled="disabled" />
            </template>
          </el-table-column>
          <el-table-column prop="systemUnitPrice" label="系统单价" width="120" />
          <el-table-column prop="unitPriceIncludingTax" label="含税成本单价" width="120" />
          <el-table-column label="税金合计" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalTaxes?.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="未税成本单价" width="120">
            <template #default="scope">
              <b>{{ scope.row.unitPriceExcludingTax2?.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="未税成本总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalCostExcludingTax?.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="含税成本总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.totalCostIncludingTax?.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column label="系统总价" width="120">
            <template #default="scope">
              <b>{{ scope.row.systemTotalPrice?.toFixed(2) }}</b>
            </template>
          </el-table-column>
          <el-table-column prop="quantitySoldOut" label="已出货数量" width="120" />
          <el-table-column label="操作" fixed="right" v-if="!disabled">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="delrow(scope.$index)">删除</el-button>
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
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElTable } from 'element-plus'
import { useProductStore } from '@/store/product'
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const useProduct = useProductStore()
const emit = defineEmits(['update:form'])
const props = defineProps(['form', 'disabled'])
const loading = ref(false)
const visible = ref<boolean>(false)

const ruleFormRef = ref<FormInstance>()

const tableData = ref<Row[]>([])
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

onMounted(() => {
  // 初始化数据
  if (props.form) {
    // 初始化选择
    selectList.value = props.form

    // 计算
    let arr = props.form.map((item: itemType) => {
      let row = {
        ...item,
        productId: item.id || item.productId,
        productNum: 1
      }
      row = Object.assign(row, calculate(item))
      return row
    })

    tableData.value = Object.assign([], tableData.value, arr)
  }

  console.log('初始化选择', tableData.value.length)
  emit('update:form', tableData.value)
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

interface itemType {
  [propName: string]: any
}
const onSelect = () => {
  let arr = selectList.value.map((item: itemType) => {
    let row = {
      ...item,
      productId: item.id,
      productNum: 1
    }
    row = Object.assign(row, calculate(item))
    return row
  })

  tableData.value = Object.assign([], tableData.value, arr)
  console.log('选择数据', tableData.value.length)

  emit('update:form', tableData.value)
  visible.value = false
}

interface Row {
  totalTaxes: number
  unitPriceIncludingTax: number
  unitPriceExcludingTax2: number
  totalCostExcludingTax: number
  totalCostIncludingTax: number
  systemUnitPrice: number
  systemTotalPrice: number
  productNum: number
}

const iptChange = (row: Row, index: number) => {
  row = Object.assign(row, calculate(row))

  // 更新 tableData 中的数据
  tableData.value.splice(index, 1, row)

  // 发射事件更新 form 数据
  emit('update:form', tableData.value)
}

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
  emit('update:form', tableData.value)
}

// 计算
const calculate = (row: itemType) => {
  return {
    // 税金合计=含税成本单价/1.13*0.13*数量
    totalTaxes: (row.unitPriceIncludingTax / 1.13) * 0.13 * (row.productNum || 1),

    // 未税成本单价=含税成本单价/1.13
    unitPriceExcludingTax2: row.unitPriceIncludingTax / 1.13,

    // 未税成本总价=未税成本单价*数量
    totalCostExcludingTax: parseFloat((row.unitPriceIncludingTax / 1.13).toFixed(2)) * (row.productNum || 1),

    // 含税成本总价=含税成本单价*数量
    totalCostIncludingTax: row.unitPriceIncludingTax * (row.productNum || 1),

    // 系统总价=系统单价*数量
    systemTotalPrice: row.systemUnitPrice * (row.productNum || 1)
  }
}
</script>
