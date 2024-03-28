<template>
  <div>
    <div class="cinema">
      <el-form-item label="开票">
        <el-button type="primary" icon="plus" @click="visible = true">添加</el-button>
      </el-form-item>
      <div class="mb20 pl140">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="billDate" label="开票日期" />
          <el-table-column prop="billAmount" label="开票金额" />
          <el-table-column label="图片">
            <template #default="scope">
              <el-image
                v-for="(item, index) in scope.row.billImageOss"
                :key="index"
                style="width: 30px; height: 30px"
                :src="item.url"
                :preview-src-list="scope.row.billImageOss.map((item: any) => item.url)"
                :initial-index="index"
                :preview-teleported="true"
                fit="contain"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="delrow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--添加开票-->
    <el-dialog v-model="visible" title="添加开票" width="750" align-center destroy-on-close>
      <AddTickets :tickType="1" @change="change" />
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

tableData.value = props.form.bill || []

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
}

const change = (data: any) => {
  visible.value = false
  tableData.value.push({ ...data })
  emit('update:form', {
    type: 1,
    bill: tableData.value
  })
}
</script>
../AddTickets.vue
