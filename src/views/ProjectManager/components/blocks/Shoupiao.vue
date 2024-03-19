<template>
  <div>
    <div class="cinema">
      <el-form-item label="收票">
        <el-button type="primary" icon="plus" @click="visible = true">添加</el-button>
      </el-form-item>
      <div class="mb20 pl140">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="billDate" label="收票日期" />
          <el-table-column prop="billAmount" label="收票金额" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" size="small" @click="delrow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--添加收票-->
    <el-dialog v-model="visible" title="添加收票" width="750" align-center destroy-on-close>
      <AddTickets tickType="2" @change="change" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import AddTickets from '../AddTickets.vue'

const emit = defineEmits(['update:form'])
const props = defineProps(['form'])
const visible = ref(false)
const tableData = ref([] as any)

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
}

const change = (data: any) => {
  visible.value = false
  tableData.value.push({ ...data })
  emit('update:form', {
    type: 2,
    bill: tableData.value
  })
}
</script>
../AddTickets.vue
