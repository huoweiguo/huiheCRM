<template>
  <div>
    <div class="cinema">
      <el-form-item label="其他">
        <el-button type="primary" icon="plus" @click="visible = true">添加</el-button>
      </el-form-item>
      <div class="mb20 pl140">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="recordDate" label="其他成本日期" />
          <el-table-column prop="amount" label="其他成本金额" />
          <el-table-column prop="remark" label="其他成本备注" />
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="delrow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--添加-->
    <el-dialog v-model="visible" title="添加" width="750" align-center destroy-on-close>
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px">
        <el-form-item label="其他成本金额" prop="amount">
          <el-input v-model="ruleForm.amount" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="记录日期" prop="recordDate">
          <el-date-picker v-model="ruleForm.recordDate" type="datetime" :placeholder="`请选择记录日期`" style="width: 192px" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="其他成本图片" class="upload-form">
          <el-upload
            v-model:file-list="billImage"
            multiple
            method="post"
            list-type="picture-card"
            :limit="9"
            :headers="headersObj"
            :action="uploadUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccessImage"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="图片预览" />
          </el-dialog>
        </el-form-item>
        <div>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入" :rows="6" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadUserFile, UploadProps, UploadFile, UploadFiles } from 'element-plus'
import { uploadUrl } from '@/utils/api'
import { useRouter } from 'vue-router'

interface RuleUpload {
  name: string
  url: string
  id: string
  [key: string]: unknown
}

const emit = defineEmits(['update:form'])
const props = defineProps(['form'])
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const visible = ref(false)
const tableData = ref([] as any)
const billImage = ref<UploadUserFile[]>([])
const headersObj = ref({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const dialogImageUrl = ref('')
const dialogVisible = ref<boolean>(false)

const ruleForm = reactive({
  amount: '',
  recordDate: '',
  costImage: '',
  remark: ''
})

tableData.value = props.form

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
}

function isEmpty(obj: Record<string, string>): boolean {
  return Object.keys(obj).every(key => {
    return obj[key] === null || obj[key] === undefined || obj[key] === ''
  })
}

const save = (ruleFormRef: FormInstance | undefined) => {
  visible.value = false
  if (!isEmpty(ruleForm)) {
    tableData.value.push({ ...ruleForm })
    emit('update:form', tableData)
  }
  resetForm(ruleFormRef)
}

const resetForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
  billImage.value = []
}

const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handleSuccessImage: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code === 200) {
    let arr: RuleUpload[] = []
    uploadFiles.map((v: any) => {
      arr = [...arr, { name: v.response.data.fileName as string, url: v.response.data.url as string, id: v.response.data.ossId }]
    })
    billImage.value = arr
  } else if (response.code === 401) {
    ElMessage.closeAll()
    ElMessage.error('登录超时，请重新登录')
    setTimeout(() => {
      router.push('/login')
    })
  } else {
    ElMessage.error(response.msg)
  }
}
</script>

<style lang="scss">
.upload-form {
  .el-upload-list--picture-card {
    --el-upload-list-picture-card-size: 78px;
  }

  .el-upload--picture-card {
    --el-upload-picture-card-size: 78px;
  }
}
</style>
