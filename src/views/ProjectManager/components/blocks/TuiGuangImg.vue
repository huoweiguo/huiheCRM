<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadFile, UploadFiles, FormRules, FormInstance } from 'element-plus'
import { uploadUrl } from '@/utils/api'
import { useRouter } from 'vue-router'
import { commonStore } from '@/store/common'

interface RuleUpload {
  name: string
  url: string
  id: string
  [key: string]: unknown
}

const emit = defineEmits(['update:form'])
const props = defineProps(['form'])
const router = useRouter()
const headersObj = ref({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const dialogVisible = ref<boolean>(false)
const billImage = ref([] as RuleUpload[])
const dialogImageUrl = ref('')
const useCommon = commonStore()

// 初始化数据
if (props.form) {
  useCommon.getOssImgs(props.form).then(res => {
    if (res.data.code === 200) {
      billImage.value = res.data.data.map((d: any) => {
        return { name: d.originalName, url: d.url, id: d.ossId }
      })
    }
  })
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
    emit('update:form', arr.map(d => d.id).join(','))
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

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  emit('update:form', uploadFiles.map((d: any) => d.id).join(','))
}
</script>

<style lang="less" scoped></style>
