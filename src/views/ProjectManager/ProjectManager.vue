<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="项目编号" prop="projectId">
      <el-input v-model="seacrhForm.projectId" placeholder="请输入项目编号" />
    </el-form-item>
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="seacrhForm.projectName" placeholder="请输入项目名称" />
    </el-form-item>
    <el-form-item label="项目进度" prop="projectProgress">
      <el-select v-model="seacrhForm.projectProgress" placeholder="请选择项目进度" clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option v-for="item in projectSchedule" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="商务" prop="business">
      <el-input v-model="seacrhForm.business" placeholder="请输入所属商务" />
    </el-form-item>
    <el-form-item label="项目经理" prop="pm">
      <el-input v-model="seacrhForm.pm" placeholder="请输入项目经理" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="mb20">
    <el-button type="primary" @click="goProgram" v-hasPermi="['project:add']">项目录入</el-button>
    <el-upload
      v-hasPermi="['project:import']"
      style="display: inline-block; margin-left: 20px"
      method="post"
      :file-list="fileList"
      :auto-upload="false"
      :limit="1"
      :on-change="changeFile"
      :show-file-list="false"
      accept=".xlsx, .xls"
    >
      <el-button type="primary">导入</el-button>
    </el-upload>
  </div>

  <el-table :data="tableData" class="mb20" border style="width: 100%">
    <el-table-column label="序号" width="60" align="center">
      <template #default="scope">
        <span>{{ scope.$index + 1 + (seacrhForm.pageNum - 1) * seacrhForm.pageSize }} </span>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="项目编号" align="center" />
    <el-table-column prop="projectName" label="项目名称" align="center" />
    <el-table-column prop="projectAddress" label="项目地址" align="center" />
    <el-table-column prop="contractAmount" label="签约金额" align="center" />
    <el-table-column label="项目进度" align="center">
      <template #default="scope">
        {{ projectSchedule[scope.row.projectProgress - 1]?.label }}
      </template>
    </el-table-column>
    <el-table-column prop="business" label="商务" align="center" />
    <el-table-column prop="pm" label="项目经理" align="center" />
    <el-table-column label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="visibleUpdate(JSON.stringify(scope.row.id))" v-hasPermi="['project:edit']">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteItem(JSON.stringify(scope.row.id))" v-hasPermi="['project:delete']">删除</el-button>
        <el-button link type="primary" size="small" @click="goCompute(JSON.stringify(scope.row.id))" v-hasPermi="['prooject:settlement:info']">项目汇算</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright">
    <el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" v-model:current-page="seacrhForm.pageNum" @change="changeTable" />
  </div>
  <!--编辑项目-->
  <el-dialog v-model="dialogVisible" title="编辑项目跟进" width="900" @close="closeData">
    <Program :isModify="true" :ids="ids" @visibleEmit="visibleEmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProgramStore } from '@/store/program'
import { useProjectStore } from '@/store/project'
import { projectSchedule } from '@/utils/fixedData'
import { ElMessage, ElMessageBox } from 'element-plus'
import Program from './components/Program.vue'
import router from '@/router'
import type { UploadFile, FormInstance } from 'element-plus'

const fileList = ref<UploadFile[]>([])
const changeFile = (uploadFile: UploadFile | Boolean | any) => {
  const formData = new FormData()
  formData.append('file', uploadFile.raw, uploadFile.name)
  useProject.importProject(formData).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('上传成功')
      seacrhForm.pageNum = 1
      getProgramList()
    } else {
      ElMessage.error(res.data.msg)
    }
    fileList.value = []
  })
}

const tableData = ref([])
const ruleFormRef = ref<FormInstance>()
const useProgram = useProgramStore()
const useProject = useProjectStore()
const totalNum = ref<number>(1)
const dialogVisible = ref<boolean>(false)
const ids = ref<string>('')
const seacrhForm = reactive({
  projectId: '',
  projectName: '',
  projectProgress: '',
  business: '',
  pm: '',
  pageSize: 10,
  pageNum: 1
})
const goProgram = () => {
  router.push('/projectManager/projectInput')
}
const search = () => {
  seacrhForm.pageNum = 1
  getProgramList()
}
const goCompute = (id: string) => {
  router.push(`/projectManager/projectComputed/${id}`)
}
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getProgramList()
}
const visibleUpdate = (pid: string) => {
  ids.value = pid
  dialogVisible.value = true
}
const deleteItem = (id: string) => {
  ElMessageBox.confirm('确定要删除该人员吗?').then(() => {
    useProgram.deleteProgramItem(id).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getProgramList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}
const closeData = () => {
  ids.value = '-1'
}
const visibleEmit = () => {
  dialogVisible.value = false
  ids.value = '-1'
  getProgramList()
}

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

const getProgramList = () => {
  useProgram.getProgramList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}
onMounted(() => {
  getProgramList()
})
</script>

<style scoped></style>
