<template>
  <Program :isModify="false" :ids="ids" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Program from './components/Program.vue'
const ids = ref<string>('')
</script>
<style scoped></style>
