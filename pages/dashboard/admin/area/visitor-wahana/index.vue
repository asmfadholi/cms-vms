<template>
  <LazyCrudModule
    :custom-columns="customColumns"
    :feature="feature"
    :ref-table="refTable"
    :need-form-service="needFormService"
    :limit="limit"
    :service="service"
    :filter-get-form="filterGetForm"
    :filter-get="filterGet"
    :filter-post="filterPost"
    :form="form"
  />
</template>

<script>
import Vue from 'vue'

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
    key: 'name'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender'
  }
]

const form = [
  {
    title: 'About Visitor',
    form: [
      {
        isRequired: true,
        label: 'Pilih Wahana',
        prop: 'wahana',
        type: 'singleSelect',
        options: [],
        placeholder: 'Pilih Wahana'
      },
      {
        isRequired: true,
        label: 'Name',
        prop: 'name',
        type: 'shortText',
        placeholder: 'Ex: nama saya'
      },
      {
        isRequired: true,
        label: 'Email',
        prop: 'email',
        type: 'email',
        placeholder: 'Ex: Email saya'
      },
      {
        isRequired: true,
        label: 'Gender',
        prop: 'gender',
        type: 'radio',
        options: [{ name: 'Perempuan', id: 'perempuan' }, { name: 'Laki-laki', id: 'laki-laki' }],
        placeholder: 'Ex: 100'
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
      feature: 'Visitor Wahana',
      refTable: 'tableWahanaVisitors',
      needFormService: true,
      limit: 10,
      service: 'wahana-visitors'
    }
  },
  computed: {
    areaId () {
      return this.$cookies.get('area_id')
    },
    filterGetForm () {
      return { 'area.id': this.areaId }
    },
    filterGet () {
      return { 'wahana.area.id': this.areaId }
    },
    filterPost () {
      return { area: { id: this.areaId }, isCheckin: true }
    }
  },
  created () {
    this.getWahanas()
  },
  methods: {
    async getWahanas () {
      const res = await this.$strapi.$wahanas.find({ 'area.id': this.areaId })
      form[0].form[0].options = res
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
