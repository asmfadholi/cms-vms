<template>
  <nuxt-link :to="`${$cookies.get('user_id') ? '/dashboard' : '/login'}`">
    <a-button type="primary">
      {{ $cookies.get('user_id') ? 'Masuk ke Dashboard' : 'Login' }}
    </a-button>
  </nuxt-link>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  transition: 'slide-bottom'
})
</script>
