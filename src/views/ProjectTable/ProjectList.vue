<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="seacrhForm.projectName" />
    </el-form-item>
    <el-form-item label="所属商务" prop="business">
      <el-input v-model="seacrhForm.business" />
    </el-form-item>
    <el-form-item label="所属副总" prop="sale">
      <el-input v-model="seacrhForm.sale" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="mb20">
    <el-button type="primary" @click="router.push('/projectTable/addProjectList')">添加项目跟进</el-button>
  </div>

  <el-table :data="tableData" class="mb20" border style="width: 100%">
    <el-table-column label="序号" width="60" align="center" fixed="left">
      <template #default="scope">
        <span>{{ scope.$index + 1 + (seacrhForm.pageNum - 1) * seacrhForm.pageSize }} </span>
      </template>
    </el-table-column>
    <el-table-column prop="projectName" label="项目名称" align="center" width="160" />
    <el-table-column prop="business" label="所属商务" align="center" width="160" />
    <el-table-column prop="saleAgm" label="所属副总" align="center" width="160" />
    <el-table-column prop="crm" label="CRM报备/有效报备" align="center" width="160" />
    <el-table-column prop="requireSignIn" label="本月必签" align="center" width="160" />
    <el-table-column prop="signIn" label="是否已签" align="center" width="160" />
    <el-table-column prop="exhibitionHallVisit" label="展厅参观" align="center" width="160" />
    <el-table-column prop="construction" label="别墅/平层" align="center" width="160" />
    <el-table-column prop="contractDate" label="预计签单日期" align="center" width="160" />
    <el-table-column prop="projectArea" label="项目面积" align="center" width="160" />
    <el-table-column prop="schemeBudget" label="方案预算（万）" align="center" width="160" />
    <el-table-column prop="proprietorBudget" label="预计业主预算" align="center" width="160" />
    <el-table-column prop="projectProgress" label="项目进度" align="center" width="160" />
    <el-table-column prop="projectSource" label="项目来源" align="center" width="160" />
    <el-table-column prop="contendBrand" label="竞品品牌" align="center" width="160" />
    <el-table-column label="跟进情况（数据更新日期)" align="center" width="160">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="open(scope.row.id)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" fixed="right" width="140">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="showEdit(JSON.stringify(scope.row.id))">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteItem(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" @change="changeTable" /></div>

  <!--编辑项目跟进-->
  <el-dialog v-model="dialogVisible" title="编辑项目跟进" width="900" @close="closeData">
    <ProjectTable :isModify="true" :ids="ids" @visibleEmit="visibleEmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/store/project'
import ProjectTable from './components/ProjectTable.vue'

const router = useRouter()
const useProject = useProjectStore()
const totalNum = ref<number>(1)
const dialogVisible = ref<boolean>(false)
const ids = ref<string>('')

const seacrhForm = reactive({
  projectName: '',
  business: '',
  sale: '',
  pageSize: 10,
  pageNum: 1
})
const tableData = ref([])
const ruleFormRef = ref<FormInstance>()
const search = () => {
  seacrhForm.pageNum = 1
  queryProjectList()
}

const showEdit = (pid: string) => {
  dialogVisible.value = true
  ids.value = pid
}

const closeData = () => {
  ids.value = '-1'
}

const visibleEmit = () => {
  dialogVisible.value = false
  ids.value = '-1'
  queryProjectList()
}

const open = (id: string) => {
  useProject.queryTrace(id).then(res => {
    if (res.data.code === 200) {
      const message = res.data.msg != '' && res.data.msg == 'null' ? res.data.msg : '用户未录入'
      ElMessageBox.alert(`${message}`, '维护情况', {
        dangerouslyUseHTMLString: true
      })
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  queryProjectList()
}
const queryProjectList = () => {
  useProject.queryProjectList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}

const deleteItem = (id: string) => {
  ElMessageBox.confirm('确定要删除该人员吗?').then(() => {
    useProject.deletProject(id).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        queryProjectList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}
onMounted(() => {
  queryProjectList()
})
</script>

<style lang="scss" scoped></style>
