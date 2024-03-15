<template>
  <Channel :isModify="false" :id="ids" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Channel from './components/channel.vue'
const ids = ref<string>('')
</script>

<style scoped></style>
