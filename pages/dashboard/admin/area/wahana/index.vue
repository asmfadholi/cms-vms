<template>
  <LazyCrudModule
    :custom-columns="customColumns"
    :feature="feature"
    :ref-table="refTable"
    :need-form-service="needFormService"
    :limit="limit"
    :service="service"
    search-by="name"
    :filter-get="filterGet"
    :is-form-data="true"
    :filter-post="filterPost"
    :form="form"
  />
</template>

<script>
import Vue from 'vue'
// import { form } from '~/schemas/area'

const customColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    fixed: 'left'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '130px',
    fixed: 'left'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Maximum Quota',
    dataIndex: 'maxQuota',
    key: 'maxQuota'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  }
]

const form = [
  {
    title: 'About Wahana',
    form: [
      {
        isRequired: true,
        label: 'Slug',
        prop: 'slug',
        type: 'shortText',
        placeholder: 'Ex: wahana-terjun'
      },
      {
        isRequired: true,
        label: 'Name',
        prop: 'name',
        type: 'shortText',
        placeholder: 'Ex: wahana air terjun'
      },
      {
        isRequired: true,
        label: 'Description',
        prop: 'description',
        type: 'longText',
        placeholder: 'Ex: Deskripsi wahana air terjun'
      },
      {
        isRequired: true,
        label: 'Images',
        prop: 'images',
        type: 'multiUpload'
      },
      {
        isRequired: true,
        label: 'Maximum Quota',
        prop: 'maxQuota',
        type: 'number',
        placeholder: 'Ex: 100'
      },
      {
        isRequired: true,
        label: 'Price',
        prop: 'price',
        type: 'number',
        placeholder: 'Ex: 1200000'
      }
    ]
  }
]

export default Vue.extend({
  layout: 'layoutAdminArea',
  middleware: 'authAdminArea',
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      customColumns,
      form,
      feature: 'Wahana',
      refTable: 'tableWahana',
      needFormService: false,
      limit: 10,
      service: 'wahanas'
    }
  },
  computed: {
    areaId () {
      return this.$cookies.get('area_id')
    },
    filterGet () {
      return { 'area.id': this.areaId }
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
