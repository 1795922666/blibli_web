<template>
  <div class="zj-upload">
    <n-alert v-if="uploaded.uploadError" type="error" class="mt-3">
      {{ uploaded.uploadError }}
    </n-alert>
    <n-upload
      multiple
      directory-dnd
      :max="1"
      :file-list="fileList"
      :custom-request="customRequest"
      :show-file-list="false"
      @change="handleFileChange"
      @before-upload="handleBeforeUpload"
    >
      <template #default>
        <div v-if="fileList.length == 0" class="zj-upload_uploadragger">
          <div class="zj-upload_uploadragger--info">
            <div class="top">
              <div class="iconfont icon-upload"></div>

              <n-text style="font-size: 12px; color: #999999">拖拽到此处也可上传</n-text>
            </div>
            <n-button size="large" block color="#00a1d6">上传视频</n-button>
          </div>
        </div>
      </template>
    </n-upload>
    <template v-if="fileList.length !== 0">
      <upload-video
        :percentage="uploadPercentage"
        :uploaded="uploaded"
        :filename="fileList[0]?.name ?? '测试'"
        :is-paused="isPaused"
        :upload-all="uploadAll"
        @toggle="toggleUpload"
        @cancel="handleRemove"
        @dlete="handleDlete"
      ></upload-video>
      <video-option :uploadfile="uploadAll" @submit="submitVideo"></video-option>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, reactive } from 'vue'
import SparkMD5 from 'spark-md5'
import { upload, merge, cancelFile, gethash, dleteFile, videoInfo } from '@api'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { useAuthStore } from '@store'
import { v4 as uuidv4 } from 'uuid'
const authStore = useAuthStore()
const user = authStore.userInfo
interface Chunk {
  fileName: string
  hash: string
  chunk: Blob
  index: number
  total: number
}

interface FileInfo extends UploadFileInfo {
  hash: string
  total: number
}
// 常量定义
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB分片
const MAX_CONCURRENT = 3 // 最大并发数

// 响应式数据
const fileList = ref<UploadFileInfo[]>([])
const uuid = ref()
const uploadPercentage = ref(0)
const uploadAll = ref(false)
const isPaused = ref(false)
const newHash = ref<string | null>(null)
const newchunks = ref<Chunk[] | null>(null)
const newoption = ref<UploadCustomRequestOptions[] | null>(null)
const uploaded = reactive({
  uploadSpeed: 0,
  uploadedSize: 0,
  totalSize: 0,
  uploadError: ''
})
const speedSamples = ref<number[]>([])
const activeRequests = ref<AbortController[]>([])

const toggleUpload = (): void => {
  isPaused.value = !isPaused.value
  if (!isPaused.value && newoption.value) {
    customRequest(...newoption.value)
  } else {
    abortAllRequests()
  }
}

