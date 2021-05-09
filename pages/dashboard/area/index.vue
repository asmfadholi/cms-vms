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
import { form, customColumns } from '~/schemas/area'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      customColumns,
      form,
      feature: 'Area',
      refTable: 'tableArea',
      needFormService: false,
      limit: 10,
      service: 'areas'
    }
  },
  computed: {
    filterGet () {
      return { id: this.$cookies.get('area_id') }
    },
    filterPost () {
      return this.$postAuthWithArea()
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
