<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-product-component"
  >
    <a-form-model-item ref="images" prop="images" class="wrap-dragger-upload">
      <UploadImage ref="uploadImagerRef" :multiple="false" @uploaded="uploaded" />
    </a-form-model-item>
    <a-form-model-item ref="name" label="Nama" prop="name">
      <a-input
        v-model="form.name"
        placeholder="Tulis Nama Wahana"
      />
    </a-form-model-item>

    <a-form-model-item ref="description" label="Deskripsi" prop="description">
      <a-textarea
        v-model="form.description"
        placeholder="Tulis Deskripsi Wahana"
      />
    </a-form-model-item>

    <a-form-model-item ref="maxQuota" label="Daya Tampung" prop="maxQuota">
      <a-input-number
        v-model="form.maxQuota"
        type="number"
        style="width: 100%;"
        placeholder="Tulis Maksimum Daya Tampung"
      />
    </a-form-model-item>

    <a-form-model-item :style="{ textAlign: 'center' }">
      <a-button type="primary" :loading="loadingForm" @click="onSubmit">
        {{ dataEdit ? 'Edit' : 'Simpan' }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Vue from 'vue'
import UploadImage from '@/components/UploadImage'

export default Vue.extend({
  components: {
    UploadImage
  },
  props: {
    dataEdit: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loadingForm: false,
      form: {
        name: null,
        description: null,
        maxQuota: null,
        images: null
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }],
        description: [{ required: true, message: 'Field is required', trigger: 'change' }],
        maxQuota: [{ required: true, message: 'Field is required', trigger: 'change' }]
        // location: [{ required: true, message: 'Field is required', trigger: 'change' }],
        // image: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    dataEdit (newVal) {
      if (newVal) {
        this.setDataEdit(newVal)
      } else {
        this.resetForm()
      }
    }
  },
  mounted () {
    if (this.dataEdit) {
      this.setDataEdit(this.dataEdit)
    }
  },
  methods: {
    setDataEdit (val) {
      this.form = { ...val, images: null }
      const { images = [] } = val
      this.$refs.uploadImagerRef.setImage(this.$generateUrl(images[0]?.url || ''))
    },
    uploaded (val) {
      this.form.images = [val]
    },

    async createWahana () {
      this.loadingForm = true
      const req = this.generateDataWahana()
      try {
        if (this.$nuxt.isOffline) {
          req.created_at = new Date()
          req.id = String(Date.now())
          req.productId = this.$uuid()
          req.action = 'create'
          req.uniqueName = `${req.name} - ${req.unit}`
          await this.$store.dispatch('indexdb/addProduct', req)
          await this.$store.dispatch('indexdb/getProducts')
        } else {
          await this.$strapi.$wahanas.create(req)
          this.$emit('onCreated')
        }
        this.$message.success('Berhasil menambah wahana')
        this.resetForm()
      } catch (err) {
        this.$message.error('Gagal menambah produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    async editWahana () {
      this.loadingForm = true
      const req = this.generateDataWahana()
      try {
        await this.$strapi.$wahanas.update(this.form?.id || 0, req)
        this.$message.success('Berhasil update wahana')
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error('Gagal update wahana, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    generateDataWahana () {
      if (this.$nuxt.isOffline) {
        return this.$postWithAuth(this.form)
      }
      const formData = new FormData()
      const { images = [], name = '', description = 0, maxQuota = '' } = this.form
      const { originFileObj = '' } = images?.[0] || {}
      const dataBody = { name, description, maxQuota }
      if (originFileObj) {
        formData.append('files.images', originFileObj)
      }
      formData.append('data', JSON.stringify(this.$postWahanaWithAuth(dataBody)))
      return formData
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dataEdit) {
            this.editWahana()
          } else {
            this.createWahana()
          }
        } else {
          return this.$message.error('Silahkan lengkapi data terlebih dahulu')
        }
      })
    },

    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.$refs.uploadImagerRef.reset()
    }
  }
})
</script>

<style lang="scss" scoped>
.form-product-component {
  .qr-code-scan {
    text-align: center;
    padding: 30px;
    border: 1px dashed #000;
  }

  .wrap-dragger-upload {
    width: 100%;
    border-radius: 5px;
  }
}
</style>
