<template>
  <ProjectTable :isModify="false" :id="ids" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectTable from './components/ProjectTable.vue'
const ids = ref<string>('')
</script>

<style scoped></style>
