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
  layout: 'layoutAdminArea',
  middleware: 'authAdminArea',
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
    areaId () {
      return this.$cookies.get('area_id')
    },
    filterGet () {
      return { id: this.areaId }
    },
    filterPost () {
      return { area: { id: this.areaId } }
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
