<template>
  <LazyPercobaan
    :custom-columns="customColumns"
    :feature="feature"
    :ref-table="refTable"
    :need-form-service="needFormService"
    :limit="limit"
    :service="service"
    :filter-get="filterGet"
    :filter-post="filterPost"
    :form="form"
  />
</template>

<script>
import Vue from 'vue'
import { form, customColumns } from '~/schemas/ticket'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  async asyncData ({ $strapi, $getAuthWithArea, redirect, $cookies }) {
    try {
      const packages = await $strapi.$packages.find($getAuthWithArea())
      return { packages }
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
      customColumns,
      form,
      feature: 'Tiket',
      refTable: 'tableTicket',
      needFormService: true,
      limit: 10,
      service: 'tickets'
    }
  },
  computed: {
    filterGet () {
      return this.$getAuthWithArea()
    },
    filterPost () {
      return this.$postAuthWithArea()
    }
  },
  mounted () {
    this.setPackageOptions()
  },
  methods: {
    setPackageOptions () {
      this.form[0].form[0].options = this.packages
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
