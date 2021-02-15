<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-product-component"
  >
    <a-form-model-item ref="image" prop="image" class="wrap-dragger-upload">
      <UploadImage ref="uploadImagerRef" @uploaded="uploaded" />
    </a-form-model-item>
    <a-form-model-item ref="name" label="Nama Produk" prop="name">
      <a-input
        v-model="form.name"
        placeholder="Tulis Nama Produk"
      />
    </a-form-model-item>
    <a-row>
      <a-col :sm="24" :md="12">
        <a-form-model-item ref="basePrice" label="Harga Modal" prop="basePrice">
          <a-input-number
            v-model="form.basePrice"
            type="number"
            style="width: 100%;"
            :min="0"
            inputmode="numeric"
            placeholder="Tulis Harga"
            :formatter="value => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace('Rp. ', '').replace(/\,/g, '')"
          />
        </a-form-model-item>
      </a-col>
      <a-col :sm="24" :md="12">
        <a-form-model-item ref="price" label="Harga Jual" prop="price">
          <a-input-number
            v-model="form.price"
            type="number"
            style="width: 100%;"
            :min="0"
            inputmode="numeric"
            placeholder="Tulis Harga"
            :formatter="value => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace('Rp. ', '').replace(/\,/g, '')"
          />
        </a-form-model-item>
      </a-col>
    </a-row>

    <a-form-model-item ref="unit" label="Satuan" prop="unit">
      <a-select v-model="form.unit" style="width: 100%;">
        <a-select-option v-for="(unit, idx) in unitOptions" :key="idx" :value="unit">
          {{ unit }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item ref="stock" label="Stock" prop="stock">
      <a-input-number
        v-model="form.stock"
        style="width: 100%;"
        type="number"
        inputmode="numeric"
        :min="0"
        placeholder="Tulis Stok"
      />
    </a-form-model-item>

    <a-collapse v-model="collapse" expand-icon-position="right" style="margin-bottom: 24px;">
      <a-collapse-panel key="1" header="Input Lainnya">
        <div>
          <a-row>
            <a-col :sm="24" :md="12">
              <a-form-model-item ref="basePrice" label="Harga Grosir" prop="grocery.price">
                <a-input-number
                  v-model="form.grocery.price"
                  type="number"
                  style="width: 100%;"
                  :min="0"
                  inputmode="numeric"
                  placeholder="Tulis Harga"
                  :formatter="value => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace('Rp. ', '').replace(/\,/g, '')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :sm="24" :md="12">
              <a-form-model-item ref="price" label="Minimal Pembelian" prop="grocery.minCount">
                <a-input-number
                  v-model="form.grocery.minCount"
                  type="number"
                  style="width: 100%;"
                  :min="0"
                  inputmode="numeric"
                  placeholder="Tulis Jumlah"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <a-form-model-item>
      <a-button type="primary" :loading="loadingForm" @click="onSubmit">
        {{ dataEdit ? 'Edit' : 'Tambahkan' }}
      </a-button>
      <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="resetForm">
        <template slot="title">
          <p>Apa kamu yakin ingin mereset formulir?</p>
        </template>
        <a-button style="margin-left: 10px;">
          Reset
        </a-button>
      </a-popconfirm>
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
      collapse: [],
      countTrain: 5,
      currentStream: '',
      label: '',
      offsetVideo: 0,
      predict: '',
      capturing: false,
      visible: false,
      loadingForm: false,
      loadingInit: false,
      loadingModel: false,
      unitOptions: [
        'pcs',
        'renceng',
        'kg',
        'lusin',
        'pack',
        'dus'
      ],
      form: {
        name: null,
        price: null,
        basePrice: null,
        image: null,
        stock: null,
        unit: 'pcs',
        grocery: {
          price: null,
          minCount: null
        }
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }],
        price: [{ required: true, message: 'Field is required', trigger: 'change' }],
        basePrice: [{ required: true, message: 'Field is required', trigger: 'change' }],
        unit: [{ required: true, message: 'Field is required', trigger: 'change' }]
        // image: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    dataEdit (newVal) {
      if (newVal) {
        const { grocery = { price: null, minCount: null } } = newVal
        const newGrocery = grocery || { price: null, minCount: null }
        this.form = { ...newVal, image: null, grocery: newGrocery }
        const { image = {} } = newVal
        this.$refs.uploadImagerRef.setImage(this.$generateUrl(image?.url || ''))
      }
    }
  },
  mounted () {
    if (this.dataEdit) {
      const { grocery = { price: null, minCount: null } } = this.dataEdit
      const newGrocery = grocery || { price: null, minCount: null }
      this.form = { ...this.dataEdit, image: null, grocery: newGrocery }
      const { image = {} } = this.dataEdit
      this.$refs.uploadImagerRef.setImage(this.$generateUrl(image?.url || ''))
    }
  },
  methods: {

    uploaded (val) {
      this.form.image = val
    },

    async createProduct () {
      this.loadingForm = true
      const req = this.generateDataProduct()
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
          await this.$strapi.$products.create(req)
        }

        this.$message.success('Berhasil menambah produk')
        this.form = {
          name: null,
          price: null,
          image: null,
          unit: 'pcs',
          grocery: {
            price: null,
            minCount: null
          }
        }
        this.$refs.uploadImagerRef.reset()
      } catch (err) {
        this.$message.error('Gagal menambah produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    async editProduct () {
      this.loadingForm = true
      const req = this.generateDataProduct()
      try {
        await this.$strapi.update('products', this.form?.id || 0, req)
        this.$message.success('Berhasil edit produk')
        this.form = {
          name: null,
          price: null,
          image: null,
          unit: 'pcs',
          grocery: {
            price: null,
            minCount: null
          }
        }
        this.$refs.uploadImagerRef.reset()
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error('Gagal edit produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    generateDataProduct () {
      if (this.$nuxt.isOffline) {
        return this.$postWithAuth(this.form)
      }
      const formData = new FormData()
      const { image = {}, name = '', price = 0, unit = '', id = null, stock = 0, basePrice = 0, grocery = {}, productId = null } = this.form
      const { originFileObj = '' } = image || {}
      const uniqueName = `${name} - ${unit}`
      const dataBody = { name, price, unit, uniqueName, id, stock: Number(stock), basePrice, grocery, productId: productId || this.$uuid() }
      if (originFileObj) {
        formData.append('files.image', originFileObj)
      }
      formData.append('data', JSON.stringify(this.$postWithAuth(dataBody)))
      return formData
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dataEdit) {
            this.editProduct()
          } else {
            this.createProduct()
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
