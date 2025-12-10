<template>
  <n-card title="基本设置" style="margin-top: 20px">
    <n-form
      ref="formRef"
      :model="formValue"
      label-placement="left"
      label-width="auto"
      :rules="rules"
      require-mark-placement="left"
      :style="{
        maxWidth: '600px'
      }"
    >
      <n-form-item label="封面" path="cover">
        <n-upload
          :max="1"
          :default-upload="false"
          :default-file-list="fileList"
          list-type="image-card"
          @change="changeFileList"
        >
          点击上传
        </n-upload>
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="formValue.title" maxlength="40" placeholder="输入标题" show-count />
      </n-form-item>
      <n-form-item label="分类" path="category" style="width: 200px">
        <n-select
          v-model:value="formValue.categoryID"
          placeholder="Select"
          :options="generalOptions"
        />
      </n-form-item>
      <n-form-item label="标签">
        <n-dynamic-tags
          v-model:value="formValue.tags"
          :color="{ color: '#00a1d6', textColor: '#ffff' }"
          :max="5"
        />
      </n-form-item>
      <n-form-item label="简介" path="description">
        <n-input
          v-model:value="formValue.description"
          type="textarea"
          rows="5"
          maxlength="500"
          show-count
        />
      </n-form-item>
    </n-form>
    <div style="text-align: center">
      <n-button color="#33b4de" :disabled="!uploadfile" @click="handleValidateClick">
        立即投稿
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits, onMounted } from 'vue'
import { category } from '@api'
const props = defineProps({
  uploadfile: Boolean
})
const formRef = ref()
const formValue = reactive({
  title: '',
  description: '',
  categoryID: '',
  tags: []
})
const emit = defineEmits(['submit'])
const fileList = ref([])
const changeFileList = ({ fileList: newFileList }): void => {
  fileList.value = newFileList
}
const generalOptions = ref([])
const rules = {
  title: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入简介',
    trigger: 'blur'
  }
}
const handleValidateClick = async (): Promise<void> => {
  formRef.value?.validate((errors) => {
    if (!errors && props.uploadfile && fileList.value.length) {
      const obj = {
        ...formValue,
        tags: tagtoString(formValue.tags),
        cover: fileList.value[0].file
      }
      emit('submit', obj)
    }
  })
}
const tagtoString = (tags): void => {
  return tags.join(',')
}
const getCategory = async (): Promise<void> => {
  const res = await category()
  if (res) {
    let { data } = res
    data = data.data.map((item) => ({ label: item.name, value: item.categoryId }))
    generalOptions.value = data
  }
}
onMounted(() => {
  getCategory()
})
</script>

<style lang="scss" scoped></style>
