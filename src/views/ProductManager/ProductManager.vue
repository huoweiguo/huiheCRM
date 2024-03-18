<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrForm" label-width="90" :inline="true">
    <el-form-item label="名称" prop="name">
      <el-input v-model="seacrForm.name" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="型号" prop="model">
      <el-input v-model="seacrForm.model" placeholder="请输入型号" />
    </el-form-item>
    <el-form-item label="品牌" prop="brand">
      <el-input v-model="seacrForm.brand" placeholder="请输入品牌" />
    </el-form-item>
    <el-form-item label="产品类型" prop="type">
      <el-select v-model="seacrForm.type" class="m-2" placeholder="请选择产品类型" style="width: 192px">
        <el-option label="全部" value="" />
        <el-option label="智能+影院" value="1" />
        <el-option label="灯具" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="mb20">
    <el-button type="primary" @click="router.push('/productManager/addProduct')">添加产品</el-button>
    <el-upload
      style="display: inline-block; margin-left: 20px;"
      method="post" 
      :limit="1"
      :auto-upload="false"
      :on-change="changeFile"
      :show-file-list="false"
      accept=".xlsx, .xls"
    >
      <el-button type="primary">导入</el-button>
    </el-upload>
  </div>

  <el-table :data="tableData" class="mb20" v-loading="loading" border style="width: 100%">
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
    <el-table-column prop="address" label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="editLine(scope.row)">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteLine(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrForm.pageSize" @change="changeTable" /></div>

  <!--修改产品-->
  <el-dialog v-model="dialogVisible" title="编辑" width="450" :before-close="handleClose">
    <el-form :model="productForm">
      <el-form-item label="类型" :label-width="100">
        <el-select v-model="productForm.type" class="m-2" placeholder="请选择类型" style="width: 260px">
          <el-option label="智能+影院" value="1" />
          <el-option label="灯具" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" :label-width="100">
        <el-input v-model="productForm.name" autocomplete="off" placeholder="请输入名称" style="width: 260px" />
      </el-form-item>
      <el-form-item label="型号" :label-width="100">
        <el-input v-model="productForm.model" autocomplete="off" placeholder="请输入型号" style="width: 260px" />
      </el-form-item>
      <el-form-item label="品牌" :label-width="100">
        <el-input v-model="productForm.brand" autocomplete="off" placeholder="请输入品牌" style="width: 260px" />
      </el-form-item>
      <el-form-item label="系统单价" :label-width="100">
        <el-input v-model="productForm.systemUnitPrice" autocomplete="off" placeholder="请输入系统单价" style="width: 260px" />
      </el-form-item>
      <el-form-item label="含税成本单价" :label-width="100">
        <el-input v-model="productForm.unitPriceIncludingTax" autocomplete="off" placeholder="请输入含税成本单价" style="width: 260px" />
      </el-form-item>
      <el-form-item label="未税成本单价" :label-width="100">
        <el-input v-model="productForm.unitPriceExcludingTax" autocomplete="off" placeholder="请输入未税成本单价" style="width: 260px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadFile, UploadFiles, FormRules, FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/store/product'

const changeFile = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(1,uploadFile);
  const formData = new FormData()
  formData.append('file', uploadFile.raw, uploadFile.name)
  useProduct.importProducts(formData).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('上传成功')
      getProductList()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
  // if (response.code === 200) {
  //   console.log(2,uploadFile);
  // } else if (response.code === 401) {
  //   ElMessage.closeAll()
  //   ElMessage.error('登录超时，请重新登录')
  //   setTimeout(() => {
  //     router.push('/login')
  //   })
  // } else {
  //   ElMessage.error(response.msg)
  // }
}

const router = useRouter()
const useProduct = useProductStore()
const dialogVisible = ref<boolean>(false)
const seacrForm = reactive({
  type: '',
  name: '',
  model: '',
  brand: '',
  pageSize: 10,
  pageNum: 1
})
const productForm = reactive({
  id: '',
  type: '',
  name: '',
  model: '',
  brand: '',
  systemUnitPrice: '',
  unitPriceIncludingTax: '',
  unitPriceExcludingTax: ''
})

const totalNum = ref(0)
const loading = ref(false)
const tableData = ref([])
const ruleFormRef = ref<FormInstance>()
const search = () => {
  seacrForm.pageNum = 1
  getProductList()
}
interface RuleRow {
  [key: string]: unknown
}
const editLine = (row: RuleRow) => {
  dialogVisible.value = true
  const { id, type, name, model, unitPriceIncludingTax, unitPriceExcludingTax, systemUnitPrice, brand } = row
  productForm.id = id as string
  productForm.type = JSON.stringify(type) as string
  productForm.name = name as string
  productForm.model = model as string
  productForm.brand = brand as string
  productForm.systemUnitPrice = systemUnitPrice as string
  productForm.unitPriceIncludingTax = unitPriceIncludingTax as string
  productForm.unitPriceExcludingTax = unitPriceExcludingTax as string
}

const saveProduct = () => {
  useProduct.editItem(productForm).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改产品成功')
      dialogVisible.value = false
      getProductList()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const getProductList = () => {
  loading.value = true
  useProduct.getProductList(seacrForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    } else {
      ElMessage.error(res.data.msg)
    }
    loading.value = false
  })
}

const deleteLine = (id: string) => {
  ElMessageBox.confirm('确定要删除此项吗?')
    .then(() => {
      useProduct.deleteItem(id).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('删除成功')
          getProductList()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    })
    .catch(() => {
      // catch error
    })
}

onMounted(() => {
  getProductList()
})

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
const changeTable = (current: number) => {
  seacrForm.pageNum = current
  getProductList()
}

</script>

<style lang="scss" scoped></style>
