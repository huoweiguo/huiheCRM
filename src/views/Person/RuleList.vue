<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="seacrhForm.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="mb20">
    <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
  </div>

  <el-table :data="tableData" class="mb20" border style="width: 100%">
    <el-table-column prop="id" label="序号" width="60" align="center" fixed="left" />
    <el-table-column prop="name" label="角色名称" align="center" />
    <el-table-column prop="createTime" label="创建时间" align="center" />
    <el-table-column label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright">
    <el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" v-model:current-page="seacrhForm.pageNum" @change="changeTable" />
  </div>

  <!--添加人员-->
  <el-dialog v-model="dialogVisible" title="添加角色" width="450" :before-close="handleClose">
    <el-form ref="ruleFormRef" v-model="personRole">
      <el-form-item label="角色名称" :label-width="100" prop="name">
        <el-input v-model="personRole.name" autocomplete="off" style="width: 260px" />
      </el-form-item>
      <el-form-item label="角色权限" :label-width="100" prop="roles">
        <label class="label-role" v-for="item in roleList" :key="item.value"><input type="checkbox" v-model="personRole.roles" :value="item.value" /> {{ item.label }}</label>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePerson"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roleListSchame } from '@/utils/fixedData'
import type { FormInstance } from 'element-plus'
import { useRoleStore } from '@/store/role'

const seacrhForm = reactive({
  name: '',
  pageSize: 10,
  pageNum: 1,
  orderByColumn: '',
  isAsc: ''
})
const totalNum = ref<number>(1)
const tableData = ref([])
const useRole = useRoleStore()
const ruleFormRef = ref<FormInstance>()
const search = () => {
  seacrhForm.pageNum = 1
  getRoleList()
}
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

interface RoleList {
  label: string
  value: number | string
}
interface PersonRule {
  name: string
  roles: []
}
const roleList = ref<RoleList[]>(roleListSchame)
// 添加角色
const personRole = reactive<PersonRule>({
  name: '',
  roles: []
})
const dialogVisible = ref<Boolean>(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const deleteRole = (id: string) => {
  ElMessageBox.confirm('确定要删除该人员吗?').then(() => {
    useRole.deleteRoleById(id).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除角色成功')
        getRoleList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}
const savePerson = () => {}
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getRoleList()
}
const getRoleList = () => {
  useRole.getRoleList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}
onMounted(() => {
  getRoleList()
  // 查询可用角色
  useRole.queryAvailableRole().then(res => {
    if (res.data.code === 200) {
      console.log(res)
    }
  })
})
</script>

<style lang="scss" scoped>
.label-role {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-right: 20px;
  color: #666;
  cursor: pointer;
  input {
    margin-right: 5px;
  }
}
</style>
