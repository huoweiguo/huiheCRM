<template>
  <div class="upload-form">
    <el-form ref="ruleFormRef" :model="recommend" :rules="rules" label-width="120px" :inline="true">
      <el-form-item label="开票日期" prop="billDate">
        <el-date-picker v-model="recommend.billDate" type="date" placeholder="请选择开票日期" style="width: 192px"></el-date-picker>
      </el-form-item>
      <el-form-item label="开票金额" prop="billAmount">
        <el-input v-model="recommend.billAmount" placeholder="请输入开票金额" />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload v-model:file-list="billImage" multiple method="post" :headers="headersObj" :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccessImage">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="图片预览" />
        </el-dialog>
      </el-form-item>
      <div>
        <el-form-item label="上传附件">
          <el-upload class="upload-demo" method="post" :headers="headersObj" :action="uploadUrl" :on-remove="handleRemoveImage" multiple :limit="9" :on-success="handleSuccess" :file-list="billAnnex">
            <div style="width: 150px"><el-button size="small" type="primary">点击上传</el-button></div>
          </el-upload>
        </el-form-item>
      </div>

      <div style="margin-left: 120px">
        <el-form-item>
          <el-button type="primary" @click="addition(ruleFormRef)">确定</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, defineEmits, defineProps } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadFile, UploadFiles, FormRules, FormInstance } from 'element-plus'
import { uploadUrl } from '@/utils/api'
import { useRouter } from 'vue-router'
interface RuleUpload {
  name: string
  url: string
  id: string
  [key: string]: unknown
}
interface RuleBill {
  billDate: string
  billAmount: string
  billImage: RuleUpload[]
  billAnnex: RuleUpload[]
  remark: string
}
interface RuleForm {
  billDate: string
  billAmount: string
}
const router = useRouter()
const billImage = ref<UploadUserFile[]>([])
const billAnnex = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const headersObj = ref({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})
const emits = defineEmits(['openTicket', 'receiveTicket', 'receiveCash', 'payCash'])
const props = defineProps({
  tickType: String
})
const recommend = reactive<RuleBill>({
  billDate: '',
  billAmount: '',
  billImage: [],
  billAnnex: [],
  remark: ''
})
const addition = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(valid => {
    if (valid) {
      switch (props.tickType) {
        case '1':
          emits('openTicket', recommend)
          break
        case '2':
          emits('receiveTicket', recommend)
          break
        case '3':
          emits('receiveCash', recommend)
          break
        case '4':
          emits('payCash', recommend)
          break
        default:
      }
      console.log(recommend)
    }
  })
}

const rules = reactive<FormRules<RuleForm>>({
  billDate: [{ required: true, message: '请选择开票日期' }],
  billAmount: [{ required: true, message: '请输入开票金额' }]
})

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handleRemoveImage: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code === 200) {
    let arr: RuleUpload[] = []
    uploadFiles.map((v: any) => {
      arr = [...arr, { name: v.response.data.fileName as string, url: v.response.data.url as string, id: v.response.data.ossId }]
    })
    billAnnex.value = arr
    recommend.billAnnex = arr
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

const handleSuccessImage: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code === 200) {
    let arr: RuleUpload[] = []
    uploadFiles.map((v: any) => {
      arr = [...arr, { name: v.response.data.fileName as string, url: v.response.data.url as string, id: v.response.data.ossId }]
    })
    billImage.value = arr
    recommend.billImage = arr
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

const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
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
