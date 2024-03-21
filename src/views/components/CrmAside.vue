<template>
  <div class="crm-aside">
    <el-row class="tac">
      <el-col>
        <el-menu :default-active="menuActive" :unique-opened="true" class="el-menu-vertical-demo">
          <el-menu-item index="dashboard" @click="goLink('/dashboard')">
            <el-icon><DataAnalysis /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <template v-for="attr in menuRouts" :key="attr.path">
            <el-sub-menu v-if="attr.meta?.hidden !== true || attr.meta?.hidden === undefined" :index="attr.path">
              <template #title>
                <el-icon><Folder /></el-icon>
                <span>{{ attr.meta?.title }}</span>
              </template>
              <template v-for="item in attr.children" :key="attr.path + item.path">
                <el-menu-item
                  :index="attr.path + '/' + item.path"
                  v-if="item.meta?.hidden !== true || item.meta?.hidden === undefined"
                  @click="goLink((attr.path == '/' ? attr.path : attr.path + '/') + item.path)"
                >
                  {{ item.meta?.title }}
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { menuRouts } from '@/router/index'

// import { useLoginStore } from '@/store/login'
// const { getRouters } = useLoginStore()
// const menuRouts = ref([] as any)
// getRouters().then(res => {
//   menuRouts.value = res.data.data || []
// })

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
