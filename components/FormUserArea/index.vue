<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-product-component"
  >
    <a-form-model-item ref="username" label="Username" prop="username">
      <a-input
        v-model="form.username"
        allow-clear
        placeholder="Tulis Username"
      />
    </a-form-model-item>

    <a-form-model-item ref="email" label="Email" prop="email">
      <a-input
        v-model="form.email"
        allow-clear
        type="email"
        placeholder="Tulis Email"
      />
    </a-form-model-item>

    <a-form-model-item ref="password" label="Password" prop="password">
      <a-input
        v-model="form.password"
        allow-clear
        type="password"
        placeholder="Tulis Password"
      />
    </a-form-model-item>

    <a-form-model-item ref="role" label="Role" prop="role">
      <a-select
        v-model="form.role"
        allow-clear
        :options="roleOptions"
        placeholder="Pilih Role"
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

export default Vue.extend({
  props: {
    dataEdit: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loadingForm: false,
      roleOptions: [
        // {
        //   value: 4,
        //   label: 'admin area'
        // },
        {
          value: 5,
          label: 'admin wahana'
        },
        {
          value: 6,
          label: 'staff area'
        },
        {
          value: 7,
          label: 'staff wahana'
        }
      ],
      form: {
        username: null,
        email: null,
        password: null,
        role: null,
        confirmed: true
      },
      rules: {
        username: [{ required: true, message: 'Field is required', trigger: 'change' }],
        email: [{ type: 'email', required: true, message: 'Field is required', trigger: 'change' }],
        password: [{ required: true, message: 'Field is required', trigger: 'change' }],
        role: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    dataEdit (newVal) {
      if (newVal) {
        this.setDataEdit(newVal)
        this.rules.password = [{ required: false, message: 'Field is required', trigger: 'change' }]
      } else {
        this.resetForm()
        this.rules.password = [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  mounted () {
    if (this.dataEdit) {
      this.setDataEdit(this.dataEdit)
      this.rules.password = [{ required: false, message: 'Field is required', trigger: 'change' }]
    }
  },
  methods: {
    setDataEdit (val) {
      this.form = { ...this.form, ...val, role: val.role?.id || 0 }
    },

    async createUser () {
      this.loadingForm = true
      const req = this.generateDataUser()
      try {
        await this.$strapi.$users.create(req)
        this.$emit('onCreated')

        this.$message.success('Berhasil menambah wahana')
        this.resetForm()
      } catch (err) {
        this.$message.error('Gagal menambah produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    async editUser () {
      this.loadingForm = true
      const req = this.generateDataUser()
      try {
        await this.$strapi.$users.update(this.form?.id || 0, req)
        this.$message.success('Berhasil update staff')
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error('Gagal update staff, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    generateDataUser () {
      const newForm = { ...this.form }
      if (!newForm.password) {
        delete newForm.password
      }
      return this.$postAuthWithArea({ ...newForm })
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dataEdit) {
            this.editUser()
          } else {
            this.createUser()
          }
        } else {
          return this.$message.error('Silahkan lengkapi data terlebih dahulu')
        }
      })
    },

    resetForm () {
      this.$refs.ruleForm.resetFields()
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
