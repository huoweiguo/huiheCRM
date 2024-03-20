<template>
  <div>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="智能+影院项目汇算表" name="1">
        <ProjectLayoutPane :category="1" />
      </el-tab-pane>
      <el-tab-pane label="灯具项目汇算表" name="2">
        <ProjectLayoutPane :category="2" />
      </el-tab-pane>
      <el-tab-pane label="计算公式" name="3">
        <ComputePane />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ProjectLayoutPane from './components/ProjectLayoutPane.vue'
import ComputePane from './components/ComputePane.vue'
const activeTabName = ref('1')
</script>
