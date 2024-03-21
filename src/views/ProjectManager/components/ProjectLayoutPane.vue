<template>
  <div>
    <div style="margin-bottom: 10px; text-align: right">
      <el-button type="primary" @click="addTab(editableTabsValue)"> 添加增减项 </el-button>
    </div>
    {{ editableTabs }}
    <el-tabs v-model="editableTabsValue" type="border-card" class="demo-tabs" @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs" :key="item.settleName" :label="item.settleName" :name="item.settleName" :closable="true">
        <IntelligentCinema v-if="editableTabsValue === item.settleName" :proTabData="item" :category="props.category" @save="getList"></IntelligentCinema>
      </el-tab-pane>
      <el-tab-pane label="最终汇算" name="最终汇算">
        <FinalSettlement v-if="editableTabsValue == '最终汇算'"></FinalSettlement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useProgramStore } from '@/store/program'
import IntelligentCinema from './IntelligentCinema.vue'
import FinalSettlement from './FinalSettlement.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const useProgram = useProgramStore()
const props = defineProps(['category'])

const editableTabsValue = ref('签约合同清单')
const editableTabs = ref([] as any)
let tabs: any[] = []
let tabIndex = 0

const getList = () => {
  useProgram.getProjectSettleList({ projectId: route.params.id, pageSize: 100, pageNum: 1 }).then(d => {
    if (d.data.code == 200 && d.data.rows && d.data.rows.length > 0) {
      tabs = d.data.rows
    } else {
      tabs = [
        {
          id: '',
          settleName: '签约合同清单',
          category: '',
          type: 1
        }
      ]
    }

    editableTabs.value = tabs
    tabIndex = editableTabs.value.length
  })
}

getList()

const addTab = (targetName: string) => {
  console.log(targetName)
  const newTabName = `增减项${++tabIndex}`
  editableTabs.value.push({
    id: '',
    settleName: newTabName,
    category: '',
    type: 2
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.settleName === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.settleName
        }
      }
    })

    // 请求删除
    ElMessageBox.confirm('确定删除？')
      .then(() => {
        editableTabsValue.value = activeName
        editableTabs.value = tabs.filter(tab => tab.settleName !== targetName)
        delProject(targetName)
      })
      .catch(() => {})
  } else {
    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter(tab => tab.settleName !== targetName)
  }
}

const delProject = (targetName: String) => {
  let id = ''
  tabs.forEach(item => {
    if (item.settleName == targetName) {
      id = item.id
      return
    }
  })

  id &&
    useProgram.deleteProjectSettle(id).then(d => {
      if (d.data.code == 200) {
        ElMessage.success('删除成功')
        getList()
      }
    })
}
</script>
