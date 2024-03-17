<template>
  <div style="margin-bottom: 20px">
    <el-button type="primary" @click="addTab(editableTabsValue)"> 添加增减项 </el-button>
  </div>
  <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab">
    <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
      <component :is="item.component" :type="item.type"></component>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import ProjectLayoutPane from './components/ProjectLayoutPane.vue'

const editableTabsValue = ref('1')
const editableTabs = ref([
  {
    title: '签约合同清单',
    name: '1',
    type: 1,
    component: shallowRef(ProjectLayoutPane)
  },
  {
    title: '最终汇算',
    name: '2',
    type: 1,
    component: shallowRef(ProjectLayoutPane)
  }
])
let tabIndex = editableTabs.value.length

const addTab = (targetName: string) => {
  console.log(targetName)
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: `增减项${newTabName}`,
    name: newTabName,
    type: 2,
    component: shallowRef(ProjectLayoutPane)
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter(tab => tab.name !== targetName)
}
</script>
