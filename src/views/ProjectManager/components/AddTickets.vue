<template>
  <div class="upload-form">
    <el-form ref="ruleFormRef" :model="recommend" :rules="rules" label-width="120px" :inline="true">
      <el-form-item :label="`${typetxt[props.tickType]}日期`" prop="billDate">
        <el-date-picker v-model="recommend.billDate" type="date" :placeholder="`请选择${typetxt[props.tickType]}日期`" style="width: 192px" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item :label="`${typetxt[props.tickType]}金额`" prop="billAmount">
        <el-input v-model="recommend.billAmount" :placeholder="`请输入${typetxt[props.tickType]}金额`" />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          v-model:file-list="billImage"
          multiple
          method="post"
          list-type="picture-card"
          :limit="9"
          :headers="headersObj"
          :action="uploadUrl"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemoveImage"
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
        <el-form-item label="上传附件">
          <el-upload class="upload-demo" method="post" :headers="headersObj" :action="uploadUrl" :on-remove="handleRemove" multiple :limit="9" :on-success="handleSuccess" :file-list="billAnnex">
            <div style="width: 150px"><el-button size="small" type="primary">点击上传</el-button></div>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="recommend.remark" type="textarea" :rows="3" :placeholder="`请输入备注`" />
      </el-form-item>

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
  billImage: string
  billAnnex: string
  billImageOss: {
    url: string
    id: string
  }[]
  billAnnexOss: {
    url: string
    id: string
  }[]

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
const headersObj = ref({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const emits = defineEmits(['change'])
const props = defineProps({ tickType: { type: Number, default: 0 } })
const typetxt = ['', '开票', '收票', '收款', '付款']
const recommend = reactive<RuleBill>({
  billDate: '',
  billAmount: '',
  billImage: '',
  billAnnex: '',
  billImageOss: [],
  billAnnexOss: [],
  remark: ''
})
const addition = async (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return
  await ruleFormRef.validate(valid => {
    if (valid) {
      emits('change', recommend)
      console.log(recommend)
    }
  })
}

const rules = reactive<FormRules<RuleForm>>({
  billDate: [{ required: true, message: `请选择${typetxt[props.tickType]}日期` }],
  billAmount: [{ required: true, message: `请输入${typetxt[props.tickType]}金额` }]
})

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  billAnnex.value = uploadFiles
  recommend.billAnnex = uploadFiles.map((d: any) => d.id).join(',')
  recommend.billAnnexOss = uploadFiles.map((d: any) => ({ url: d.url, id: d.id }))
}

const handleRemoveImage: UploadProps['onRemove'] = (file, uploadFiles) => {
  billImage.value = uploadFiles
  recommend.billImage = uploadFiles.map((d: any) => d.id).join(',')
  recommend.billImageOss = uploadFiles.map((d: any) => ({ url: d.url, id: d.id }))
}

const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code === 200) {
    let arr: RuleUpload[] = []
    uploadFiles.forEach((v: any) => {
      if (v.response && v.response.code == 200) {
        arr.push({ name: v.response.data.fileName as string, url: v.response.data.url as string, id: v.response.data.ossId })
      } else {
        arr.push({ name: v.name, url: v.url as string, id: v.id })
      }
    })
    billAnnex.value = arr
    recommend.billAnnex = arr.map(d => d.id).join(',')
    recommend.billAnnexOss = arr.map(d => ({ url: d.url, id: d.id }))
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
    uploadFiles.forEach((v: any) => {
      if (v.response && v.response.code == 200) {
        arr.push({ name: v.response.data.fileName as string, url: v.response.data.url as string, id: v.response.data.ossId })
      } else {
        arr.push({ name: v.name, url: v.url as string, id: v.id })
      }
    })
    billImage.value = arr
    recommend.billImage = arr.map(d => d.id).join(',')
    recommend.billImageOss = arr.map(d => ({ url: d.url, id: d.id }))
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
