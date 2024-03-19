<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="addTab(editableTabsValue)"> 添加增减项 </el-button>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs" :key="item.settleName" :label="item.settleName" :name="item.settleName" :closable="item.type != 1">
        <ProjectLayoutPane :proTabData="item"></ProjectLayoutPane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ProjectLayoutPane from './components/ProjectLayoutPane.vue'
import { useProgramStore } from '@/store/program'
import { useRoute } from 'vue-router'

const route = useRoute()
const useProgram = useProgramStore()

useProgram.getProjectSettleList({ projectId: route.params.id, pageSize: 1, pageNum: 100 }).then(d => {
  console.log(d)
})

const editableTabsValue = ref('签约合同清单')
const editableTabs = ref([
  {
    settleName: '签约合同清单',
    type: 1
  },
  {
    settleName: '最终汇算',
    type: 1
  }
])
let tabIndex = editableTabs.value.length

const addTab = (targetName: string) => {
  console.log(targetName)
  const newTabName = `增减项${++tabIndex}`
  editableTabs.value.push({
    settleName: newTabName,
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
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter(tab => tab.settleName !== targetName)
}
</script>
