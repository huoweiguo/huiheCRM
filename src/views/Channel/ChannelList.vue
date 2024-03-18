<template>
  <el-form ref="ruleFormRef" class="mb20" :model="seacrhForm" label-width="90" :inline="true">
    <el-form-item label="公司名称" prop="companyName">
      <el-input v-model="seacrhForm.companyName" />
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <el-input v-model="seacrhForm.principal" />
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
    <el-button type="primary" @click="router.push('/channel/addChannel')">添加渠道</el-button>
  </div>
  <el-table :data="tableData" class="mb20" border style="width: 100%">
    <el-table-column label="序号" width="60" align="center" fixed="left">
      <template #default="scope">
        <span>{{ scope.$index + 1 + (seacrhForm.pageNum - 1) * seacrhForm.pageSize }} </span>
      </template>
    </el-table-column>
    <el-table-column prop="companyName" label="公司名称" align="center" />
    <el-table-column prop="principal" label="负责人" align="center" />
    <el-table-column prop="position" label="职位" align="center" />
    <el-table-column prop="companyAddress" label="公司地址" align="center" />
    <el-table-column prop="familyAddress" label="家庭地址" align="center" />
    <el-table-column prop="business" label="所属商务" align="center" />
    <el-table-column prop="saleAgm" label="所属副总" align="center" />
    <el-table-column prop="annualOrders" label="年度提单数量" align="center" />
    <el-table-column prop="address" label="提单项目" align="center">
      <template #default="scope"> <el-button link type="primary" size="small" @click="open(scope.row.id)">查看</el-button></template>
    </el-table-column>
    <el-table-column prop="annualAmount" label="年度签约金额" align="center" />
    <el-table-column prop="address" label="维护情况(时间+情况)" align="center">
      <template #default="scope"> <el-button link type="primary" size="small" @click="maintenance(scope.row.id)">查看</el-button></template>
    </el-table-column>
    <el-table-column prop="address" label="操作" align="center" fixed="right" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="showEdit(JSON.stringify(scope.row.id))">编辑</el-button>
        <el-button link type="primary" size="small" @click="deleteItem(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="fright"><el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" @change="changeTable" /></div>

  <!--编辑渠道跟进-->
  <el-dialog v-model="dialogVisible" title="编辑项目跟进" width="900" @close="closeData">
    <Channel :isModify="true" :ids="ids" @visibleEmit="visibleEmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChannelStore } from '@/store/channel'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import Channel from './components/channel.vue'
interface DataFormat {
  [index: string]: unknown
}
const useChannel = useChannelStore()
const tableData = ref<DataFormat[]>([])
const router = useRouter()
const totalNum = ref<number>(1)
const dialogVisible = ref<boolean>(false)
const ids = ref<string>('')
const seacrhForm = reactive({
  companyName: '',
  principal: '',
  business: '',
  sale: '',
  pageSize: 10,
  pageNum: 1
})
// 分页
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getChannelList()
}

// 提单项目查看
const open = (id: string) => {
  useChannel.queryChannelOrder(id).then(res => {
  console.log(res.data);
    if (res.data.code === 200) {
      const message = res.data.msg || '用户未录入'
      ElMessageBox.alert(`${message}`, '提单项目', {
        dangerouslyUseHTMLString: true
      })
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const maintenance = (id: string) => {
  useChannel.queryMaintenance(id).then(res => {
    if (res.data.code === 200) {
      const message = res.data.msg || '用户未录入'
      ElMessageBox.alert(`${message}`, '维护情况', {
        dangerouslyUseHTMLString: true
      })
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const deleteItem = (id: string) => {
  ElMessageBox.confirm('确定要删除吗?').then(() => {
    useChannel.deleteChannelItem(id).then(res => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getChannelList()
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}

const visibleEmit = () => {
  dialogVisible.value = false
  ids.value = '-1'
  getChannelList()
}
const closeData = () => {
  ids.value = '-1'
}

const showEdit = (pid: string) => {
  dialogVisible.value = true
  ids.value = pid
}

const search = () => {
  seacrhForm.pageNum = 1
  getChannelList()
}
const ruleFormRef = ref<FormInstance>()
const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}

const getChannelList = () => {
  useChannel.queryChannelList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.rows
      totalNum.value = res.data.total
    }
  })
}

onMounted(() => {
  getChannelList()
})
</script>

<style scoped></style>
