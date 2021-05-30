<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="login-page"
    @submit="onSubmit"
  >
    <h2 class="wrap-logo">
      <nuxt-link to="/">
        <img src="~assets/images/outing-logo.png" class="logo" alt="pazarin">
      </nuxt-link>
    </h2>
    <a-form-model-item ref="identifier" label="Email" prop="identifier">
      <a-input
        v-model="form.identifier"
        type="email"
        placeholder="Tulis Emailmu"
      />
    </a-form-model-item>

    <a-form-model-item ref="password" label="Password" prop="password">
      <a-input
        v-model="form.password"
        type="password"
        placeholder="Tulis Passwordmu"
      />
    </a-form-model-item>

    <a-form-model-item style="text-align: center;">
      <a-button type="primary" :loading="loading" html-type="submit" @click="onSubmit">
        Masuk
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'auth',
  middleware: 'auth',
  data () {
    return {
      loading: false,
      form: {
        identifier: '',
        password: ''
      },
      rules: {
        identifier: [
          { required: true, message: 'Field is required', trigger: 'change' },
          { type: 'email', message: 'Must be of type email', trigger: 'change' }
        ],
        password: [
          { required: true, message: 'Field is required', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.doLogin(this.form)
        }
      })
    },

    redirectTo (role) {
      const isAdminArea = role === 'admin_area'
      const isAdminWahana = role === 'admin_wahana'

      if (isAdminArea) {
        this.$router.replace('/dashboard/admin/area')
        this.$message.success('Login Berhasil, Selamat Datang')
      } else if (isAdminWahana) {
        this.$router.replace('/dashboard/admin/wahana')
        this.$message.success('Login Berhasil, Selamat Datang')
      } else {
        this.$message.error('Login Gagal, Silahkan Coba Lagi')
      }
    },
    async doLogin (val) {
      try {
        this.loading = true

        const { user = {} } = await this.$strapi.login(val)
        const { role = {}, area = {}, wahana = {} } = user

        // id
        this.$strapi.$cookies.set('user_id', user?.id || 0)
        this.$strapi.$cookies.set('role_id', role?.type || 0)
        this.$strapi.$cookies.set('area_id', area?.id || 0)
        this.$strapi.$cookies.set('wahana_id', wahana?.id || 0)

        // slug
        this.$strapi.$cookies.set('area_slug', area?.slug || 0)
        this.$strapi.$cookies.set('wahana_slug', wahana?.slug || 0)

        this.redirectTo(role?.type)
      } catch (_) {
        this.$message.error('Login Gagal, Silahkan Coba Lagi')
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.login-page {
  .logo {
    height: 120px;
    width: 120px;
    margin: auto 0;
    object-fit: contain;
    background: transparent;
  }

  .wrap-logo {
    display: flex;
    justify-content: center;
  }
}
</style>
