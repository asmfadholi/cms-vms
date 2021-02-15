<template>
  <a-upload-dragger
    class="dragger-component"
    name="file"
    :multiple="multiple"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div v-if="status === 'uploading'">
      <a-icon type="loading" />
    </div>
    <div v-else-if="status === 'done'">
      <img v-lazy="image" alt="product" class="image-uploaded">
    </div>
    <div v-else>
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
    </div>
  </a-upload-dragger>
</template>
<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      status: '',
      image: ''
    }
  },
  methods: {
    getBase64 (img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },

    reset () {
      this.status = ''
      this.image = ''
    },

    setImage (img) {
      this.image = img
      this.status = 'done'
    },

    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      return isJpgOrPng
    },

    handleChange (info) {
      const This = this
      const status = info.file.status || 'error'
      if (status === 'uploading') {
        this.status = 'uploading'
        return
      }

      if (status === 'done') {
        this.status = 'done'

        this.getBase64(info.file.originFileObj, (imageData) => {
          This.image = imageData
          This.$emit('uploaded', info.file)
        })
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.status = ''
        This.image = ''
        This.$emit('uploaded', null)
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="scss">
  .ant-upload {
    height: 200px !important;
    width: 100% !important;
    border-radius: 5px !important;
    padding: 0 !important;
  }

  .dragger-component {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-uploaded {
    height: 200px !important;
    width: 100% !important;
    border-radius: 5px !important;
    object-fit: contain;
  }
</style>
