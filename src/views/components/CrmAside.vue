<template>
  <div class="crm-aside">
    <el-row class="tac">
      <el-col>
        <el-menu :default-active="menuActive" :unique-opened="true" class="el-menu-vertical-demo">
          <el-menu-item index="dashboard" @click="goLink('/dashboard')">
            <el-icon><DataAnalysis /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-sub-menu v-for="attr in menuRouts" :index="attr.path" :key="attr.path">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>{{ attr.meta?.title }}</span>
            </template>
            <template v-for="item in attr.children" :key="attr.path + item.path">
              <el-menu-item :index="attr.path + '/' + item.path" v-if="item.meta?.hidden !== true || item.meta?.hidden === undefined" @click="goLink(attr.path + '/' + item.path)">
                {{ item.meta?.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { menuRouts } from '@/router/index'

const menuActive = ref<string>('/productManager/productList')
const router = useRouter()
const goLink = (path: string) => {
  router.push(path)
}

watchEffect(() => {
  menuActive.value = router.currentRoute.value.fullPath
})
</script>

<style lang="scss">
.crm-aside {
  .el-menu {
    background-color: transparent !important;
    border-right: none !important;
    .el-menu-item {
      color: #fff;
      &:hover {
        background-color: #777 !important;
      }
    }
    .el-sub-menu__title {
      color: #fff;
      border-top: 1px solid #ccc;
      &:hover {
        background-color: #777 !important;
      }
    }
  }
  .is-active {
    .el-sub-menu__title {
      background-color: #555 !important;
    }
  }
  .el-sub-menu {
    .is-active {
      background-color: #777 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.crm-aside {
  width: 200px;
  height: 100%;
  background-color: rgba(99, 99, 99, 1);
}
</style>
