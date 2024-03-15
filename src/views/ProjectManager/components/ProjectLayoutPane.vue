<template>
  <div class="table-panes">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="智能+影院项目汇算表" name="first">
        <IntelligentCinema />
      </el-tab-pane>
      <el-tab-pane label="灯具项目汇算表" name="second">
        <IntelligentCinema />
      </el-tab-pane>
      <el-tab-pane label="计算公式" name="third">
        <ComputePane />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import ComputePane from './ComputePane.vue'
import IntelligentCinema from './IntelligentCinema.vue'
import { useProgramStore } from '@/store/program'
import { useRoute } from 'vue-router'
import { useRoleStore } from '@/store/role'
const activeName = ref<string>('first')
const useProgram = useProgramStore()
const route = useRoute()
const useRole = useRoleStore()
const ids = ref<string>(route.params.id as string)
const seacrhForm = reactive({
  name: '',
  pageSize: 100,
  pageNum: 1,
  orderByColumn: '',
  isAsc: ''
})

const getSalesTeam = () => {
  useRole.getTeamList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      useProgram.saleTeam = res.data.rows
    }
  })
}
const getProjectSettle = () => {
  useProgram.getProjectSettle(ids.value).then(res => {})
}
onMounted(() => {
  getSalesTeam()
  getProjectSettle()

  useRole.queryUserByType({ type: '1' }).then(res => {
    if (res.data.code === 200) {
      useRole.businessList = res.data.data
    }
  })

  useRole.queryUserByType({ type: '2' }).then(res => {
    if (res.data.code === 200) {
      useRole.lightSalesList = res.data.data
    }
  })

  useRole.queryUserByType({ type: '3' }).then(res => {
    if (res.data.code === 200) {
      useRole.projectManagerList = res.data.data
    }
  })

  useRole.queryUserByType({ type: '4' }).then(res => {
    if (res.data.code === 200) {
      useRole.lightProjectManagerList = res.data.data
    }
  })
})
</script>
<style lang="scss" scoped></style>
