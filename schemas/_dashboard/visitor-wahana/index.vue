<template>
  <LazyCrudModule
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
import { form, customColumns } from '~/schemas/wahana-visitor'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      customColumns,
      form,
      feature: 'Visitor Wahana',
      refTable: 'tableVisitorWahana',
      needFormService: false,
      limit: 10,
      service: 'wahana-visitors'
    }
  },
  computed: {
    filterGet () {
      const role = this.$cookies.get('role_id')
      if (role === 'super_admin') { return {} }

      return this.$getAuthWithArea()
    },
    filterPost () {
      const role = this.$cookies.get('role_id')
      if (role === 'super_admin') { return {} }

      const areaId = this.$cookies.get('area_id')
      return { area: { id: areaId } }
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
