<template>
  <div class="clearfix">
    <a-upload
      name="file"
      list-type="picture-card"
      :multiple="multiple"
      :file-list="normalizeValue"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="value.length < 8">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%;" :src="previewImage">
    </a-modal>
  </div>
</template>
<script>
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: ''
    }
  },
  computed: {
    normalizeValue () {
      return this.value.map((val, idx) => ({ uid: idx, name: val.name, status: val.status || 'done', url: val.url, ...val }))
    }
  },
  methods: {
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    beforeUpload () {
      return false
    },

    handleChange (info) {
      this.fileList = info.fileList
      this.$emit('input', info.fileList)
    }
  }
}
</script>

<style lang="scss">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