const handleFileChange = ({ fileList: newFileList }): void => {
  fileList.value = newFileList
}
// 上传取消文件
const handleRemove = async (): Promise<void> => {
  abortAllRequests()
  isPaused.value = true
  if (newHash.value) {
    await cancelFile(newHash.value)
  }
  resetUploadState()
}
// 上传成功后删除文件
const handleDlete = async (): Promise<void> => {
  const res = await dleteFile(uuid.value)
  if (res) {
    resetUploadState()
  }
}
// 重置
const resetUploadState = (): void => {
  fileList.value = []
  uploadAll.value = false
  isPaused.value = false
  newHash.value = null
  newchunks.value = null
  speedSamples.value = []
  newoption.value = null
  uuid.value = null
  uploaded.uploadError = ''
  uploadPercentage.value = 0
  uploaded.uploadSpeed = 0
  uploaded.uploadedSize = 0
  uploaded.totalSize = 0
}
//hash值
const calculateFileHash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunkSize = 2 * 1024 * 1024
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    reader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      currentChunk++
      currentChunk < chunks ? loadNextChunk() : resolve(spark.end())
    }

    reader.onerror = () => reject(new Error('文件读取失败'))

    const loadNextChunk = (): void => {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNextChunk()
  })
}
// 分片
const createFileChunks = (file: File, fileHash: string): Chunk[] => {
  const chunks: Chunk[] = []
  let start = 0
  let index = 0
  const total = Math.ceil(file.size / CHUNK_SIZE)

  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size)
    chunks.push({
      fileName: file.name,
      hash: fileHash,
      chunk: file.slice(start, end),
      index,
      total
    })
    start = end
    index++
  }
  return chunks
}
// 上传速度
const updateSpeed = (bytes: number, duration: number): void => {
  const sample = bytes / (duration / 1000)
  speedSamples.value = [...speedSamples.value.slice(-4), sample]
  uploaded.uploadSpeed = speedSamples.value.reduce((a, b) => a + b, 0) / speedSamples.value.length
}
// 上传分片
const uploadChunks = async (
  chunks: Chunk[],
  onProgress: (percent: number) => void
): Promise<void> => {
  const queue = [...chunks]
  let uploadedCount = uploaded.uploadedSize
  uploaded.totalSize = (fileList.value[0]?.file as File)?.size || 0 // 关键修改点

  const globalAbortController = new AbortController()
  activeRequests.value.push(globalAbortController)

  try {
    const worker = async (): Promise<void> => {
      while (queue.length > 0 && !globalAbortController.signal.aborted) {
        if (isPaused.value) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          continue
        }

        const chunk = queue.shift()!
        newchunks.value = queue
        const chunkController = new AbortController()

        try {
          const formData = new FormData()
          formData.append('uid', uuid.value)
          formData.append('file', chunk.chunk)
          formData.append('hash', chunk.hash)
          formData.append('index', chunk.index.toString())
          formData.append('total', chunk.total.toString())

          const startTime = Date.now()
          await upload(formData, { signal: chunkController.signal })

          uploadedCount += chunk.chunk.size
          uploaded.uploadedSize = uploadedCount
          const percent = Math.min(Math.round((uploadedCount / uploaded.totalSize) * 100), 100)
          onProgress(percent)
          updateSpeed(chunk.chunk.size, Date.now() - startTime)
        } finally {
          chunkController.abort()
        }
      }
    }

    await Promise.all(Array(MAX_CONCURRENT).fill(null).map(worker))
  } finally {
    activeRequests.value = activeRequests.value.filter((c) => c !== globalAbortController)
  }
}
// 自定义上传文件
const customRequest = async (...option: UploadCustomRequestOptions[]): Promise<void> => {
  const [{ file: customFile, onFinish, onError }] = newoption.value ?? option
  uploaded.uploadError = ''
  const file = customFile as FileInfo
  newoption.value = option
  try {
    const fileHash = newHash.value ?? (await calculateFileHash(file.file as File))
    await gethashs(fileHash)
    newHash.value = fileHash
    file.hash = fileHash
    const chunks = newchunks.value ?? createFileChunks(file.file as File, fileHash)
    file.total = chunks.length
    newchunks.value = chunks
    await uploadChunks(chunks, (percent) => {
      uploadPercentage.value = percent
    })

    if (isPaused.value) return

    // id.value = await getmerge(chunks[0].hash, chunks[0].fileName, chunks[0].total)
    // 合并后强制完成进度
    uploadPercentage.value = 100 // 关键修改点
    uploaded.uploadedSize = uploaded.totalSize // 关键修改点
    uploadAll.value = true
    isPaused.value = false
    onFinish()
  } catch (error) {
    uploaded.uploadError = '上传失败'
  }
}
// 取消所有请求
const abortAllRequests = (): void => {
  activeRequests.value.forEach((controller) => controller.abort())
  activeRequests.value = []
}
// 提交逻辑
const submitVideo = async (formvalue): Promise<void> => {
  const res = await videoInfo({
    ...formvalue,
    uid: uuid.value
  })
  if (res) {
    resetUploadState()
  }
}
// 检查文件是否存在
const gethashs = async (fileHash: string): Promise<void> => {
  const {
    data: { data }
  } = await gethash(fileHash)
  if (data) {
    resetUploadState()
    throw new Error('文件已存在')
  }
}
const handleBeforeUpload = async ({ file }): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (file.file?.type !== 'video/mp4') {
      uploaded.uploadError = '请上传mp4格式的视频'
      reject(new Error('请上传mp4格式的视频'))
    }
    uuid.value = uuidv4()

    resolve(true)
  })
}

onUnmounted(abortAllRequests)
</script>

<style scoped lang="scss">
@include b(upload) {
  width: 800px;
  margin: auto;
  margin-top: 50px;
  @include e(uploadragger) {
    width: 800px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #81808099;
    @include m(info) {
      width: 200px;
      text-align: center;
      .top {
        margin-bottom: 20px;
      }
    }
  }
}
.mt-3 {
  margin-top: 12px;
}
.icon-upload {
  font-size: 50px;
  line-height: 100%;
  color: #999999;
}
</style>
