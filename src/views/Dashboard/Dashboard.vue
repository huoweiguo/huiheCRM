<template>
  <div class="dashboard-section mb50">
    <h3>团队销售排行</h3>
    <div class="table-title">
      <span>销售总额：{{ tableData.saleTotal }}</span>
      <span>利润总额：{{ tableData.profitTotal }}</span>
    </div>
    <el-table :data="tableData.statictis" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="排行" align="center" width="80" />
      <el-table-column prop="departmentName" label="团队" align="center" />
      <el-table-column prop="saleAmount" label="销售额" align="center" />
      <el-table-column prop="profit" label="团队利润" align="center" />
    </el-table>
  </div>

  <div class="dashboard-section">
    <h3>项目签约</h3>
    <div class="table-title">
      <span>签约金额总计：{{ totalContractedAmount }}</span>
    </div>
    <el-table class="mb20" :data="projectlist" border style="width: 100%" v-loading="ploading">
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="projectAddress" label="项目地址" align="center" />
      <el-table-column prop="contractAmount" label="签约金额" align="center" />
      <el-table-column prop="projectProgress" label="项目进度" align="center">
        <template #default="scope">
          <span>{{ types[scope.row.projectProgress] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="business" label="商务" align="center" />
      <el-table-column prop="pm" label="项目经理" align="center" />
    </el-table>
    <div class="fright">
      <el-pagination small background layout="prev, pager, next" :total="totalNum" :pageSize="seacrhForm.pageSize" v-model:current-page="seacrhForm.pageNum" @change="changeTable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProgramStore } from '@/store/program'
const tableData = ref({}) as any
const projectlist = ref([])
const totalNum = ref<number>(1)
const ploading = ref<boolean>(true)
const loading = ref<boolean>(true)
const useProgram = useProgramStore()
const totalContractedAmount = ref<number>(0)
const types = ['', '项目移交', '图纸深化', '隐形验收', '木工阶段', '涂画阶段', '主材备货', '安装结束', '预调试', '调试结束', '收尾阶段', '内部验收', '完工验收']
const seacrhForm = reactive({
  projectName: '',
  business: '',
  sale: '',
  pageSize: 10,
  pageNum: 1
})
const changeTable = (current: number) => {
  seacrhForm.pageNum = current
  getProjectList()
}
const getProjectList = () => {
  useProgram.getProgramList(seacrhForm).then(res => {
    if (res.data.code === 200) {
      projectlist.value = res.data.rows
      totalNum.value = res.data.total
    }
    ploading.value = false
  })
}

useProgram.getAmountSum(seacrhForm).then(res => {
  if (res.data.code === 200) {
    totalContractedAmount.value = res.data.data
  }
})

onMounted(() => {
  useProgram.saleLevel().then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.data
    }
    loading.value = false
  })

  getProjectList()
})
</script>

<style lang="scss" scoped>
.dashboard-section {
  h3 {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
  }
}
.table-title {
  display: flex;
  line-height: 3;
  span {
    margin-right: 30px;
  }
}
</style>
