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

let tabs = [
  {
    id: '',
    settleName: '签约合同清单',
    category: '',
    type: 1
  },
  {
    id: '',
    settleName: '最终汇算',
    category: '',
    type: 1
  }
]
const editableTabsValue = ref(tabs[0].settleName)
const editableTabs = ref([] as any)
let tabIndex = 0

useProgram.getProjectSettleList({ projectId: route.params.id, pageSize: 1, pageNum: 100 }).then(d => {
  if (d.data.code == 200 && d.data.rows) {
    d.data.rows.forEach((e: any) => {
      let hasname = false
      tabs.forEach((item, index) => {
        if (e.settleName == item.settleName) {
          hasname = true
          tabs[index] = e
        }
      })

      if (!hasname) {
        tabs.push(e)
      }
    })
  }

  editableTabs.value = tabs
  tabIndex = editableTabs.value.length
})

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
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter(tab => tab.settleName !== targetName)
}
</script>
