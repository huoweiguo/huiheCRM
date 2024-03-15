<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="团队" prop="deptId">
      <el-select v-model="seacrhForm.deptId" class="m-2" placeholder="请选择团队" style="width: 192px">
        <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="角色" prop="roleName">
      <el-input v-model="seacrhForm.roleName" placeholder="请输入角色" />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="seacrhForm.name" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="人员状态" prop="status">
      <el-select v-model="seacrhForm.status" class="m-2" placeholder="请选择人员状态" style="width: 192px">
        <el-option label="全部" value="" />
        <el-option label="启用" value="0" />
        <el-option label="禁用" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="mb20">
    <el-button type="primary" @click="createPersonVisible">添加人员</el-button>
  </div>

  <el-table :data="tableData" class="mb20" border style="width: 100%" :loading="loading">
    <el-table-column label="序号" width="60" align="center" fixed="left">
      <template #default="scope">
        <span>{{ scope.$index + 1 + (seacrhForm.pageNum - 1) * seacrhForm.pageSize }} </span>
      </template>
    </el-table-column>
    <el-table-column prop="departmentName" label="团队" align="center" />
    <el-table-column prop="roleName" label="角色" align="center" />
    <el-table-column prop="userName" label="姓名" align="center" />
    <el-table-column prop="account" label="登录账号" align="center" />
    <el-table-column prop="status" label="人员状态" align="center">
      <template #default="scope">
        <span>{{ scope.row.status == '1' ? '禁用' : '启用' }} </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="modifyUserVisible(scope.row)">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteUser(scope.row.userId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" @change="changeTable" /></div>

  <!--添加人员-->
  <el-dialog v-model="dialogVisible" :title="isModify ? '编辑人员' : '添加人员'" width="450">
    <el-form :model="person" :rules="rules" ref="personFromRef">
      <el-form-item label="团队" :label-width="100" prop="departmentId">
        <el-select v-model="person.departmentId" class="m-2" placeholder="请选择团队" style="width: 260px">
          <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称" :label-width="100" prop="roleId">
        <el-select v-model="person.roleId" class="m-2" placeholder="请选择角色" style="width: 260px">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" :label-width="100" prop="username">
        <el-input v-model="person.username" style="width: 260px" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="登录账号" :label-width="100" prop="account">
        <el-input v-model="person.account" style="width: 260px" placeholder="请输入登录账号" />
      </el-form-item>
      <el-form-item label="登录密码" :label-width="100" prop="password" v-if="!isModify">
        <el-input v-model="person.password" type="password" style="width: 260px" placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item label="人员状态" :label-width="100" prop="status">
        <label class="mr20"><input type="radio" name="status" value="0" v-model="person.status" /> 启用</label>
        <label><input type="radio" name="status" value="1" v-model="person.status" /> 禁用</label>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button id="cancelBtn" @click="cancelFrom">取消</el-button>
        <el-button type="primary" @click="savePerson(personFromRef)"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoleStore } from '@/store/role'
import { commonStore } from '@/store/common'
import type { FormInstance, FormRules } from 'element-plus'

const seacrhForm = reactive({
  name: '',
  status: '',
  deptId: '',
  roleName: '',
  pageSize: 10,
  pageNum: 1
})
interface UserRule {
  [key: string]: unknown
}
const tableData = ref([])
const totalNum = ref(1)
const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const personFromRef = ref<FormInstance>()
const useRole = useRoleStore()
const useCommon = commonStore()
const isModify = ref<boolean>(false)

interface RuleRoles {
  userId?: string
  departmentId: string
  roleId: string
  username: string
  password: string | null
  status: string
  account: string
  [key: string]: unknown
}
const rules = reactive<FormRules<RuleRoles>>({
  departmentId: [{ required: true, message: '请选择团队' }],
  roleId: [{ required: true, message: '请选择角色' }],
  username: [{ required: true, message: '请输入姓名' }],
  account: [{ required: true, message: '请输入账户名' }],
  password: [{ required: true, message: '请输入密码' }],
  status: [{ required: true, message: '请选择状态' }]
})

// 添加人员
const person = reactive<RuleRoles>({
  userId: '',
  departmentId: '',
  roleId: '',
  username: '',
  password: '',
  status: '0',
  account: ''
})

const dialogVisible = ref<Boolean>(false)
const teamList = ref<UserRule[]>([])
const roleList = ref<UserRule[]>([])
const savePerson = async (personFromRef: FormInstance | undefined) => {
  if (!personFromRef) return
  await personFromRef.validate(valid => {
    if (valid) {
      isModify.value ? modifyUser() : createPerson()
    }
  })
}
const createPersonVisible = () => {
  isModify.value = false
  for (let attr in person) {
    person[attr] = ''
  }
  person.status = '0'
  dialogVisible.value = true
}
const createPerson = () => {
  useRole.createUser(person).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('新增员工成功')
      const cancelBtn: HTMLButtonElement = document.querySelector('#cancelBtn') as HTMLButtonElement
      cancelBtn.click()
      dialogVisible.value = false
      getUserList()
    } else {
      ElMessage.error(res.data.mes)
    }
  })
}
const modifyUser = () => {
  useRole.modifyUser(person).then(res => {
    if (res.data.code === 200) {
      ElMessage.success('修改员工信息成功')
      const cancelBtn: HTMLButtonElement = document.querySelector('#cancelBtn') as HTMLButtonElement
      cancelBtn.click()
      dialogVisible.value = false
      getUserList()
    } else {
      ElMessage.error(res.data.mes)
    }
  })
}
const modifyUserVisible = (row: RuleRoles) => {
  dialogVisible.value = true
  isModify.value = true
  for (let attr in person) {
    if (row[attr]) {
      person[attr] = row[attr]
    }
  }
  person.username = row.userName as string
  person.password = null
}
const search = () => {
  seacrhForm.pageNum = 1
  getUserList()
}
const deleteUser = (userId: string) => {
  ElMessageBox.confirm('确定要删除该人员吗?').then(() => {
    useRole.deleteUser(userId).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除人员成功')
        getUserList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}
const cancelFrom = () => {
  dialogVisible.value = false
}
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getUserList()
}

const getUserList = () => {
  loading.value = true
  useRole.getUserList(seacrhForm).then(res => {
    loading.value = false
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}
const getRoleSelectList = () => {
  useCommon.getRuleSelectList().then(res => {
    if (res.data.code === 200) {
      roleList.value = res.data.data
    }
  })
}
const getTeamSelectList = () => {
  useCommon.getTeamSelectList().then(res => {
    if (res.data.code === 200) {
      teamList.value = res.data.data
    }
  })
}

onMounted(() => {
  getUserList()
  getRoleSelectList()
  getTeamSelectList()
})
</script>

<style lang="scss" scoped></style>
