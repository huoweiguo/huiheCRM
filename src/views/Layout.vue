<template>
  <el-container>
    <el-header>
      <crm-header></crm-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <crm-aside></crm-aside>
      </el-aside>
      <el-main>
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item v-for="item in routerArray" :key="item.path">{{ item.meta?.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-crm">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import CrmHeader from '@/views/components/CrmHeader.vue'
import CrmAside from '@/views/components/CrmAside.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let routerArray = ref<any[]>()

watchEffect(() => {
  routerArray.value = router.currentRoute.value.matched as []
})
</script>

<style lang="scss">
.el-breadcrumb {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}
.content-crm {
  padding: 20px;
  height: calc(100vh - 160px);
  overflow-y: scroll;
}
</style>
