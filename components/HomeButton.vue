<template>
  <nuxt-link :to="`${$cookies.get('user_id') ? redirectTo : '/login'}`">
    <a-button type="primary">
      {{ $cookies.get('user_id') ? 'Masuk ke Dashboard' : 'Login' }}
    </a-button>
  </nuxt-link>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  transition: 'slide-bottom',
  computed: {
    redirectTo () {
      const role = this.$cookies.get('role_id')
      const isAdminArea = role === 'admin_area'
      const isAdminWahana = role === 'admin_wahana'
      const isSuperAdmin = role === 'super_admin'

      if (isAdminArea) {
        return '/dashboard/admin/area'
      } else if (isAdminWahana) {
        return '/dashboard/admin/wahana'
      } else if (isSuperAdmin) {
        return '/dashboard/superadmin'
      }
      return '/login'
    }
  }
})
</script>
