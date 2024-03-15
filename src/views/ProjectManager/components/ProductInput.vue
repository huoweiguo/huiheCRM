<template>
  <div>
    <el-form :model="ruleForm" class="mb20">
      <el-button type="primary" class="mr20">产品录入</el-button>
      <el-form-item label="名称"><el-input v-model="ruleForm.name" /></el-form-item>
      <el-form-item label="型号"><el-input v-model="ruleForm.name" /></el-form-item>
      <el-form-item label="品牌"><el-input v-model="ruleForm.name" /> </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-table :data="list" border style="width: 100%">
    <el-table-column prop="date" label="序号" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="address" label="型号" />
    <el-table-column prop="address" label="品牌" />
    <el-table-column prop="address" label="数量" />
    <el-table-column prop="address" label="系统单价" width="120" />
    <el-table-column prop="address" label="含税成本单价" width="120" />
    <el-table-column prop="address" label="税金合计" width="120" />
    <el-table-column prop="address" label="未税成本单价" width="120" />
    <el-table-column prop="address" label="未税成本总价" width="120" />
    <el-table-column prop="address" label="含税成本总价" width="120" />
    <el-table-column prop="address" label="系统总价" width="120" />
    <el-table-column prop="address" label="已出货数量" width="120" />
    <el-table-column prop="address" label="操作" fixed="right">
      <template #default>
        <el-button link type="primary" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--产品录入弹出框-->
  <el-dialog v-model="centerDialogVisible" title="产品录入" width="1100" align-center>
    <el-form ref="ruleFormRef" :model="inputObj" label-width="50px" class="mb20" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="inputObj.name" />
      </el-form-item>
      <el-form-item label="型号" prop="name">
        <el-input v-model="inputObj.name" />
      </el-form-item>
      <el-form-item label="品牌" prop="name">
        <el-input v-model="inputObj.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border style="width: 100%" class="mb20">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="序号" fixed="left" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="address" label="型号" />
      <el-table-column prop="address" label="品牌" />
      <el-table-column prop="address" label="数量" />
      <el-table-column prop="address" label="系统单价" width="120" />
      <el-table-column prop="address" label="含税成本单价" width="120" />
      <el-table-column prop="address" label="税金合计" width="120" />
      <el-table-column prop="address" label="未税成本单价" width="120" />
      <el-table-column prop="address" label="未税成本总价" width="120" />
      <el-table-column prop="address" label="含税成本总价" width="120" />
      <el-table-column prop="address" label="系统总价" width="120" />
      <el-table-column prop="address" label="毛利率" />
      <el-table-column prop="address" label="已出货数量" width="120" />
    </el-table>
    <div class="fright"><el-pagination small background layout="prev, pager, next" :total="100" @change="changeTable" /></div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const list = ref([])
const inputObj = reactive({
  name: ''
})
const centerDialogVisible = ref<boolean>(false)
const ruleForm = reactive({
  name: ''
})
const search = () => {}
const changeTable = (current: number) => {
  console.log(current)
}
</script>
