<template>
  <div class="container-home">
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <nuxt-link to="/dashboard">
          <span>
            Beranda
          </span>
        </nuxt-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>Area</a-breadcrumb-item>
      <a-breadcrumb-item>{{ area.name }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
      <h1>
        <a-space size="small">
          <a-icon type="profile" style="font-size: 15px;" />
          <span>About Area</span>
        </a-space>
      </h1>

      <a-divider />
      <LazyFormArea :data-edit="area" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  async asyncData ({ $strapi, redirect, $cookies, route }) {
    try {
      const getArea = await $strapi.$areas.find({ slug: route.params.slug })
      return { area: getArea[0] }
    } catch (err) {
      const { response = {} } = err || {}
      const { status = 0 } = response
      if (status === 403) {
        await $strapi.logout()
        await $cookies.removeAll()
        redirect('/sorry')
      }
    }
  },
  data () {
    return {
      area: null
    }
  }
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0;
  }
}
</style>
