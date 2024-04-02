<template>
  <template v-if="isPermission">
    <Program :isModify="false" :ids="ids" />
  </template>
  <template v-else>
    <div style="padding: 30px; text-align: center">无权限</div>
  </template>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Program from './components/Program.vue'
import { useProjectStore } from '@/store/project'
import { ElMessage } from 'element-plus'
const useProject = useProjectStore()
const ids = ref<string>('')

// 获取是否权限
const isPermission = ref<boolean>(false)
useProject.hasPermission().then(res => {
  if (res.data.code === 200) {
    isPermission.value = res.data.data
  } else {
    ElMessage.error(res.data.msg)
  }
})
</script>
<style scoped></style>
