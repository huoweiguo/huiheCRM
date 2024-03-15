<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="团队" prop="name">
      <el-input v-model="seacrhForm.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="mb20">
    <el-button type="primary" @click="addTeamVisible">添加团队</el-button>
  </div>

  <el-table :data="tableData" class="mb20" border style="width: 100%">
    <el-table-column label="序号" width="60" align="center" fixed="left">
      <template #default="scope">
        <span>{{ scope.$index + 1 + (seacrhForm.pageNum - 1) * seacrhForm.pageSize }} </span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="团队名称" align="center" />
    <el-table-column prop="createTime" label="创建时间" align="center" />
    <el-table-column label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="updateTeamVisible(scope.row)">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteTeam(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" @change="changeTable" /></div>

  <!--添加团队-->
  <el-dialog v-model="dialogVisible" :title="isModify ? '编辑团队' : '添加团队'" width="450">
    <el-form :model="team" :rules="rules" ref="teamFormRef">
      <el-form-item label="团队名称" :label-width="100" prop="name">
        <el-input v-model="team.name" autocomplete="off" style="width: 260px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePerson(teamFormRef)"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoleStore } from '@/store/role'
import * as _ from 'lodash'

const useRole = useRoleStore()
const seacrhForm = reactive({
  name: '',
  pageSize: 10,
  pageNum: 1,
  orderByColumn: '',
  isAsc: ''
})
const tableData = ref([])
const totalNum = ref<number>(1)
const ruleFormRef = ref<FormInstance>()
const teamFormRef = ref<FormInstance>()
const isModify = ref<boolean>(false)
const search = () => {}
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

interface RuleTeam {
  name: string
  id: string
  [key: string]: unknown
}

// 添加团队
const team = reactive({
  id: '',
  name: ''
})

const rules = reactive<FormRules<RuleTeam>>({
  name: [{ required: true, message: '请输入团队名称' }]
})

const dialogVisible = ref<Boolean>(false)
const deleteTeam = (id: string) => {
  ElMessageBox.confirm('确定要删除此项吗?').then(() => {
    useRole.deleteTeamById(id).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getTeamList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}
const addTeamVisible = () => {
  dialogVisible.value = true
  isModify.value = false
  team.id = ''
  team.name = ''
}
const updateTeamVisible = (row: RuleTeam) => {
  dialogVisible.value = true
  isModify.value = true
  team.id = row.id
  team.name = row.name
}
const createTeam = () => {
  useRole.createTeam(team).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('添加团队成功')
      getTeamList()
      dialogVisible.value = false
      team.name = ''
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const updateTeam = () => {
  useRole.updateTeam(team).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改信息成功')
      getTeamList()
      dialogVisible.value = false
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const savePerson = async (teamFormRef: FormInstance | undefined) => {
  if (!teamFormRef) return
  await teamFormRef.validate(valid => {
    if (valid) {
      console.log(isModify.value, 'isModify.value')
      isModify.value ? updateTeam() : createTeam()
    }
  })
}
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getTeamList()
}
const getTeamList = () => {
  useRole.getTeamList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}
onMounted(() => {
  getTeamList()
})
</script>

<style lang="scss" scoped></style>
