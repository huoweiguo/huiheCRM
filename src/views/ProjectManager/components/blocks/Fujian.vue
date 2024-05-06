<template>
  <div>
    <div class="cinema">
      <el-form-item label="附件模块">
        <el-button type="primary" icon="plus" @click="visible = true" v-if="!disabled">添加</el-button>
      </el-form-item>
      <div class="mb20 pl140">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="附件">
            <template #default="scope">
              <a :href="scope.row.fileurl" target="_blank">附件预览</a>
            </template>
          </el-table-column>
          <el-table-column prop="annexDesc" label="附件描述" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="createTime" label="记录时间" />
          <el-table-column label="操作" fixed="right" v-if="!disabled">
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
        <el-form-item label="附件" class="upload-form">
          <el-upload
            method="post"
            v-model:file-list="billImage"
            accept=".pdf"
            :limit="1"
            :headers="headersObj"
            :action="uploadUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccessImage"
          >
            <el-button icon="Plus"></el-button>
          </el-upload>
        </el-form-item>
        <div>
          <el-form-item label="附件描述" prop="annexDesc">
            <el-input v-model="ruleForm.annexDesc" placeholder="请输入" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入" :rows="6" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="记录时间" prop="createTime">
            <el-date-picker v-model="ruleForm.createTime" type="datetime" :placeholder="`请选择记录日期`" style="width: 192px" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
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
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
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
const props = defineProps(['form', 'disabled'])
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const visible = ref(false)
const tableData = ref([] as any)
const billImage = ref<UploadUserFile[]>([])
const headersObj = ref({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const dialogImageUrl = ref('')
const dialogVisible = ref<boolean>(false)

const ruleForm = reactive({
  annexDesc: '',
  annexId: '',
  filename: '',
  fileurl: '',
  remark: '',
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
})

tableData.value = props.form.map((v: any) => {
  return { ...v, fileurl: v.annexOss.url }
})

const delrow = (index: number) => {
  tableData.value.splice(index, 1)
  emit('update:form', tableData)
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
    ruleForm.annexId = arr[0].id
    ruleForm.fileurl = arr[0].url
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
